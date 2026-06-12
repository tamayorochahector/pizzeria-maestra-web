import { Injectable, signal } from '@angular/core';
export interface ConfirmData { title:string; message:string; open:boolean; cb:(() => void)|null; }
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private _d = signal<ConfirmData>({ title:'', message:'', open:false, cb:null });
  readonly data = this._d.asReadonly();
  show(title: string, message: string, cb: () => void): void {
    this._d.set({ title, message, open:true, cb });
  }
  close(): void { this._d.update(d => ({ ...d, open:false, cb:null })); }
  confirm(): void { this._d().cb?.(); this.close(); }
}
