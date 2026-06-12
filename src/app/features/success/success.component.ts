import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-success',
  standalone: true,
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
})
export class SuccessComponent implements OnInit {
  private route    = inject(ActivatedRoute);
  private orderSvc = inject(OrderService);
  router = inject(Router);

  order = signal<Order | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      if (p['id']) {
        const o = this.orderSvc.getById(+p['id']);
        if (o) this.order.set(o);
      }
    });
  }

  get paymentLabel(): string {
    const map: Record<string, string> = {
      efectivo: '💵 Efectivo al recibir',
      paypal:   '💙 PayPal confirmado',
      'uber-eats': '🚗 Uber Eats',
      rappi:    '🛵 Rappi',
    };
    return map[this.order()?.paymentMethod ?? 'efectivo'] ?? '💵 Efectivo';
  }
}
