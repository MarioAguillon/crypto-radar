# 🚀 CryptoRadar

> Dashboard premium de criptomonedas en tiempo real

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CoinGecko](https://img.shields.io/badge/CoinGecko-8DC63F?style=for-the-badge&logo=coingecko&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

CryptoRadar es una Single Page Application construida con las últimas características de **Angular 22+ (Standalone Components y Signals)**, que consume la API de CoinGecko para mostrar información del mercado de criptomonedas con un enfoque en la experiencia de usuario y diseño premium.

## ✨ Características principales

- 📈 **Métricas globales en vivo**: Capitalización de mercado y volumen global.
- 🔍 **Buscador predictivo**: Búsqueda instantánea con debouncing y chips de tendencias.
- 📊 **Gráficos interactivos**: Visualización de precios con `Chart.js` y selección de períodos (7D, 30D, 90D, 1Y).
- 💱 **Conversor en tiempo real**: Convierte el valor de cualquier criptomoneda a USD, EUR o COP instantáneamente.
- ⭐ **Sistema de favoritos (Mi Radar)**: Guarda monedas con persistencia local (`localStorage`) y reordenamiento inteligente.
- 🚀 **Rendimiento superior**: Lazy loading de rutas, interceptores optimizados y sistema de caché nativo.
- 📱 **Diseño responsive oscuro**: Adaptable a móviles, tablets y monitores grandes.
- 🌐 **PWA instalable**: Funcionamiento offline básico y opción de instalar como aplicación nativa.
- 🔔 **Sistema global de Toasts**: Feedback visual inmediato tras cada interacción.

## 🛠️ Tecnologías utilizadas  

- **Angular 22+** (Standalone Components, Signals, new Control Flow `@if/@for`)
- **TypeScript** (Tipado estricto)
- **SCSS + CSS Custom Properties** (Design system propio sin librerías de UI)
- **Chart.js + ng2-charts** (Gráficos financieros)
- **CoinGecko API** (Proveedor de datos)
- **RxJS** (Manejo de asincronía en interceptores)
- **Service Workers** (PWA support)

## 🚀 Instalación y uso local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/MarioAguillon/crypto-radar.git
   cd crypto-radar
   ```

2. **Instalar dependencias**:
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Nota: Se usa `--legacy-peer-deps` por la compatibilidad estricta de `ng2-charts` con Angular 22)*

3. **Ejecutar el servidor local**:
   ```bash
   npm start
   ```

4. **Navegar**: Abre `http://localhost:4200` en tu navegador.

## 🔑 Variables de entorno

Para que el proyecto funcione, necesitas una **API Key gratuita** de CoinGecko.
Edita el archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api.coingecko.com/api/v3',
  apiKey: 'TU_API_KEY_AQUI' // Reemplaza con tu llave de CoinGecko Demo
};
```

## 📡 API utilizada

El proyecto consume la [CoinGecko API (Demo Plan)](https://www.coingecko.com/en/api).
Endpoints principales:
- `/global`: Métricas del mercado total.
- `/coins/markets`: Listado de monedas con precios y variaciones.
- `/search`: Buscador de monedas.
- `/coins/{id}`: Detalles completos de una criptomoneda específica.
- `/coins/{id}/market_chart`: Datos históricos para pintar las gráficas.

## 🏗️ Arquitectura del proyecto

```text
src/
 ├── app/
 │    ├── core/              # Servicios singleton, interceptores y modelos
 │    │    ├── handlers/     # GlobalErrorHandler
 │    │    ├── interceptors/ # api-key.interceptor.ts
 │    │    ├── models/       # Interfaces TypeScript (Coin, CoinDetail, etc)
 │    │    └── services/     # CryptoService, FavoritesService, LoadingBarService
 │    ├── pages/             # Vistas principales (Lazy Loaded)
 │    │    ├── home/
 │    │    ├── search/
 │    │    ├── details/
 │    │    ├── favorites/
 │    │    └── not-found/
 │    ├── shared/            # Componentes reutilizables
 │    │    ├── components/   # Header, Footer, Cards, Toast, Spinner, Chart
 │    │    ├── directives/   # PriceColorDirective
 │    │    └── pipes/        # FormatCurrency, Percentage, Highlight
 │    ├── app.routes.ts      # Configuración del Router
 │    └── app.ts             # Componente raíz
 ├── assets/                 # Imágenes, iconos PWA
 ├── environments/           # Configuración de API Keys
 └── styles.scss             # Design System (Variables y Globales)
```

## 📊 Funcionalidades por página

- **/home**: Carga 20 monedas reales con skeletons. Tiene pestañas para Top/Gainers/Losers.
- **/search**: Buscador con debounce y sugerencias de monedas en tendencia.
- **/details/:id**: Ficha técnica de la moneda con descripción, métricas financieras y gráfica interactiva de precios históricos.
- **/favorites**: Listado personalizado que calcula promedios de rendimiento y permite reordenar el portafolio guardado.

## 🎯 Aprendizajes del proyecto

La construcción de CryptoRadar fue una inmersión profunda en las nuevas arquitecturas de Angular. El paso de RxJS estricto al nuevo sistema de **Signals** redujo la complejidad del código drásticamente. Además, implementar el sistema de *Favorites* como un **Singleton Global** enseñó la importancia de la centralización del estado, permitiendo que cualquier componente (como el Header o las Cards) reaccione en tiempo real sin emitir eventos complejos hacia arriba.

El pulido de UI con CSS puro y CSS Variables comprobó que no se necesitan librerías gigantescas para lograr una apariencia premium.

## 👤 Autor

**Mario Aguillon**
- [GitHub](https://github.com/MarioAguillon)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
