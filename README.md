# 🚀 Marke List - Gestión de Productos

Este es un proyecto moderno de gestión de productos desarrollado con el *stack* T3 (Next.js, TypeScript y Tailwind CSS), con autenticación de usuarios a través de Google. El proyecto está desplegado en Vercel.

**Estado del Proyecto:** 🛠️ **En Construcción**

-----

## 💻 Stack Tecnológico

La aplicación está construida con las siguientes herramientas y tecnologías:

| Área | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Framework** | **Next.js** (App Router) | Framework de React para renderizado eficiente del lado del servidor (SSR) y estático (SSG). |
| **Lenguaje** | **TypeScript** | JavaScript tipado para mejor escalabilidad y menos errores en tiempo de ejecución. |
| **Estilos** | **Tailwind CSS** | Framework de CSS *utility-first* para un desarrollo de diseño rápido y responsivo. |
| **Despliegue** | **Vercel** | Plataforma de alojamiento optimizada para Next.js. |

-----

## ✨ Funcionalidades Clave (Actualmente Implementadas)

### 📊 Gestión de Productos

  * **Creación y Edición:** Interfaz dedicada para agregar nuevos productos y modificar existentes.
  * **Listado Filtrable:** Vista de todos los productos almacenados con opciones de búsqueda y filtrado (ej. por marca, categoría, etc.).

### 🔐 Autenticación y Seguridad

  * **Google Sign-In:** Autenticación de usuarios utilizando Firebase Authentication (OAuth con Google).
  <!-- * **Acceso Controlado:** Solo los usuarios autenticados pueden acceder y gestionar los productos. -->

-----

## 🛠️ Instalación y Configuración Local

Sigue estos pasos para montar y ejecutar el proyecto en tu entorno local.

### Requisitos Previos

  * [Node.js](https://nodejs.org/en/) (versión 18 o superior)
  * [npm](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/)
  * Una cuenta de **Firebase** con un proyecto configurado.

### 1\. Clonar el Repositorio e Instalar Dependencias

```bash
git clone https://github.com/kelvinocampo/clone-marke-list
cd clone-marke-list
npm install
# o yarn install
```

### 2\. Configurar Variables de Entorno

Crea un archivo llamado **`.env.local`** en la raíz del proyecto y agrega tus claves de configuración de Firebase:

```bash
# Archivo: .env.local

# Configuración de Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="TU_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="TU_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="TU_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="TU_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="TU_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="TU_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=TU_MEASUREMENT_ID
```

> ⚠️ **Nota:** Estas claves son públicas (comienzan con `NEXT_PUBLIC_`) y son necesarias para que el código de cliente (Next.js) se conecte a Firebase.

### 3\. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

El proyecto se iniciará en [http://localhost:3000](http://localhost:3000).

-----

## 🔗 Despliegue y Acceso Público

El proyecto está desplegado continuamente usando Vercel.

  * **Dominio Público:** [Despliegue](https://clone-marke-list.vercel.app/)
  * **Plataforma de Despliegue:** Vercel

-----

## 📝 Roadmap (Próximas Mejoras)

El proyecto está en constante desarrollo. Las siguientes características están planificadas:

  * **Mejora de UX:** Refinar la interfaz de usuario con animaciones y transiciones más pulidas.

-----

## 🤝 Contribuciones

Este proyecto es de código abierto. ¡Las contribuciones son bienvenidas\! Si deseas agregar una funcionalidad o corregir un error, por favor:

1.  Haz un *fork* del repositorio.
2.  Crea una nueva rama (`git checkout -b feature/AmazingFeature`).
3.  Comité tus cambios (`git commit -m 'feat: Agrega AmazingFeature'`).
4.  Sube tu rama (`git push origin feature/AmazingFeature`).
5.  Abre un *Pull Request* (PR).

-----

Creado por Kelvinocampo (Kevin Esneider Ocampo Osorio).