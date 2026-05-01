# Design Spec: Player Reservations View

## Goal
Create a modern, ticket-styled "My Reservations" page for players to view their booking history and manage upcoming games.

## UI/UX Requirements
- **Header:** Consistent with `playerHome.html`.
- **Sections:**
  - **Tus Próximos Juegos:** Active bookings (not cancelled) with a start time in the future.
  - **Historial de Juegos:** Bookings with a start time in the past OR cancelled bookings.
- **Ticket Card Design:**
  - **Left Section (Stub):** Large icon (Pádel, Tenis, or Fútbol) and a colored status badge (Pending, Confirmed, Cancelled).
  - **Separator:** Vertical dashed border with "tear-off" notches (half-circles) at the top and bottom.
  - **Right Section (Main):** Field name, formatted date (e.g., "Sábado, 2 de Mayo"), time range, total price, and "Cancelar" button.
- **Cancellation:**
  - Confirmation via SweetAlert2.
  - Button disabled/hidden if booking is within 2 hours of starting or already cancelled.

## Data & API
- **Endpoint:** `GET /player/reservations`
  - Returns: `{ reservations: [{ id, field_name, field_type, start_time, end_time, status, total_price }] }`
- **Endpoint:** `POST /player/cancel-reservation`
  - Body: `{ reservationId }`
- **Authentication:** Bearer token in `Authorization` header.

## Tech Stack
- Tailwind CSS
- FontAwesome 6
- SweetAlert2
- Vanilla JS

## Status Mapping
- `pendiente`: Yellow badge
- `confirmada`: Green badge
- `cancelada`: Red badge

## Icon Mapping
- `pádel` -> `fa-table-tennis-paddle-ball`
- `tenis` -> `fa-baseball-bat-ball`
- default -> `fa-futbol`
