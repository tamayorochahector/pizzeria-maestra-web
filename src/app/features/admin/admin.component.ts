import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmService } from '../../shared/components/confirm-dialog/confirm.service';
import { ApiService } from '../../core/services/api.service';
import { Product, CATS } from '../../core/models/product.model';
import { Order, OrderStatus, STATUS_FLOW, STATUS_LABELS, STATUS_BADGE } from '../../core/models/order.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  private auth       = inject(AuthService);
  private orderSvc   = inject(OrderService);
  private productSvc = inject(ProductService);
  private notify     = inject(NotificationService);
  private confirm    = inject(ConfirmService);
  private api = inject(ApiService);
private _orders = signal<Order[]>([]);
  router = inject(Router);
  ngOnInit(): void {
    this.api.getOrders().subscribe(orders => {
      this._orders.set(orders.map(o => ({
        ...o,
        userId: o.user_id,
        userName: o.user_name,
        deliveryType: o.delivery_type,
        items: o.order_items || []
      })));
    });
  }

  activeTab    = signal<'dashboard' | 'pedidos' | 'menu' | 'usuarios'>('dashboard');
  statusLabels = STATUS_LABELS;
  statusBadge  = STATUS_BADGE;
  statusFlow   = [...STATUS_FLOW, 'cancelado' as OrderStatus];
  cats         = CATS;

  editOpen  = signal(false);
  editId    = signal<number | null>(null);
  editName  = signal(''); editDesc  = signal('');
  editCat   = signal('pizzas'); editEmoji = signal('🍕');
  editImage = signal('');
  editSizes = signal<{ label: string; price: number }[]>([{ label: '', price: 0 }]);
  dragOver  = signal(false);

  newAdminOpen  = signal(false);
  newAdminName  = signal(''); newAdminEmail = signal('');
  newAdminPhone = signal(''); newAdminPass  = signal('');
  newAdminError = signal('');

  get orders(): Order[] { return this._orders(); }
  get products(): Product[] { return this.productSvc.products(); }
  get users():    any[]     { return this.auth.users(); }

  get todayOrders(): number {
    const t = new Date().toDateString();
    return this.orders.filter(o => new Date(o.date).toDateString() === t).length;
  }
  get totalSales(): number {
    return this.orders.filter(o => o.status !== 'cancelado').reduce((s, o) => s + o.total, 0);
  }
  get pendingCount(): number { return this.orders.filter(o => o.status === 'pendiente').length; }
  get onWayCount():   number { return this.orders.filter(o => o.status === 'en-camino').length; }

  get weekData(): { label: string; pct: number; peak: boolean; total: number }[] {
    const days = ['D','L','M','Mi','J','V','S'];
    const now  = new Date(); const today = now.toDateString();
    const data = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - 6 + i);
      const ds = d.toDateString();
      const total = this.orders
        .filter(o => new Date(o.date).toDateString() === ds && o.status !== 'cancelado')
        .reduce((s, o) => s + o.total, 0);
      return { label: days[d.getDay()], total, cur: ds === today };
    });
    const mx = Math.max(...data.map(d => d.total), 1);
    return data.map(d => ({ label: d.label, pct: Math.max(4, Math.round(d.total / mx * 100)), peak: d.cur, total: d.total }));
  }

  setTab(t: 'dashboard' | 'pedidos' | 'menu' | 'usuarios'): void { this.activeTab.set(t); }

  updateStatus(id: number, status: string): void {
  this.api.updateOrderStatus(id, status).subscribe(() => {
    this.api.getOrders().subscribe(orders => {
      this._orders.set(orders.map(o => ({
        ...o,
        userId: o.user_id,
        userName: o.user_name,
        deliveryType: o.delivery_type,
        items: o.order_items || []
      })));
    });
    this.notify.show(`Pedido #${id} → ${STATUS_LABELS[status]}`, 'success');
  });
}

