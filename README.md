# 🍕 Pizzería Maestra — Frontend Angular (FINAL)

## Instrucciones de instalación

### 1. Copia todos los archivos a tu proyecto
Reemplaza completamente la carpeta `src/` y los archivos de configuración raíz.

### 2. Instala dependencias
```bash
npm install
```

### 3. Arranca
```bash
ng serve
```
Abre http://localhost:4200

---

## Formas de pago incluidas

### 💙 PayPal (Sandbox)
Para activarlo:
1. Ve a https://developer.paypal.com
2. Crea una cuenta de desarrollador gratuita
3. Crea una app → copia el **Client ID de Sandbox**
4. Pégalo en `src/environments/environment.ts`:
   ```typescript
   paypalClientId: 'TU_CLIENT_ID_AQUI'
   ```
5. En `cart.component.ts` reemplaza la URL del script PayPal:
   ```typescript
   script.src = 'https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID&currency=MXN&locale=es_MX';
   ```

### 🚗 Uber Eats / 🛵 Rappi
Redirigen al sitio oficial. Para apuntar a tu negocio específico:
- Uber Eats: busca tu restaurante en ubereats.com → copia la URL
- Rappi: busca tu restaurante en rappi.com.mx → copia la URL
- Actualiza en `cart.component.ts` los métodos `openUberEats()` y `openRappi()`

---

## Credenciales de prueba
- **Admin:** admin@pizzeriamaestra.com / Admin2024!
- **Cliente:** juan@mail.com / 123456

## Usuarios demo (botones en login)
- 👤 Cliente demo → acceso rápido sin escribir
- ⚙️ Admin demo → acceso al panel de administración

---

## Estructura de carpetas
```
src/
├── app/
│   ├── core/
│   │   ├── models/        → product, user, order
│   │   ├── services/      → auth, cart, product, order, notification
│   │   └── guards/        → auth, admin
│   ├── layout/
│   │   ├── header/        → visible en móvil
│   │   ├── sidebar/       → visible en desktop
│   │   └── tab-bar/       → visible en móvil
│   ├── features/
│   │   ├── home/
│   │   ├── menu/
│   │   ├── cart/          → PayPal + Uber Eats + Rappi
│   │   ├── tracking/
│   │   ├── profile/
│   │   ├── login/
│   │   ├── success/
│   │   └── admin/
│   └── shared/
│       └── components/    → notification, confirm-dialog
└── assets/
    └── images/            → pon aquí tus imágenes
```
