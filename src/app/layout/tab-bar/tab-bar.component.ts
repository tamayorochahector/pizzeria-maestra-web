import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.css',
})
export class TabBarComponent {
  cartCount = inject(CartService).count;
  tabs = [
    { path:'/home',     icon:'🏠', label:'Inicio'   },
    { path:'/menu',     icon:'🍕', label:'Menú'     },
    { path:'/cart',     icon:'🛒', label:'Carrito'  },
    { path:'/tracking', icon:'📦', label:'Rastrear' },
    { path:'/profile',  icon:'👤', label:'Perfil'   },
  ];
}
