import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product, CATS } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private productSvc = inject(ProductService);
  private cart       = inject(CartService);
  private notify     = inject(NotificationService);
  router = inject(Router);

  cats        = CATS;
  selectedCat = signal('pizzas');

  get featured(): Product[] { return this.productSvc.getFeatured(); }
  get popular():  Product[] {
    return this.productSvc.products().filter(p => p.cat==='pizzas' && !p.featured).slice(0,6);
  }

  minPrice(p: Product): number { return Math.min(...p.sizes.map(s => s.price)); }

  goMenuCat(cat: string): void {
    this.selectedCat.set(cat);
    this.router.navigate(['/menu'], { queryParams: { cat } });
  }

  openProduct(p: Product): void {
    this.router.navigate(['/menu'], { queryParams: { cat: p.cat, open: p.id } });
  }

  quickAdd(p: Product, e: Event): void {
    e.stopPropagation();
    this.cart.add(p, p.sizes[0]);
    this.notify.show(`${p.emoji} ${p.name} agregado`, 'success');
  }
}
