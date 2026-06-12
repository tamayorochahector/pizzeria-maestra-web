import { Injectable, signal, computed } from '@angular/core';
import { OrderItem } from '../models/order.model';
import { Product, ProductSize } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<OrderItem[]>(this.load());
  readonly items    = this._items.asReadonly();
  readonly count    = computed(() => this._items().reduce((s,i) => s+i.qty, 0));
  readonly subtotal = computed(() => this._items().reduce((s,i) => s+i.size.price*i.qty, 0));

  private load(): OrderItem[] {
    try { const v = localStorage.getItem('pz_cart'); return v ? JSON.parse(v) : []; } catch { return []; }
  }
  private save(): void { try { localStorage.setItem('pz_cart', JSON.stringify(this._items())); } catch {} }

  add(product: Product, size: ProductSize): void {
    const key = `${product.id}-${size.label}`;
    const ex = this._items().find(i => i.key === key);
    if (ex) {
      this._items.update(items => items.map(i => i.key === key ? { ...i, qty: i.qty+1 } : i));
    } else {
      this._items.update(items => [...items, {
        key, productId: product.id, productName: product.name,
        emoji: product.emoji, image: product.image, size, qty: 1,
      }]);
    }
    this.save();
  }
  changeQty(idx: number, delta: number): void {
    const items = [...this._items()];
    items[idx] = { ...items[idx], qty: items[idx].qty + delta };
    if (items[idx].qty <= 0) items.splice(idx, 1);
    this._items.set(items); this.save();
  }
  remove(idx: number): void {
    this._items.update(items => items.filter((_,i) => i !== idx)); this.save();
  }
  clear(): void { this._items.set([]); this.save(); }
}
