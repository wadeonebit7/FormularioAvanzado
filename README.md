# Libro de Visitas

Aplicación web de libro de visitas con validación de formulario en tiempo real y actualizaciones en vivo mediante WebSockets.

## Tecnologías

- **Frontend:** HTML, CSS, JavaScript (DOM)
- **Backend:** Node.js, Express.js
- **Base de datos:** MySQL
- **Tiempo real:** Socket.io

## Requisitos previos

- Node.js
- MySQL local

## Instalación


1. Clona el repositorio e instala las dependencias:

\```bash
git clone <url-del-repositorio>
cd libro-visitas
npm install
\```

2. Crea la base de datos en MySQL:

\```sql
CREATE DATABASE libro_visitas;
USE libro_visitas;

CREATE TABLE visitas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    comentario TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\```

3. Inicia el servidor:

\```bash
node server.js
\```

4. Abre el navegador en `http://localhost:3000`

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/guardar` | Guarda un nuevo comentario |
| `GET` | `/ultimo` | Obtiene el último comentario registrado |
| `POST` | `/check-availability` | Verifica si el nombre o correo ya existe |

## Funcionalidades

- Validación en tiempo real de nombre, correo y comentario
- Verificación de disponibilidad de nombre y correo contra la base de datos
- Botón de envío deshabilitado hasta que todos los campos sean válidos
- Comentarios nuevos se muestran en vivo a todos los usuarios conectados mediante Socket.io
- Carga del último comentario registrado con un clic