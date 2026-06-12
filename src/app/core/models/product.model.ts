export interface ProductSize { label: string; price: number; }

export interface Product {
  id: number;
  name: string;
  desc: string;
  cat: string;
  emoji: string;
  image: string;
  sizes: ProductSize[];
  featured: boolean;
}

export const CATS = [
  { id: 'pizzas',      label: 'Pizzas',    emoji: '🍕', image: 'assets/images/ui/cat-pizzas.png'      },
  { id: 'bebidas',     label: 'Bebidas',   emoji: '🥤', image: 'assets/images/ui/cat-bebidas.png'     },
  { id: 'ensaladas',   label: 'Ensaladas', emoji: '🥗', image: 'assets/images/ui/cat-ensaladas.png'   },
  { id: 'postres',     label: 'Postres',   emoji: '🍰', image: 'assets/images/ui/cat-postres.png'     },
  { id: 'promociones', label: 'Promos',    emoji: '🎉', image: 'assets/images/ui/cat-promociones.png' },
];

export const DEFAULT_PRODUCTS: Product[] = [
  { id:1,  name:'Pepperoni Clásica',    desc:'Salsa de tomate artesanal, queso mozzarella derretido, pepperoni premium',    cat:'pizzas',      emoji:'🍕', image:'assets/images/pizzas/pepperoni-clasica.jpg',  sizes:[{label:'Mediana',price:180},{label:'Grande',price:220},{label:'XL',price:260}], featured:true  },
  { id:2,  name:'Cuatro Quesos',        desc:'Mozzarella, gouda, cheddar y parmesano con base de aceite de oliva',          cat:'pizzas',      emoji:'🧀', image:'assets/images/pizzas/cuatro-quesos.jpg',      sizes:[{label:'Mediana',price:190},{label:'Grande',price:230},{label:'XL',price:270}], featured:true  },
  { id:3,  name:'Hawaiana',             desc:'Jamón ahumado, piña natural y salsa de tomate',                               cat:'pizzas',      emoji:'🍍', image:'assets/images/pizzas/hawaiana.jpg',           sizes:[{label:'Mediana',price:175},{label:'Grande',price:215},{label:'XL',price:255}], featured:false },
  { id:4,  name:'Vegetariana',          desc:'Pimientos, champiñones, aceitunas negras y cebolla morada',                  cat:'pizzas',      emoji:'🥦', image:'assets/images/pizzas/vegetariana.jpg',        sizes:[{label:'Mediana',price:170},{label:'Grande',price:210},{label:'XL',price:250}], featured:false },
  { id:5,  name:'BBQ Pollo',            desc:'Salsa BBQ ahumada, pollo a la parrilla, cebolla morada caramelizada',         cat:'pizzas',      emoji:'🍗', image:'assets/images/pizzas/bbq-pollo.jpg',          sizes:[{label:'Mediana',price:200},{label:'Grande',price:240},{label:'XL',price:280}], featured:true  },
  { id:6,  name:'Mexicana Picante',     desc:'Jalapeño fresco, chorizo artesanal, frijoles refritos y salsa picante',       cat:'pizzas',      emoji:'🌶️',image:'assets/images/pizzas/mexicana-picante.jpg',   sizes:[{label:'Mediana',price:195},{label:'Grande',price:235},{label:'XL',price:275}], featured:false },
  { id:7,  name:'Margarita',            desc:'Salsa San Marzano, mozzarella fresca y albahaca',                            cat:'pizzas',      emoji:'🌿', image:'assets/images/pizzas/margarita.jpg',          sizes:[{label:'Mediana',price:165},{label:'Grande',price:205},{label:'XL',price:245}], featured:false },
  { id:8,  name:'Coca-Cola 600ml',      desc:'Refresco Coca-Cola original bien frío',                                      cat:'bebidas',     emoji:'🥤', image:'assets/images/bebidas/cocacola.jpg',          sizes:[{label:'600ml',price:45}],                                                      featured:false },
  { id:9,  name:'Agua Mineral',         desc:'Agua mineral Topo Chico fría con gas',                                       cat:'bebidas',     emoji:'💧', image:'assets/images/bebidas/agua-mineral.jpg',      sizes:[{label:'500ml',price:30}],                                                      featured:false },
  { id:10, name:'Limonada Natural',     desc:'Limones frescos, azúcar natural y agua mineral',                             cat:'bebidas',     emoji:'🍋', image:'assets/images/bebidas/limonada.jpg',          sizes:[{label:'Grande',price:55}],                                                     featured:false },
  { id:11, name:'Horchata',             desc:'Horchata artesanal con canela y vainilla',                                   cat:'bebidas',     emoji:'🥛', image:'assets/images/bebidas/horchata.jpg',          sizes:[{label:'Grande',price:50}],                                                     featured:false },
  { id:12, name:'Ensalada César',       desc:'Lechuga romana, crutones artesanales, parmesano y aderezo César',            cat:'ensaladas',   emoji:'🥗', image:'assets/images/ensaladas/cesar.jpg',           sizes:[{label:'Individual',price:95},{label:'Familiar',price:150}],                   featured:false },
  { id:13, name:'Brownie de Chocolate', desc:'Brownie artesanal de chocolate oscuro con helado de vainilla',               cat:'postres',     emoji:'🍫', image:'assets/images/postres/brownie.jpg',           sizes:[{label:'Pieza',price:70}],                                                      featured:false },
  { id:14, name:'Helado Artesanal',     desc:'Helado artesanal: vainilla, fresa o chocolate',                             cat:'postres',     emoji:'🍦', image:'assets/images/postres/helado.jpg',            sizes:[{label:'1 bola',price:45},{label:'2 bolas',price:75}],                         featured:false },
  { id:15, name:'2×1 Medianas',         desc:'Dos pizzas medianas al precio de una. Solo martes hasta las 8pm',           cat:'promociones', emoji:'🎉', image:'assets/images/promociones/2x1-medianas.jpg',  sizes:[{label:'Promo',price:199}],                                                    featured:false },
];
