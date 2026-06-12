import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  template: `
    <div id="notification" [class.show]="notif().visible" [class]="'notification ' + notif().type + (notif().visible ? ' show' : '')">
      <span class="ni">{{ icon }}</span>{{ notif().message }}
    </div>
  `,
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  private ns = inject(NotificationService);
  notif = this.ns.notif;
  get icon(): string {
    return this.notif().type==='success' ? '✅' : this.notif().type==='error' ? '❌' : '🍕';
  }
}
