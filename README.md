# 🎀 Go Capi Go — Tienda Online K-Pop

Tienda online de merchandise K-Pop importado de Corea del Sur hacia México.  
Operamos actualmente por Instagram como [@go.capi.go](https://instagram.com/go.capi.go) y esta plataforma web es la evolución digital del negocio.

🌐 **Sitio en producción:** [gocapigo.pages.dev](https://gocapigo.pages.dev)  
📦 **Repositorio:** [github.com/JPBC2/gocapigo](https://github.com/JPBC2/gocapigo)

---

## 📌 Estado Actual del Desarrollo

| Fase | Estado |
|------|--------|
| Proyecto base (Astro + React) | ✅ Completado |
| Sistema de diseño (tema oscuro, colores de marca) | ✅ Completado |
| Datos de productos (24 productos desde Excel) | ✅ Completado |
| Página de inicio con hero, categorías y productos destacados | ✅ Completado |
| Catálogo con filtros laterales | ✅ Completado |
| Páginas de detalle de producto (24 rutas dinámicas) | ✅ Completado |
| Carrito de compras (React Context + localStorage) | ✅ Completado |
| Checkout con zonas de envío | ✅ Completado |
| Repositorio en GitHub | ✅ Completado |
| Deploy en Cloudflare Pages | ✅ Completado |
| Integración con Mercado Pago | 🔲 Pendiente |
| Base de datos y autenticación (Supabase) | 🔲 Pendiente |
| Imágenes reales de productos | 🔲 Pendiente |
| Panel de administración | 🔲 Pendiente |

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| [Astro](https://astro.build) | Framework principal — genera HTML estático para máximo rendimiento |
| [React](https://react.dev) | Componentes interactivos (carrito, checkout) como "islas" dentro de Astro |
| CSS Vanilla | Sistema de diseño con variables CSS, sin dependencias externas |
| [Cloudflare Pages](https://pages.cloudflare.com) | Hosting y CDN global (deploy automático) |
| [GitHub](https://github.com/JPBC2/gocapigo) | Control de versiones |

### Próximamente
| Tecnología | Uso planeado |
|------------|-------------|
| [Supabase](https://supabase.com) | Base de datos PostgreSQL, autenticación, almacenamiento de imágenes |
| [Mercado Pago](https://www.mercadopago.com.mx) | Pasarela de pagos para México |

---

## 📁 Estructura del Proyecto

```
gocapigo/
├── public/
│   └── images/              # Logos SVG de la marca
├── src/
│   ├── components/
│   │   ├── Navbar.astro     # Barra de navegación con carrito
│   │   ├── Footer.astro     # Pie de página
│   │   └── store/
│   │       ├── ProductCard.tsx      # Tarjeta de producto
│   │       ├── ProductGrid.tsx      # Grid con CartProvider compartido
│   │       ├── CartDrawer.tsx       # Panel lateral del carrito
│   │       ├── CartDrawer.css
│   │       ├── AddToCartButton.tsx  # Botón "agregar al carrito"
│   │       ├── CartWrapper.tsx      # Wrapper del contexto
│   │       └── CheckoutForm.tsx     # Formulario de checkout multi-paso
│   ├── context/
│   │   └── CartContext.tsx   # Estado global del carrito (React Context + localStorage)
│   ├── data/
│   │   └── products.ts      # 24 productos extraídos de COMPRAS.xlsx
│   ├── layouts/
│   │   └── BaseLayout.astro  # Layout con SEO y estilos globales
│   ├── pages/
│   │   ├── index.astro       # Página de inicio
│   │   ├── checkout.astro    # Página de checkout
│   │   └── productos/
│   │       ├── index.astro   # Catálogo completo
│   │       └── [slug].astro  # Detalle de producto (rutas dinámicas)
│   └── styles/
│       ├── global.css        # Sistema de diseño (tokens, utilidades, componentes)
│       ├── product-card.css  # Estilos de tarjeta de producto
│       └── checkout.css      # Estilos de checkout
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🚀 Cómo levantar el proyecto

### Requisitos
- **Node.js** 18 o superior
- **npm** (incluido con Node.js)

### Instalación y desarrollo

```bash
# 1. Clonar el repositorio
git clone https://github.com/JPBC2/gocapigo.git
cd gocapigo

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
# → http://localhost:4321/
```

### Deploy a producción

```bash
# Generar build estático
npm run build

# Subir a Cloudflare Pages
npx wrangler pages deploy dist --project-name gocapigo
```

---

## 🛒 Productos Disponibles (24)

Los datos provienen del archivo `COMPRAS.xlsx` (hoja "STOCK 15-5-24") y están almacenados localmente en `src/data/products.ts`.

| Categoría | Cantidad | Rango de precios |
|-----------|----------|-----------------|
| Accesorios (llaveros, termos, binders, card holders) | 10 | $60 – $350 MXN |
| Papelería (plumas TinyTAN x Toy Story) | 7 | $300 MXN |
| Sleeves (holográficas, popcorn) | 4 | $60 – $80 MXN |
| Lightsticks (Army Bomb) | 1 | $1,200 MXN |
| Merchandise (SET Hobi-OTS) | 1 | $1,000 MXN |

---

## 🎨 Diseño

- **Tema oscuro** con fondo `#0d0b12`
- **Colores de marca:** morado `#9844ad`, carmesí `#8c1d40`, rosa `#f5dadf`, dorado `#e6c79c`
- **Tipografía:** Outfit (títulos) + Inter (cuerpo) vía Google Fonts
- **Efectos:** glassmorfismo en navbar, gradientes animados, hover effects, micro-animaciones
- **Responsive:** diseño adaptable a móvil, tablet y escritorio

---

## 📝 Comandos Útiles

| Comando | Acción |
|---------|--------|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Build de producción en `./dist/` |
| `npm run preview` | Vista previa del build local |
| `npx wrangler pages deploy dist` | Deploy a Cloudflare Pages |

---

## 🤝 Contribuir

1. Crear una rama desde `main`: `git checkout -b feature/nombre-del-feature`
2. Hacer los cambios y commitear: `git commit -m "feat: descripción"`
3. Push y crear Pull Request en GitHub

---

> Hecho con 💜 por el equipo Go Capi Go
