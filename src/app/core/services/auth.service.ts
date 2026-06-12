import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _users   = signal<User[]>([]);
  private _session = signal<User | null>(this.loadSession());

  readonly session    = this._session.asReadonly();
  readonly isLoggedIn = computed(() => this._session() !== null);
  readonly isAdmin    = computed(() => this._session()?.role === 'admin');
  readonly users      = this._users.asReadonly();

  constructor(private api: ApiService) {
    this.api.getUsers().subscribe(u => this._users.set(u));
  }

  private loadSession(): User | null {
    try { const v = localStorage.getItem('pz_session'); return v ? JSON.parse(v) : null; }
    catch { return null; }
  }

  login(email: string, pass: string): Promise<string | null> {
    return new Promise(resolve => {
      this.api.login(email, pass).subscribe({
        next: (user) => { this.setSession(user); resolve(null); },
        error: () => resolve('Correo o contraseña incorrectos')
      });
    });
  }

  register(name: string, email: string, phone: string, pass: string): Promise<string | null> {
    return new Promise(resolve => {
      this.api.register(name, email, phone, pass).subscribe({
        next: (user) => { this.setSession(user); resolve(null); },
        error: (e) => resolve(e.error?.error || 'Error al registrar')
      });
    });
  }

  createAdmin(name: string, email: string, phone: string, pass: string): Promise<string | null> {
    return new Promise(resolve => {
      this.api.createAdmin(name, email, phone, pass).subscribe({
        next: () => resolve(null),
        error: (e) => resolve(e.error?.error || 'Error al crear admin')
      });
    });
  }

  logout(): void {
    this._session.set(null);
    localStorage.removeItem('pz_session');
  }

  setSession(u: User): void {
    this._session.set(u);
    localStorage.setItem('pz_session', JSON.stringify(u));
  }

  incrementOrders(userId: string): void {
    this.api.incrementOrders(userId).subscribe(updated => {
      this._users.update(users => users.map(u => u.id === userId ? updated : u));
      if (this._session()?.id === userId) this.setSession(updated);
    });
  }
}