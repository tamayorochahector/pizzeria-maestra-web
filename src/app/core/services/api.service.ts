import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'https://pizzeria-api-nznf.onrender.com';

  constructor(private http: HttpClient) {}

  // Users
  getUsers(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/users`); }
  login(email: string, pass: string): Observable<any> { return this.http.post(`${this.base}/users/login`, { email, pass }); }
  register(name: string, email: string, phone: string, pass: string): Observable<any> { return this.http.post(`${this.base}/users/register`, { name, email, phone, pass }); }
  createAdmin(name: string, email: string, phone: string, pass: string): Observable<any> { return this.http.post(`${this.base}/users/admin`, { name, email, phone, pass }); }
  incrementOrders(id: string): Observable<any> { return this.http.patch(`${this.base}/users/${id}/orders`, {}); }

  // Products
  getProducts(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/products`); }
  getFeatured(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/products/featured`); }
  getByCategory(cat: string): Observable<any[]> { return this.http.get<any[]>(`${this.base}/products/cat/${cat}`); }
  getProductById(id: number): Observable<any> { return this.http.get(`${this.base}/products/${id}`); }
  addProduct(p: any): Observable<any> { return this.http.post(`${this.base}/products`, p); }
  updateProduct(id: number, p: any): Observable<any> { return this.http.put(`${this.base}/products/${id}`, p); }
  deleteProduct(id: number): Observable<any> { return this.http.delete(`${this.base}/products/${id}`); }

  // Orders
  getOrders(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/orders`); }
  getOrdersByUser(userId: string): Observable<any[]> { return this.http.get<any[]>(`${this.base}/orders/user/${userId}`); }
  getOrderById(id: number): Observable<any> { return this.http.get(`${this.base}/orders/${id}`); }
  createOrder(order: any): Observable<any> { return this.http.post(`${this.base}/orders`, order); }
  updateOrderStatus(id: number, status: string): Observable<any> { return this.http.patch(`${this.base}/orders/${id}/status`, { status }); }
}