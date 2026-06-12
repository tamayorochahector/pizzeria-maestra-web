export interface User {
  id: string;
  name: string;
  email: string;
  pass: string;
  phone: string;
  role: 'admin' | 'cliente';
  orders: number;
}

export const DEFAULT_USERS: User[] = [
  { id:'u1', name:'Pizzería Admin', email:'PizzeriaAdmin@gmail.com', pass:'PizzMaes332211@', role:'admin', phone:'', orders:0 },
];
