import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  tab      = signal<'login' | 'register'>('login');
  error    = signal('');
  email    = signal(''); pass     = signal('');
  name     = signal(''); regEmail = signal('');
  phone    = signal(''); regPass  = signal('');

  constructor(private auth: AuthService, private router: Router, private notify: NotificationService) {}

  switchTab(t: 'login' | 'register'): void { this.tab.set(t); this.error.set(''); }

async doLogin(): Promise<void> {
  const err = await this.auth.login(this.email(), this.pass());
  if (err) { this.error.set(err); return; }
  this.notify.show('¡Bienvenido! 👋', 'success');
  this.router.navigate(['/home']);
}

async doRegister(): Promise<void> {
  const err = await this.auth.register(this.name(), this.regEmail(), this.phone(), this.regPass());
  if (err) { this.error.set(err); return; }
  this.notify.show('¡Cuenta creada! 🎉', 'success');
  this.router.navigate(['/home']);
}
}
