import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private auth = inject(AuthService);
  private cart = inject(CartService);
  router = inject(Router);
  session   = this.auth.session;
  cartCount = this.cart.count;
  isAdmin   = this.auth.isAdmin;
  navItems  = [
    { path:'/home',     icon:'🏠', label:'Inicio'   },
    { path:'/menu',     icon:'🍕', label:'Menú'     },
    { path:'/cart',     icon:'🛒', label:'Carrito'  },
    { path:'/tracking', icon:'📦', label:'Rastrear' },
    { path:'/profile',  icon:'👤', label:'Perfil'   },
  ];
  get userInitial(): string { return this.session()?.name?.[0]?.toUpperCase() ?? ''; }
  logout(): void { this.auth.logout(); this.router.navigate(['/home']); }
}
