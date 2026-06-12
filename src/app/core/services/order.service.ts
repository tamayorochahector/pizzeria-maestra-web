import { Injectable, signal } from '@angular/core';
import { Order, OrderStatus, STATUS_FLOW } from '../models/order.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private _orders = signal<Order[]>([]);
  readonly orders = this._orders.asReadonly();

  constructor(private api: ApiService) {
    this.api.getOrders().subscribe(o => this._orders.set(o));
  }

  create(data: Omit<Order,'id'|'status'|'date'|'timeline'>): Promise<Order> {
    return new Promise(resolve => {
      this.api.createOrder(data).subscribe(order => {
        this._orders.update(os => [order, ...os]);
        resolve(order);
      });
    });
  }

  updateStatus(id: number, status: OrderStatus): void {
    this.api.updateOrderStatus(id, status).subscribe(updated => {
      this._orders.update(os => os.map(o => o.id === id ? updated : o));
    });
  }

  advance(id: number): void {
    const o = this._orders().find(x => x.id === id);
    if (!o) return;
    const i = STATUS_FLOW.indexOf(o.status);
    if (i < STATUS_FLOW.length - 1) this.updateStatus(id, STATUS_FLOW[i + 1]);
  }

  getByUser(userId: string): Order[] { return this._orders().filter(o => o.userId === userId); }
  getById(id: number): Order | undefined { return this._orders().find(o => o.id === id); }

  startAutoAdvance(): void {
    setInterval(() => {
      this._orders().forEach(o => {
        if (o.status === 'pendiente') {
          const elapsed = (Date.now() - new Date(o.date).getTime()) / 1000;
          if (elapsed > 15) this.updateStatus(o.id, 'preparando');
        } else if (o.status === 'preparando') {
          const lc = o.timeline?.filter(t => t.status === 'preparando').pop();
          if (lc && (Date.now() - new Date(lc.time).getTime()) / 1000 > 90)
            this.updateStatus(o.id, 'en-camino');
        }
      });
    }, 5000);
  }
}