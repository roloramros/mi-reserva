const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " +
    "img-src 'self' data:; " +
    "connect-src 'self' http://localhost:3001 http://69.169.102.33:3001 http://mi-reserva.pro https://mi-reserva.pro https://cdn.tailwindcss.com; " + 
    "font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; " +
    "object-src 'none'"
  );
  next();
});




// Cuando alguien abra http://localhost:3001 → mostrar login.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// Agregar esto después de app.use(express.static("public"));
app.use(express.static("public", {
  extensions: ['html'],
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));



// 🔹 Configuración de PostgreSQL local
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Variable para el secreto de JWT
const JWT_SECRET = process.env.JWT_SECRET;


// Ruta de registro actualizada para PostgreSQL
app.post("/register", async (req, res) => {
  const { email, password, username, name, role } = req.body;

  try {
    // 1. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Insertar en la base de datos
    const query = `
      INSERT INTO users (email, password, username, name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, username;
    `;
    const values = [email, hashedPassword, username, name, role.toLowerCase()];

    const result = await pool.query(query, values);

    res.status(200).json({ 
      message: "Usuario registrado correctamente", 
      user: result.rows[0] 
    });
  } catch (err) {
    // Manejar errores de duplicados (email o username)
    if (err.code === '23505') {
      return res.status(400).json({ error: "El email o el nombre de usuario ya existen" });
    }
    res.status(500).json({ error: err.message });
  }
});

// Ruta de login actualizada para PostgreSQL
app.post("/login", async (req, res) => {
  const { loginField, password } = req.body;

  try {
    // 1. Buscar usuario por email o username
    const query = `
      SELECT * FROM users 
      WHERE email = $1 OR username = $1
    `;
    const result = await pool.query(query, [loginField]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // 2. Comparar contraseña encriptada
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // 3. Generar Token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login exitoso",
      role: user.role,
      token: token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/logout", (req, res) => {
  res.status(200).json({ message: "Sesión cerrada correctamente" });
});

// Middleware para verificar autenticación (JWT Local)
async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(' ')[1];

    // Verificar el token con JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// Obtener reservaciones del owner - PostgreSQL nativo
app.get("/owner/reservations", verifyAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;

    const query = `
      SELECT 
        r.id as reservation_id,
        f.name as field_name,
        u.username,
        r.start_time,
        r.end_time,
        r.status
      FROM reservations r
      JOIN fields f ON r.field_id = f.id
      JOIN users u ON r.user_id = u.id
      WHERE f.owner_id = $1;
    `;
    
    const result = await pool.query(query, [ownerId]);
    res.status(200).json({ reservations: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancelar reservación - PostgreSQL nativo
app.post("/owner/cancel-reservation", verifyAuth, async (req, res) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ error: "ID de reservación requerido" });
    }

    // Verificar permiso y existencia
    const checkQuery = `
      SELECT r.id, f.owner_id 
      FROM reservations r 
      JOIN fields f ON r.field_id = f.id 
      WHERE r.id = $1
    `;
    const checkResult = await pool.query(checkQuery, [reservationId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Reservación no encontrada" });
    }

    if (checkResult.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: "No tienes permiso para cancelar esta reservación" });
    }

    // Actualizar estado
    await pool.query("UPDATE reservations SET status = 'cancelada' WHERE id = $1", [reservationId]);

    res.status(200).json({ success: true, message: 'Reservación cancelada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Confirmar reservación - PostgreSQL nativo
app.post("/owner/confirm-reservation", verifyAuth, async (req, res) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ error: "ID de reservación requerido" });
    }

    // Verificar permiso y existencia
    const checkQuery = `
      SELECT r.id, f.owner_id 
      FROM reservations r 
      JOIN fields f ON r.field_id = f.id 
      WHERE r.id = $1
    `;
    const checkResult = await pool.query(checkQuery, [reservationId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Reservación no encontrada" });
    }

    if (checkResult.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: "No tienes permiso para confirmar esta reservación" });
    }

    // Actualizar estado
    await pool.query("UPDATE reservations SET status = 'confirmada' WHERE id = $1", [reservationId]);

    res.status(200).json({ success: true, message: 'Reservación confirmada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las canchas del dueño
app.get("/owner/fields", verifyAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const query = "SELECT * FROM fields WHERE owner_id = $1 ORDER BY created_at DESC;";
    const result = await pool.query(query, [ownerId]);
    res.status(200).json({ fields: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar una nueva cancha
app.post("/owner/add-field", verifyAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, type, description, price_per_hour, address, latitude, longitude, contact_phone } = req.body;

    const query = `
      INSERT INTO fields (owner_id, name, type, description, price_per_hour, address, latitude, longitude, contact_phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [ownerId, name, type, description, price_per_hour, address, latitude, longitude, contact_phone];

    const result = await pool.query(query, values);

    res.status(200).json({
      message: "Cancha creada correctamente",
      field: result.rows[0]
    });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
    });

    // Actualizar una cancha existente
    app.put("/owner/update-field/:id", verifyAuth, async (req, res) => {
    try {
    const ownerId = req.user.id;
    const { id } = req.params;
    const { name, type, description, price_per_hour, address, latitude, longitude, contact_phone } = req.body;

    // Verificar que la cancha pertenece al dueño
    const checkQuery = "SELECT owner_id FROM fields WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Cancha no encontrada" });
    }

    if (checkResult.rows[0].owner_id !== ownerId) {
      return res.status(403).json({ error: "No tienes permiso para editar esta cancha" });
    }

    const query = `
      UPDATE fields 
      SET name = $1, type = $2, description = $3, price_per_hour = $4, address = $5, 
          latitude = $6, longitude = $7, contact_phone = $8
      WHERE id = $9
      RETURNING *;
    `;
    const values = [name, type, description, price_per_hour, address, latitude, longitude, contact_phone, id];

    const result = await pool.query(query, values);

    res.status(200).json({
      message: "Cancha actualizada correctamente",
      field: result.rows[0]
    });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
    });

// --- PLAYER ENDPOINTS ---

// Obtener todas las canchas activas
app.get("/player/fields", verifyAuth, async (req, res) => {
  try {
    const query = "SELECT * FROM fields WHERE is_active = true ORDER BY created_at DESC;";
    const result = await pool.query(query, []);
    res.status(200).json({ fields: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener detalles de una cancha específica
app.get("/player/field/:id", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM fields WHERE id = $1;";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cancha no encontrada" });
    }

    res.status(200).json({ field: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener disponibilidad (reservaciones) de una cancha para una fecha
app.get("/player/field/:id/availability", verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // Formato YYYY-MM-DD

    const query = `
      SELECT start_time, end_time 
      FROM reservations 
      WHERE field_id = $1 AND DATE(start_time) = $2 AND status != 'cancelada';
    `;
    const result = await pool.query(query, [id, date]);

    res.status(200).json({ reservations: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una reserva
app.post("/player/reserve", verifyAuth, async (req, res) => {
  try {
    const { field_id, start_time, end_time } = req.body;
    const user_id = req.user.id;

    // Validación de traslape
    const overlapQuery = `
      SELECT * FROM reservations 
      WHERE field_id = $1 AND status != 'cancelada' 
      AND (start_time < $3 AND end_time > $2)
    `;
    const overlapResult = await pool.query(overlapQuery, [field_id, start_time, end_time]);

    if (overlapResult.rows.length > 0) {
      return res.status(400).json({ error: "El horario seleccionado ya está ocupado" });
    }

    // Insertar reserva
    const insertQuery = `
      INSERT INTO reservations (field_id, user_id, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, 'pendiente')
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [field_id, user_id, start_time, end_time]);

    res.status(200).json({
      message: "Reserva creada exitosamente",
      reservation: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las reservaciones del jugador
app.get("/player/reservations", verifyAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        r.id, 
        f.id as field_id,
        f.name as field_name, 
        f.type as field_type, 
        r.start_time, 
        r.end_time, 
        r.status,
        (f.price_per_hour * EXTRACT(EPOCH FROM (r.end_time - r.start_time))/3600) as total_price
      FROM reservations r
      JOIN fields f ON r.field_id = f.id
      WHERE r.user_id = $1
      ORDER BY r.start_time DESC;
    `;
    
    const result = await pool.query(query, [userId]);
    res.status(200).json({ reservations: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancelar una reserva del jugador
app.post("/player/cancel-reservation", verifyAuth, async (req, res) => {
  try {
    const { reservationId } = req.body;
    const userId = req.user.id;

    if (!reservationId) {
      return res.status(400).json({ error: "ID de reservación requerido" });
    }

    // Buscar la reserva para verificar pertenencia y tiempo
    const checkQuery = `
      SELECT r.start_time, r.user_id, r.status
      FROM reservations r
      WHERE r.id = $1
    `;
    const checkResult = await pool.query(checkQuery, [reservationId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Reservación no encontrada" });
    }

    const reservation = checkResult.rows[0];

    // Verificar que la reserva pertenece al usuario
    if (reservation.user_id !== userId) {
      return res.status(403).json({ error: "No tienes permiso para cancelar esta reservación" });
    }

    // Verificar si ya está cancelada
    if (reservation.status === 'cancelada') {
      return res.status(400).json({ error: "La reservación ya se encuentra cancelada" });
    }

    // Verificar el tiempo de antelación (mínimo 2 horas)
    const startTime = new Date(reservation.start_time);
    const now = new Date();
    const diffInMilliseconds = startTime - now;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    if (diffInHours < 2) {
      return res.status(400).json({ error: "No se puede cancelar con menos de 2 horas de antelación" });
    }

    // Actualizar estado a 'cancelada'
    await pool.query("UPDATE reservations SET status = 'cancelada' WHERE id = $1", [reservationId]);

    res.status(200).json({ message: "Reserva cancelada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

module.exports = { app, pool };
