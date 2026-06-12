import { Component, inject } from '@angular/core';
import { ConfirmService } from './confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div id="confirm-overlay" [class.open]="data().open" (click)="onBg($event)">
      <div class="confirm-sheet">
        <div class="sheet-handle"></div>
        <h3>{{ data().title }}</h3>
        <p>{{ data().message }}</p>
        <div class="confirm-btns">
          <button class="btn btn-danger" style="flex:1" (click)="cs.confirm()">Confirmar</button>
          <button class="btn btn-outline" style="flex:1" (click)="cs.close()">Cancelar</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  cs   = inject(ConfirmService);
  data = this.cs.data;
  onBg(e: MouseEvent): void {
    if ((e.target as HTMLElement).id==='confirm-overlay') this.cs.close();
  }
}
