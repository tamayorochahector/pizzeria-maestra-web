import { Component, OnInit, signal, inject } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ApiService } from '../../core/services/api.service';
import { Order, STATUS_LABELS, STATUS_BADGE } from '../../core/models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css',
})
export class TrackingComponent implements OnInit {
  private orderSvc = inject(OrderService);
  private auth     = inject(AuthService);
  private notify   = inject(NotificationService);
  private api      = inject(ApiService);

  displayedOrders = signal<Order[]>([]);
  trackInput      = signal('');
  statusLabels    = STATUS_LABELS;
  statusBadge     = STATUS_BADGE;

  steps = [
    { key:'pendiente',  label:'Pedido recibido', icon:'📝', desc:'Confirmamos tu pedido' },
    { key:'preparando', label:'En preparación',  icon:'👨‍🍳', desc:'Nuestros pizzeros están trabajando' },
    { key:'en-camino',  label:'En camino',       icon:'🛵', desc:'Tu repartidor va en camino' },
    { key:'entregado',  label:'Entregado',        icon:'✅', desc:'¡Disfruta tu pizza!' },
  ];

  ngOnInit(): void {
    const s = this.auth.session();
    if (s) {
      this.api.getOrdersByUser(s.id).subscribe(orders => {
        // Mapear campos de BD a modelo
        const mapped = orders.map(o => this.mapOrder(o));
        this.displayedOrders.set(mapped);
      });
    }
  }

  search(): void {
    const val = this.trackInput().replace('#','').trim();
    const id  = parseInt(val);
    if (!id) { this.notify.show('Número inválido','error'); return; }
    this.api.getOrderById(id).subscribe({
      next: (o) => this.displayedOrders.set([this.mapOrder(o)]),
      error: () => this.notify.show('Orden no encontrada','error')
    });
  }

  private mapOrder(o: any): Order {
    return {
      ...o,
      userId: o.user_id,
      userName: o.user_name,
      deliveryType: o.delivery_type,
      items: o.order_items || []
    };
  }

  stepState(order: Order, key: string): 'done'|'current'|'pending' {
    const map: Record<string,number> = { pendiente:0, preparando:1, 'en-camino':2, entregado:3 };
    const cur = map[order.status] ?? 0;
    const si  = map[key] ?? 0;
    if (si < cur) return 'done';
    if (si === cur && order.status !== 'cancelado') return 'current';
    return 'pending';
  }

  stepTime(order: Order, key: string): string {
    const te = order.timeline?.find(t => t.status === key);
    return te ? new Date(te.time).toLocaleTimeString('es-MX',{ hour:'2-digit', minute:'2-digit' }) : '';
  }

  orderDate(o: Order): string {
    return new Date(o.date).toLocaleDateString('es-MX',{
      weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'
    });
  }

  itemsSummary(o: Order): string {
    return (o.items || []).slice(0,3).map((i: any) => `${i.emoji} ${i.productName || i.product_name} ×${i.qty}`).join(' · ');
  }
}