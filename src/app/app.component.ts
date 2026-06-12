import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent }       from './layout/header/header.component';
import { SidebarComponent }      from './layout/sidebar/sidebar.component';
import { TabBarComponent }       from './layout/tab-bar/tab-bar.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { OrderService }          from './core/services/order.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    TabBarComponent,
    NotificationComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private orderSvc = inject(OrderService);
  ngOnInit(): void { this.orderSvc.startAutoAdvance(); }
}
