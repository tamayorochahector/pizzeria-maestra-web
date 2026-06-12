import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product, CATS } from '../../core/models/product.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  private route      = inject(ActivatedRoute);
  private productSvc = inject(ProductService);
  private cart       = inject(CartService);
  private notify     = inject(NotificationService);

  cats        = CATS;
  currentCat  = signal('pizzas');
  search      = signal('');
  sort        = signal('default');
  sheetOpen   = signal(false);
  sheetProd   = signal<Product|null>(null);
  sheetSzIdx  = signal(0);

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      if (p['cat'])  this.currentCat.set(p['cat']);
      if (p['open']) {
        const prod = this.productSvc.getById(+p['open']);
        if (prod) this.openSheet(prod);
      }
    });
  }

  get filtered(): Product[] {
    const s = this.search().toLowerCase();
    let list = this.productSvc.products().filter(p =>
      p.cat === this.currentCat() &&
      (p.name.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s))
    );
    if (this.sort()==='az')         list = [...list].sort((a,b)=>a.name.localeCompare(b.name));
    if (this.sort()==='price-asc')  list = [...list].sort((a,b)=>a.sizes[0].price-b.sizes[0].price);
    if (this.sort()==='price-desc') list = [...list].sort((a,b)=>b.sizes[0].price-a.sizes[0].price);
    return list;
  }

  minPrice(p: Product): number { return Math.min(...p.sizes.map(s=>s.price)); }
  setCat(cat: string): void { this.currentCat.set(cat); this.search.set(''); }

  openSheet(p: Product): void { this.sheetProd.set(p); this.sheetSzIdx.set(0); this.sheetOpen.set(true); }
  closeSheet(): void { this.sheetOpen.set(false); }
  selectSize(i: number): void { this.sheetSzIdx.set(i); }

  get sheetPrice(): number {
    const p = this.sheetProd();
    return p ? p.sizes[this.sheetSzIdx()].price : 0;
  }

  addFromSheet(): void {
    const p = this.sheetProd();
    if (!p) return;
    this.cart.add(p, p.sizes[this.sheetSzIdx()]);
    this.notify.show(`${p.emoji} ${p.name} agregado`, 'success');
    this.closeSheet();
  }

  quickAdd(p: Product, e: Event): void {
    e.stopPropagation();
    this.cart.add(p, p.sizes[0]);
    this.notify.show(`${p.emoji} ${p.name} agregado`, 'success');
  }

  onOverlay(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.closeSheet();
  }
}