advance(id: number): void {
  const o = this._orders().find(x => x.id === id);
  if (!o) return;
  const i = STATUS_FLOW.indexOf(o.status);
  if (i < STATUS_FLOW.length - 1) this.updateStatus(id, STATUS_FLOW[i + 1]);
}
  canAdvance(o: Order): boolean { return o.status !== 'entregado' && o.status !== 'cancelado'; }
  orderDate(o: Order): string {
    return new Date(o.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
  itemsStr(o: Order): string { return o.items.map(i => `${i.emoji} ${i.productName} ×${i.qty}`).join(' · '); }
  minPrice(p: Product): number { return Math.min(...p.sizes.map(s => s.price)); }

  openNew(): void {
    this.editId.set(null); this.editName.set(''); this.editDesc.set('');
    this.editCat.set('pizzas'); this.editEmoji.set('🍕'); this.editImage.set('');
    this.editSizes.set([{ label: '', price: 0 }]); this.editOpen.set(true);
    setTimeout(() => document.querySelector('.edit-form')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }
  openEdit(p: Product): void {
    this.editId.set(p.id); this.editName.set(p.name); this.editDesc.set(p.desc);
    this.editCat.set(p.cat); this.editEmoji.set(p.emoji); this.editImage.set(p.image);
    this.editSizes.set(p.sizes.map(s => ({ ...s }))); this.editOpen.set(true);
    setTimeout(() => document.querySelector('.edit-form')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }
  closeEdit(): void { this.editOpen.set(false); }
  addSizeRow(): void { this.editSizes.update(s => [...s, { label: '', price: 0 }]); }
  removeSize(i: number): void { this.editSizes.update(s => s.filter((_, idx) => idx !== i)); }
  setSizeLabel(i: number, v: string): void { this.editSizes.update(s => s.map((x, idx) => idx === i ? { ...x, label: v } : x)); }
  setSizePrice(i: number, v: number): void { this.editSizes.update(s => s.map((x, idx) => idx === i ? { ...x, price: v } : x)); }

  triggerFileInput(): void { document.getElementById('img-file-input')?.click(); }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.loadImageFile(input.files[0]);
  }
  onDragOver(event: DragEvent): void { event.preventDefault(); this.dragOver.set(true); }
  onDragLeave(): void { this.dragOver.set(false); }
  onDrop(event: DragEvent): void {
    event.preventDefault(); this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) this.loadImageFile(file);
    else this.notify.show('Solo se aceptan imágenes', 'error');
  }
  private loadImageFile(file: File): void {
    if (file.size > 5 * 1024 * 1024) { this.notify.show('Imagen demasiado grande (máx 5MB)', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => this.editImage.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }
  clearImage(): void { this.editImage.set(''); }

  async saveProduct(): Promise<void> {
    if (!this.editName().trim()) { this.notify.show('Ingresa un nombre', 'error'); return; }
    const sizes = this.editSizes().filter(s => s.label && s.price > 0);
    if (!sizes.length) { this.notify.show('Agrega al menos un tamaño', 'error'); return; }
    const data = { name: this.editName(), desc: this.editDesc(), cat: this.editCat(),
      emoji: this.editEmoji() || '🍕', image: this.editImage(), sizes, featured: false };
    if (this.editId()) { await this.productSvc.update(this.editId()!, data); this.notify.show('Producto actualizado ✓', 'success'); }
    else               { await this.productSvc.add(data); this.notify.show('Producto creado ✓', 'success'); }
    this.closeEdit();
  }
  async deleteProduct(id: number): Promise<void> {
  this.confirm.show('¿Eliminar producto?', 'Esta acción no se puede deshacer', async () => {
    await this.productSvc.delete(id);
    this.notify.show('Producto eliminado', 'success');
  });
}

  openNewAdmin(): void {
    this.newAdminName.set(''); this.newAdminEmail.set('');
    this.newAdminPhone.set(''); this.newAdminPass.set('');
    this.newAdminError.set(''); this.newAdminOpen.set(true);
  }
  closeNewAdmin(): void { this.newAdminOpen.set(false); }
 async saveNewAdmin(): Promise<void> {
  const err = await this.auth.createAdmin(
    this.newAdminName(), this.newAdminEmail(),
    this.newAdminPhone(), this.newAdminPass()
  );
  if (err) { this.newAdminError.set(err); return; }
  this.notify.show('Admin creado ✓', 'success');
  this.closeNewAdmin();
}
}
