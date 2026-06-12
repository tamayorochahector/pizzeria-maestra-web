import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private auth     = inject(AuthService);
  private cartSvc  = inject(CartService);
  private orderSvc = inject(OrderService);
  private notify   = inject(NotificationService);
  router = inject(Router);

  session    = this.auth.session;
  isAdmin    = this.auth.isAdmin;
  isLoggedIn = this.auth.isLoggedIn;

  get userInitial(): string { return this.session()?.name?.[0]?.toUpperCase() ?? ''; }
  get cartCount(): number   { return this.cartSvc.count(); }
  get myOrdersCount(): number {
    const s = this.session();
    return s ? this.orderSvc.getByUser(s.id).length : 0;
  }
  get lastOrder() {
    const s = this.session();
    if (!s) return null;
    const orders = this.orderSvc.getByUser(s.id);
    return orders[0] ?? null;
  }

  logout(): void {
    this.auth.logout();
    this.notify.show('Sesión cerrada');
    this.router.navigate(['/home']);
  }
}
