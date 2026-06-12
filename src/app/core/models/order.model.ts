export interface OrderItem {
  key: string;
  productId: number;
  productName: string;
  emoji: string;
  image: string;
  size: { label: string; price: number };
  qty: number;
}

export type OrderStatus = 'pendiente' | 'preparando' | 'en-camino' | 'entregado' | 'cancelado';
export type PaymentMethod = 'efectivo' | 'paypal' | 'uber-eats' | 'rappi';

export interface TimelineEntry { status: OrderStatus; time: string; }

export interface Order {
  id: number;
  userId: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  envio: number;
  total: number;
  deliveryType: 'domicilio' | 'recoger';
  address: string;
  notes: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  date: string;
  timeline: TimelineEntry[];
}

export const STATUS_FLOW: OrderStatus[] = ['pendiente','preparando','en-camino','entregado'];

export const STATUS_LABELS: Record<string, string> = {
  pendiente:   'PENDIENTE',
  preparando:  'PREPARANDO',
  'en-camino': 'EN CAMINO',
  entregado:   'ENTREGADO',
  cancelado:   'CANCELADO',
};

export const STATUS_BADGE: Record<string, string> = {
  pendiente:   'badge-orange',
  preparando:  'badge-amber',
  'en-camino': 'badge-blue',
  entregado:   'badge-green',
  cancelado:   'badge-red',
};
