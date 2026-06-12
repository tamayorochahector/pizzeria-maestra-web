import { Component, signal, inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { NotificationService } from '../../core/services/notification.service';
import { PaymentMethod } from '../../core/models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements AfterViewInit {
  private cartSvc  = inject(CartService);
  private auth     = inject(AuthService);
  private orderSvc = inject(OrderService);
  private notify   = inject(NotificationService);
  router = inject(Router);

  items    = this.cartSvc.items;
  subtotal = this.cartSvc.subtotal;

  deliveryType     = signal<'domicilio' | 'recoger'>('domicilio');
  paymentMethod    = signal<PaymentMethod>('efectivo');
  address          = signal('');
  colonia          = signal('');
  referencia       = signal('');
  notes            = signal('');
  paypalLoaded     = signal(false);
  processingPaypal = signal(false);

  get envio(): number {
    return this.deliveryType() === 'recoger' ? 0 : (this.subtotal() >= 300 ? 0 : 45);
  }
  get total(): number { return this.subtotal() + this.envio; }

  setDelivery(t: 'domicilio' | 'recoger'): void { this.deliveryType.set(t); }
  setPayment(m: PaymentMethod): void {
    this.paymentMethod.set(m);
    if (m === 'paypal') setTimeout(() => this.renderPaypalButton(), 300);
  }
  changeQty(i: number, d: number): void { this.cartSvc.changeQty(i, d); }
  remove(i: number): void { this.cartSvc.remove(i); this.notify.show('Producto eliminado'); }

  ngAfterViewInit(): void { this.loadPaypalScript(); }

  loadPaypalScript(): void {
    if ((window as any).paypal) { this.paypalLoaded.set(true); return; }
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AZ_SANDBOX_CLIENT_ID&currency=MXN&locale=es_MX';
    script.onload = () => this.paypalLoaded.set(true);
    document.body.appendChild(script);
  }

  renderPaypalButton(): void {
    const pp = (window as any).paypal;
    if (!pp) return;
    const container = document.getElementById('paypal-button-container');
    if (!container || container.children.length > 0) return;
    pp.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 45 },
      createOrder: (_: any, actions: any) => actions.order.create({
        purchase_units: [{
          amount: { value: this.total.toFixed(2), currency_code: 'MXN' },
          description: `Pizzería Durango — ${this.items().length} producto(s)`,
        }],
      }),
      onApprove: (_: any, actions: any) => {
        this.processingPaypal.set(true);
        return actions.order.capture().then(() => {
          this.processingPaypal.set(false);
          this.notify.show('✅ Pago con PayPal aprobado', 'success');
          this.placeOrder('paypal');
        });
      },
      onError: (err: any) => {
        this.processingPaypal.set(false);
        this.notify.show('❌ Error en PayPal, intenta de nuevo', 'error');
        console.error('PayPal error:', err);
      },
      onCancel: () => this.notify.show('Pago con PayPal cancelado'),
    }).render('#paypal-button-container');
  }

  openUberEats(): void {
    window.open('https://www.ubereats.com', '_blank');
    this.notify.show('Abriendo Uber Eats 🛵');
  }
  openRappi(): void {
    window.open('https://www.rappi.com.mx', '_blank');
    this.notify.show('Abriendo Rappi 🛵');
  }

  confirmOrder(): void {
    if (!this.validateOrder()) return;
    this.placeOrder(this.paymentMethod());
  }

  async placeOrder(method: PaymentMethod): Promise<void> {
    const session = this.auth.session()!;
    const addr = this.deliveryType() === 'domicilio'
      ? `${this.address()}, ${this.colonia()}`
      : 'Recoger en tienda — Av. 20 de Noviembre 123, Centro';
    const order = await this.orderSvc.create({
      userId: session.id, userName: session.name,
      items: this.items(), subtotal: this.subtotal(),
      envio: this.envio, total: this.total,
      deliveryType: this.deliveryType(), address: addr,
      notes: this.notes(), paymentMethod: method,
    });
    this.auth.incrementOrders(session.id);
    this.cartSvc.clear();
    this.router.navigate(['/success'], { queryParams: { id: order.id } });
  }

  private validateOrder(): boolean {
    if (!this.items().length)    { this.notify.show('Agrega productos primero', 'error'); return false; }
    if (!this.auth.isLoggedIn()) { this.notify.show('Inicia sesión para continuar', 'error'); this.router.navigate(['/login']); return false; }
    if (this.deliveryType() === 'domicilio' && !this.address().trim()) {
      this.notify.show('Ingresa tu dirección', 'error'); return false;
    }
    return true;
  }
}
