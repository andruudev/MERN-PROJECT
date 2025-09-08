# 1. TITULO:  Colección de Personajes de Anime
# Nombre: Jeyson Mueses (Modulo IV - DevOps)

# 2. Descripcion
Aplicación web completa para gestionar tus personajes de anime favoritos. Crea, lee, actualiza y elimina personajes con una interfaz fácil de usar.

## Características Principales

- Ver todos los personajes en una cuadrícula
- Buscar personajes por nombre o anime
- Filtrar por rol (Protagonista, Antagonista, etc.)
- Ver detalles completos de cada personaje
- Añadir nuevos personajes
- Editar y eliminar personajes existentes
- Diseño que se adapta a móviles y tablets

# 3. Tecnologías Usadas

### Frontend
- React
- Material-UI (para el diseño)
- React Router (para la navegación)

### Backend
- Node.js con Express
- MongoDB (base de datos)
- Mongoose (para interactuar con MongoDB)

# 4.  Cómo Empezar

### Requisitos Previos
- Node.js (versión 14 o superior)
- npm o yarn
- MongoDB (local o Atlas)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/andruudev/MERN-PROJECT
   cd coleccion-anime
   ```

2. **Instalar dependencias del servidor**
   ```bash
   cd server
   npm install
   ```

3. **Instalar dependencias del cliente**
   ```bash
   cd ../client
   npm install
   ```

4. **Configuración**
   - Crear un archivo `.env` en la carpeta `server` con:
     ```
     PORT=5000
     MONGODB_URI= LA URI
     ```

## Ejecutar la Aplicación

1. **Iniciar el servidor**
   ```bash
   cd server
   npm run dev
   ```
   El servidor estará en: http://localhost:5000

2. **Iniciar el cliente** (en otra terminal)
   ```bash
   cd client
   npm start
   ```
   La aplicación se abrirá en: http://localhost:3000

## Uso

1. **Ver todos los personajes**: La página principal muestra todos los personajes.
2. **Añadir personaje**: Haz clic en "Añadir Personaje" y completa el formulario.
3. **Ver detalles**: Haz clic en cualquier tarjeta de personaje.
4. **Editar/Eliminar**: Usa los botones en la página de detalles del personaje.
5. **Buscar**: Usa la barra de búsqueda para encontrar personajes.

# 5. Despliegue

### Backend
1. Crea una base de datos en MongoDB Atlas
2. Configura las variables de entorno en tu servicio de hosting
3. Despliega el código del servidor

### Frontend
1. Genera la versión de producción:
   ```bash
   cd client
   npm run build
   ```
2. Sirve la carpeta `build` con tu servicio de hosting favorito

# 6.  Desafios

### Mi primer error fue que no copie bien la URI de Mongo y no sabia como resolverlo, porque no compilaba y se caia todo, despues revise letra por letra la URI y vi que estaba mal y lo corregi
### Mi segundo error fue que no se instalaban las dependencias de node, y no podia compilar la app, tuve que borrar node, borrar el cache y volver a levantarlo

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

¿Tienes preguntas o sugerencias? ¡Déjame un mensaje!
# MERN-PROJECT
