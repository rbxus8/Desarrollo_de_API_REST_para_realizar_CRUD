🍃 API REST CRUD - Universo Naruto

Bienvenido al repositorio de una API completa para gestionar personajes del universo de Naruto, construida con Node.js, Express, y validaciones usando express-validator. Esta API simula una base de datos en memoria y ofrece un conjunto de endpoints RESTful con funcionalidades de CRUD, filtrado, búsqueda avanzada y estadísticas.

🚀 Características principales

•	🔁 Operaciones CRUD completas (crear, leer, actualizar, eliminar).

•	🔎 Filtros, paginación y orden dinámico.

•	📊 Estadísticas en tiempo real.

•	🧠 Búsqueda inteligente por nombre, clan, jutsus, etc.

•	✅ Validación de datos robusta con express-validator.

•	📦 Base de datos simulada en memoria.

•	🔐 Manejo de errores global y respuestas detalladas.

🛠 Tecnologías utilizadas

•	Node.js

•	Express

•	express-validator

•	JavaScript (ES6)

•	Middleware personalizado para logging

📂 Estructura del proyecto

/src
├── index.js               # Archivo principal del servidor
├── README.md              # Este 

📌 Endpoints 

🔹 Personajes

Método	Endpoint	Descripción

GET	/api/personajes	Obtener todos los personajes (con filtros, paginación, orden)

GET	/api/personajes/:id	Obtener un personaje por ID

POST	/api/personajes	Crear un nuevo personaje

PUT	/api/personajes/:id	Actualizar completamente un personaje

PATCH	/api/personajes/:id	Actualizar parcialmente un personaje

DELETE	/api/personajes/:id	Eliminar un personaje

GET	/api/stats	Estadísticas generales

GET	/api/search?q=texto	Buscar personajes por múltiples campos

GET	/api/health	Estado de salud de la API

