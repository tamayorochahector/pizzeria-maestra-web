import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<Product[]>([]);
  readonly products = this._products.asReadonly();

  constructor(private api: ApiService) {
    this.api.getProducts().subscribe(p => this._products.set(p));
  }

  getFeatured(): Product[] { return this._products().filter(p => p.featured); }
  getByCategory(cat: string): Product[] { return this._products().filter(p => p.cat === cat); }
  getById(id: number): Product | undefined { return this._products().find(p => p.id === id); }

  add(product: Omit<Product, 'id'>): Promise<void> {
    return new Promise(resolve => {
      this.api.addProduct(product).subscribe(p => {
        this._products.update(ps => [...ps, p]);
        resolve();
      });
    });
  }

  update(id: number, changes: Partial<Product>): Promise<void> {
    return new Promise(resolve => {
      this.api.updateProduct(id, changes).subscribe(updated => {
        this._products.update(ps => ps.map(p => p.id === id ? updated : p));
        resolve();
      });
    });
  }

  delete(id: number): Promise<void> {
    return new Promise(resolve => {
      this.api.deleteProduct(id).subscribe(() => {
        this._products.update(ps => ps.filter(p => p.id !== id));
        resolve();
      });
    });
  }
}