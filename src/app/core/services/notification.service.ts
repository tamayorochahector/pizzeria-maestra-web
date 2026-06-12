import { Injectable, signal } from '@angular/core';
export interface NotifData { message: string; type: 'default'|'success'|'error'; visible: boolean; }
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _n = signal<NotifData>({ message:'', type:'default', visible:false });
  readonly notif = this._n.asReadonly();
  private t: any;
  show(message: string, type: 'default'|'success'|'error' = 'default'): void {
    if (this.t) clearTimeout(this.t);
    this._n.set({ message, type, visible: true });
    this.t = setTimeout(() => this._n.update(n => ({ ...n, visible: false })), 3000);
  }
}
