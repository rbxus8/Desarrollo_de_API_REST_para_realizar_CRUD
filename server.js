const express = require('express');
const cors = require('cors');
const { body, validationResult, param, query } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Base de datos simulada con datos completos
let database = {
  personajes: [
    {
      id: 1,
      nombre: "Naruto Uzumaki",
      apellido: "Uzumaki",
      edad: 17,
      aldea: "Konohagakure",
      clan: "Uzumaki",
      rango: "Genin",
      elemento: "Viento",
      jutsus: ["Rasengan", "Kage Bunshin no Jutsu", "Tajuu Kage Bunshin no Jutsu"],
      bestia: "Kurama (Nueve Colas)",
      estado: "Vivo",
      genero: "Masculino",
      equipo: "Equipo 7",
      sensei: "Kakashi Hatake",
      imagen: "https://example.com/naruto.jpg",
      descripcion: "Protagonista principal, ninja de Konoha con el sueño de ser Hokage",
      fechaNacimiento: "1987-10-10",
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      nombre: "Sasuke Uchiha",
      apellido: "Uchiha",
      edad: 17,
      aldea: "Konohagakure",
      clan: "Uchiha",
      rango: "Genin",
      elemento: "Fuego",
      jutsus: ["Chidori", "Katon: Gokakyu no Jutsu", "Amaterasu"],
      kekkeiGenkai: "Sharingan",
      estado: "Vivo",
      genero: "Masculino",
      equipo: "Equipo 7",
      sensei: "Kakashi Hatake",
      imagen: "https://example.com/sasuke.jpg",
      descripcion: "Último superviviente del clan Uchiha, busca venganza",
      fechaNacimiento: "1987-07-23",
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 3,
      nombre: "Sakura Haruno",
      apellido: "Haruno",
      edad: 17,
      aldea: "Konohagakure",
      clan: "Haruno",
      rango: "Genin",
      elemento: "Tierra",
      jutsus: ["Oukashou", "Byakugou no Jutsu", "Shosen Jutsu"],
      especialidad: "Ninjutsu Médico",
      estado: "Vivo",
      genero: "Femenino",
      equipo: "Equipo 7",
      sensei: "Kakashi Hatake",
      imagen: "https://example.com/sakura.jpg",
      descripcion: "Kunoichi con habilidades médicas excepcionales",
      fechaNacimiento: "1987-03-28",
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ],
  nextId: 4
};

// Middleware de validación de errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validadores
const personajeValidators = {
  create: [
    body('nombre')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage('El nombre solo puede contener letras y espacios'),
    
    body('apellido')
      .optional()
      .isLength({ max: 50 })
      .withMessage('El apellido no puede exceder 50 caracteres'),
    
    body('edad')
      .isInt({ min: 1, max: 200 })
      .withMessage('La edad debe ser un número entre 1 y 200'),
    
    body('aldea')
      .notEmpty()
      .withMessage('La aldea es requerida')
      .isIn(['Konohagakure', 'Sunagakure', 'Kirigakure', 'Kumogakure', 'Iwagakure'])
      .withMessage('Aldea no válida'),
    
    body('clan')
      .notEmpty()
      .withMessage('El clan es requerido'),
    
    body('rango')
      .isIn(['Genin', 'Chunin', 'Jonin', 'Kage', 'Missing-nin'])
      .withMessage('Rango no válido'),
    
    body('elemento')
      .optional()
      .isIn(['Fuego', 'Agua', 'Tierra', 'Viento', 'Rayo'])
      .withMessage('Elemento no válido'),
    
    body('genero')
      .isIn(['Masculino', 'Femenino'])
      .withMessage('Género debe ser Masculino o Femenino'),
    
    body('estado')
      .isIn(['Vivo', 'Fallecido', 'Desconocido'])
      .withMessage('Estado no válido'),
    
    body('jutsus')
      .optional()
      .isArray()
      .withMessage('Los jutsus deben ser un array'),
    
    body('imagen')
      .optional()
      .isURL()
      .withMessage('La imagen debe ser una URL válida')
  ],
  
  update: [
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    
    body('edad')
      .optional()
      .isInt({ min: 1, max: 200 })
      .withMessage('La edad debe ser un número entre 1 y 200'),
    
    body('aldea')
      .optional()
      .isIn(['Konohagakure', 'Sunagakure', 'Kirigakure', 'Kumogakure', 'Iwagakure'])
      .withMessage('Aldea no válida'),
    
    body('rango')
      .optional()
      .isIn(['Genin', 'Chunin', 'Jonin', 'Kage', 'Missing-nin'])
      .withMessage('Rango no válido'),
    
    body('genero')
      .optional()
      .isIn(['Masculino', 'Femenino'])
      .withMessage('Género debe ser Masculino o Femenino'),
    
    body('estado')
      .optional()
      .isIn(['Vivo', 'Fallecido', 'Desconocido'])
      .withMessage('Estado no válido')
  ]
};

// Utilidades
const findPersonajeById = (id) => {
  return database.personajes.find(p => p.id === parseInt(id));
};

const findPersonajeIndex = (id) => {
  return database.personajes.findIndex(p => p.id === parseInt(id));
};

// ====================================
// RUTAS DE LA API
// ====================================

// Ruta principal con documentación
app.get('/', (req, res) => {
  res.json({
    message: "🍃 API REST CRUD - Universo Naruto",
    version: "2.0.0",
    description: "API completa para gestionar personajes del universo Naruto",
    author: "Desarrollador Ninja",
    endpoints: {
      personajes: {
        "GET /api/personajes": "Obtener todos los personajes (con filtros y paginación)",
        "GET /api/personajes/:id": "Obtener un personaje específico",
        "POST /api/personajes": "Crear un nuevo personaje",
        "PUT /api/personajes/:id": "Actualizar un personaje completo",
        "PATCH /api/personajes/:id": "Actualizar parcialmente un personaje",
        "DELETE /api/personajes/:id": "Eliminar un personaje"
      },
      utilidades: {
        "GET /api/stats": "Estadísticas generales",
        "GET /api/search": "Búsqueda avanzada",
        "GET /api/health": "Estado de la API"
      }
    },
    filtros_disponibles: ["aldea", "clan", "rango", "elemento", "genero", "estado", "edad_min", "edad_max"],
    ejemplos: {
      filtrar_por_aldea: "/api/personajes?aldea=Konohagakure",
      buscar_por_nombre: "/api/personajes?search=naruto",
      paginacion: "/api/personajes?page=1&limit=10",
      ordenar: "/api/personajes?sort=nombre&order=asc"
    }
  });
});

// ====================================
// CREATE - Crear nuevo personaje
// ====================================
app.post('/api/personajes', 
  personajeValidators.create,
  handleValidationErrors,
  (req, res) => {
    try {
      // Verificar que el nombre no esté duplicado
      const existePersonaje = database.personajes.find(p => 
        p.nombre.toLowerCase() === req.body.nombre.toLowerCase() &&
        p.apellido?.toLowerCase() === req.body.apellido?.toLowerCase()
      );
      
      if (existePersonaje) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe un personaje con ese nombre',
          data: null
        });
      }
      
      // Crear nuevo personaje
      const nuevoPersonaje = {
        id: database.nextId++,
        nombre: req.body.nombre.trim(),
        apellido: req.body.apellido?.trim() || '',
        edad: parseInt(req.body.edad),
        aldea: req.body.aldea,
        clan: req.body.clan.trim(),
        rango: req.body.rango,
        elemento: req.body.elemento || null,
        jutsus: req.body.jutsus || [],
        kekkeiGenkai: req.body.kekkeiGenkai || null,
        bestia: req.body.bestia || null,
        estado: req.body.estado,
        genero: req.body.genero,
        equipo: req.body.equipo || null,
        sensei: req.body.sensei || null,
        imagen: req.body.imagen || null,
        descripcion: req.body.descripcion || '',
        fechaNacimiento: req.body.fechaNacimiento || null,
        especialidad: req.body.especialidad || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      database.personajes.push(nuevoPersonaje);
      
      res.status(201).json({
        success: true,
        message: 'Personaje creado exitosamente',
        data: nuevoPersonaje
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
);

// ====================================
// READ - Obtener todos los personajes
// ====================================
app.get('/api/personajes', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit debe estar entre 1 y 100'),
  query('edad_min').optional().isInt({ min: 0 }).withMessage('Edad mínima debe ser un número positivo'),
  query('edad_max').optional().isInt({ min: 0 }).withMessage('Edad máxima debe ser un número positivo')
], handleValidationErrors, (req, res) => {
  try {
    let personajes = [...database.personajes];
    
    // Aplicar filtros
    const { aldea, clan, rango, elemento, genero, estado, search, edad_min, edad_max } = req.query;
    
    if (aldea) {
      personajes = personajes.filter(p => 
        p.aldea.toLowerCase().includes(aldea.toLowerCase())
      );
    }
    
    if (clan) {
      personajes = personajes.filter(p => 
        p.clan.toLowerCase().includes(clan.toLowerCase())
      );
    }
    
    if (rango) {
      personajes = personajes.filter(p => 
        p.rango.toLowerCase() === rango.toLowerCase()
      );
    }
    
    if (elemento) {
      personajes = personajes.filter(p => 
        p.elemento && p.elemento.toLowerCase().includes(elemento.toLowerCase())
      );
    }
    
    if (genero) {
      personajes = personajes.filter(p => 
        p.genero.toLowerCase() === genero.toLowerCase()
      );
    }
    
    if (estado) {
      personajes = personajes.filter(p => 
        p.estado.toLowerCase() === estado.toLowerCase()
      );
    }
    
    if (edad_min) {
      personajes = personajes.filter(p => p.edad >= parseInt(edad_min));
    }
    
    if (edad_max) {
      personajes = personajes.filter(p => p.edad <= parseInt(edad_max));
    }
    
    // Búsqueda por texto
    if (search) {
      const searchTerm = search.toLowerCase();
      personajes = personajes.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm) ||
        p.apellido.toLowerCase().includes(searchTerm) ||
        p.clan.toLowerCase().includes(searchTerm) ||
        p.aldea.toLowerCase().includes(searchTerm) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm))
      );
    }
    
    // Ordenamiento
    const { sort = 'id', order = 'asc' } = req.query;
    personajes.sort((a, b) => {
      let aVal = a[sort];
      let bVal = b[sort];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (order === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
    
    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPersonajes = personajes.slice(startIndex, endIndex);
    
    // Metadatos de paginación
    const totalPersonajes = personajes.length;
    const totalPages = Math.ceil(totalPersonajes / limit);
    
    res.json({
      success: true,
      message: 'Personajes obtenidos exitosamente',
      data: paginatedPersonajes,
      meta: {
        total: totalPersonajes,
        page: page,
        limit: limit,
        totalPages: totalPages,
        hasNextPage: endIndex < totalPersonajes,
        hasPrevPage: page > 1
      },
      filters_applied: {
        aldea, clan, rango, elemento, genero, estado, search, edad_min, edad_max, sort, order
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ====================================
// READ - Obtener personaje por ID
// ====================================
app.get('/api/personajes/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID debe ser un número positivo')
], handleValidationErrors, (req, res) => {
  try {
    const personaje = findPersonajeById(req.params.id);
    
    if (!personaje) {
      return res.status(404).json({
        success: false,
        message: 'Personaje no encontrado',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: 'Personaje encontrado',
      data: personaje
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ====================================
// UPDATE - Actualizar personaje completo
// ====================================
app.put('/api/personajes/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID debe ser un número positivo'),
  ...personajeValidators.create
], handleValidationErrors, (req, res) => {
  try {
    const personajeIndex = findPersonajeIndex(req.params.id);
    
    if (personajeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Personaje no encontrado',
        data: null
      });
    }
    
    // Verificar duplicados (excluyendo el personaje actual)
    const existeOtro = database.personajes.find(p => 
      p.id !== parseInt(req.params.id) &&
      p.nombre.toLowerCase() === req.body.nombre.toLowerCase() &&
      p.apellido?.toLowerCase() === req.body.apellido?.toLowerCase()
    );
    
    if (existeOtro) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe otro personaje con ese nombre',
        data: null
      });
    }
    
    // Actualizar personaje completo
    const personajeActualizado = {
      ...database.personajes[personajeIndex],
      nombre: req.body.nombre.trim(),
      apellido: req.body.apellido?.trim() || '',
      edad: parseInt(req.body.edad),
      aldea: req.body.aldea,
      clan: req.body.clan.trim(),
      rango: req.body.rango,
      elemento: req.body.elemento || null,
      jutsus: req.body.jutsus || [],
      kekkeiGenkai: req.body.kekkeiGenkai || null,
      bestia: req.body.bestia || null,
      estado: req.body.estado,
      genero: req.body.genero,
      equipo: req.body.equipo || null,
      sensei: req.body.sensei || null,
      imagen: req.body.imagen || null,
      descripcion: req.body.descripcion || '',
      fechaNacimiento: req.body.fechaNacimiento || null,
      especialidad: req.body.especialidad || null,
      updatedAt: new Date()
    };
    
    database.personajes[personajeIndex] = personajeActualizado;
    
    res.json({
      success: true,
      message: 'Personaje actualizado exitosamente',
      data: personajeActualizado
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ====================================
// UPDATE - Actualizar personaje parcial
// ====================================
app.patch('/api/personajes/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID debe ser un número positivo'),
  ...personajeValidators.update
], handleValidationErrors, (req, res) => {
  try {
    const personajeIndex = findPersonajeIndex(req.params.id);
    
    if (personajeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Personaje no encontrado',
        data: null
      });
    }
    
    // Verificar duplicados si se está actualizando el nombre
    if (req.body.nombre || req.body.apellido) {
      const nombre = req.body.nombre || database.personajes[personajeIndex].nombre;
      const apellido = req.body.apellido || database.personajes[personajeIndex].apellido;
      
      const existeOtro = database.personajes.find(p => 
        p.id !== parseInt(req.params.id) &&
        p.nombre.toLowerCase() === nombre.toLowerCase() &&
        p.apellido?.toLowerCase() === apellido?.toLowerCase()
      );
      
      if (existeOtro) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe otro personaje con ese nombre',
          data: null
        });
      }
    }
    
    // Actualizar solo los campos proporcionados
    const camposPermitidos = [
      'nombre', 'apellido', 'edad', 'aldea', 'clan', 'rango', 'elemento',
      'jutsus', 'kekkeiGenkai', 'bestia', 'estado', 'genero', 'equipo',
      'sensei', 'imagen', 'descripcion', 'fechaNacimiento', 'especialidad'
    ];
    
    const actualizaciones = {};
    Object.keys(req.body).forEach(key => {
      if (camposPermitidos.includes(key)) {
        actualizaciones[key] = req.body[key];
      }
    });
    
    actualizaciones.updatedAt = new Date();
    
    const personajeActualizado = {
      ...database.personajes[personajeIndex],
      ...actualizaciones
    };
    
    database.personajes[personajeIndex] = personajeActualizado;
    
    res.json({
      success: true,
      message: 'Personaje actualizado parcialmente',
      data: personajeActualizado,
      updated_fields: Object.keys(actualizaciones)
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ====================================
// DELETE - Eliminar personaje
// ====================================
app.delete('/api/personajes/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID debe ser un número positivo')
], handleValidationErrors, (req, res) => {
  try {
    const personajeIndex = findPersonajeIndex(req.params.id);
    
    if (personajeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Personaje no encontrado',
        data: null
      });
    }
    
    const personajeEliminado = database.personajes[personajeIndex];
    database.personajes.splice(personajeIndex, 1);
    
    res.json({
      success: true,
      message: 'Personaje eliminado exitosamente',
      data: {
        id: personajeEliminado.id,
        nombre: personajeEliminado.nombre,
        eliminado_en: new Date()
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ====================================
// RUTAS ADICIONALES
// ====================================

// Estadísticas generales
app.get('/api/stats', (req, res) => {
  const stats = {
    total_personajes: database.personajes.length,
    por_aldea: {},
    por_rango: {},
    por_genero: {},
    por_estado: {},
    edad_promedio: 0
  };
  
  let sumaEdades = 0;
  
  database.personajes.forEach(p => {
    // Por aldea
    stats.por_aldea[p.aldea] = (stats.por_aldea[p.aldea] || 0) + 1;
    
    // Por rango
    stats.por_rango[p.rango] = (stats.por_rango[p.rango] || 0) + 1;
    
    // Por género
    stats.por_genero[p.genero] = (stats.por_genero[p.genero] || 0) + 1;
    
    // Por estado
    stats.por_estado[p.estado] = (stats.por_estado[p.estado] || 0) + 1;
    
    // Suma de edades
    sumaEdades += p.edad;
  });
  
  stats.edad_promedio = database.personajes.length > 0 ? 
    Math.round(sumaEdades / database.personajes.length) : 0;
  
  res.json({
    success: true,
    message: 'Estadísticas obtenidas',
    data: stats
  });
});

// Búsqueda avanzada
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'El término de búsqueda debe tener al menos 2 caracteres',
      data: null
    });
  }
  
  const searchTerm = q.toLowerCase().trim();
  const resultados = database.personajes.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm) ||
    p.apellido.toLowerCase().includes(searchTerm) ||
    p.clan.toLowerCase().includes(searchTerm) ||
    p.aldea.toLowerCase().includes(searchTerm) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm)) ||
    (p.jutsus && p.jutsus.some(jutsu => jutsu.toLowerCase().includes(searchTerm)))
  );
  
  res.json({
    success: true,
    message: `Encontrados ${resultados.length} resultados`,
    data: resultados,
    search_term: q
  });
});

// Estado de la API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    data: {
      status: 'OK',
      timestamp: new Date(),
      uptime: process.uptime(),
      version: '2.0.0',
      total_personajes: database.personajes.length
    }
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    data: null,
    available_endpoints: [
      'GET /',
      'GET /api/personajes',
      'GET /api/personajes/:id',
      'POST /api/personajes',
      'PUT /api/personajes/:id',
      'PATCH /api/personajes/:id',
      'DELETE /api/personajes/:id',
      'GET /api/stats',
      'GET /api/search',
      'GET /api/health'
    ]
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🍃 API REST CRUD Naruto ejecutándose en http://localhost:${PORT}`);
  console.log(`📚 Documentación disponible en http://localhost:${PORT}`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Total de personajes: ${database.personajes.length}`);
});

module.exports = app;