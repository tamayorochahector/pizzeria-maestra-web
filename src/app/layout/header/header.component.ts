import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  router = inject(Router);
  session   = this.auth.session;
  cartCount = this.cart.count;
  get userInitial(): string { return this.session()?.name?.[0]?.toUpperCase() ?? ''; }
}
