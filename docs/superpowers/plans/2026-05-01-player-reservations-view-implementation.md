# Player 'My Reservations' View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `reservas.html` page for players to manage their bookings.

**Architecture:**
- Backend: Express endpoints to fetch player reservations (JOIN fields) and cancel them with a 2-hour window check.
- Frontend: Responsive page with ticket-styled cards using CSS Flexbox/Grid and SweetAlert2.

**Tech Stack:** Node.js, Express, PostgreSQL, HTML/CSS/JS.

---

### Task 1: Backend Endpoints for Player Reservations

**Files:**
- Modify: `index.js`

- [ ] **Step 1: Add GET `/player/reservations`**
```javascript
app.get("/player/reservations", verifyAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT 
        r.id, 
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
```

- [ ] **Step 2: Add POST `/player/cancel-reservation`**
```javascript
app.post("/player/cancel-reservation", verifyAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { reservationId } = req.body;

    // 1. Verify ownership and time window
    const checkQuery = "SELECT start_time, user_id FROM reservations WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [reservationId]);

    if (checkResult.rows.length === 0) return res.status(404).json({ error: "Reserva no encontrada" });
    if (checkResult.rows[0].user_id !== userId) return res.status(403).json({ error: "No autorizado" });

    const startTime = new Date(checkResult.rows[0].start_time);
    const now = new Date();
    const diffHours = (startTime - now) / (1000 * 60 * 60);

    if (diffHours < 2) {
      return res.status(400).json({ error: "No se puede cancelar con menos de 2 horas de antelación" });
    }

    // 2. Update status
    await pool.query("UPDATE reservations SET status = 'cancelada' WHERE id = $1", [reservationId]);
    res.status(200).json({ message: "Reserva cancelada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

### Task 2: Frontend Implementation `reservas.html`

**Files:**
- Create: `public/reservas.html`

- [ ] **Step 1: Create HTML structure and Ticket-Style CSS**
Use a clean dark/light theme (matching `playerHome.html`). 
Design a `.ticket-card` class with dashed borders for the "tear-off" effect.

- [ ] **Step 2: Implement JS fetching and dynamic rendering**
Fetch `/player/reservations`. 
Filter into `upcoming` (start_time > now) and `past` (start_time <= now or cancelled).
Format dates to "Sábado, 2 de Mayo".

- [ ] **Step 3: Implement Cancellation Logic**
Use SweetAlert2 for the confirmation popup.
Call `/player/cancel-reservation` and handle response.

---

### Task 4: Link Integration

**Files:**
- Modify: `public/playerHome.html`
- Modify: `public/fieldDetail.html`

- [ ] **Step 1: Ensure "Mis Reservas" links point to `reservas.html`**
Verify the header links in both pages.
