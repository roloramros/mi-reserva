# Multi-Hour Range Reservation Design Specification

## Objective
Improve the reservation process by allowing players to select a continuous range of hours (e.g., from 09:00 to 11:00) in a single transaction, instead of booking hour by hour.

## User Interface (`public/fieldDetail.html`)

### Range Selection Logic ("Two Clicks" Method)
- **First Click:** Sets the `selectionStart`. The clicked slot is highlighted as the starting point.
- **Mouse Hover:** As the user hovers over subsequent slots, all slots between `selectionStart` and the current hovered slot are visually highlighted.
- **Preventive Blocking:** If a slot in the range being hovered is "Occupied", the highlighting will turn red or stop at the last available slot, preventing the user from completing an invalid range.
- **Second Click:** Sets the `selectionEnd`. This triggers the confirmation modal.
- **Reset:** A "Cancelar Selección" button will appear once the first click is made to allow the user to start over.

### UI Updates
- Slots will have data attributes (`data-hour`) to facilitate range calculation.
- The confirmation modal will display:
    - Total hours selected.
    - Calculated total price (`price_per_hour * hours`).

## Backend API (`index.js`)

### POST `/player/reserve`
- The current endpoint already accepts `start_time` and `end_time`.
- **Validation Reinforcement:** Ensure the overlap check correctly identifies any existing reservation that touches any part of the requested `[start, end]` interval.
- **SQL Overlap Logic (Current & Verified):**
    ```sql
    SELECT * FROM reservations 
    WHERE field_id = $1 AND status != 'cancelada'
    AND (
      (start_time <= $2 AND end_time > $2) OR
      (start_time < $3 AND end_time >= $3) OR
      (start_time >= $2 AND end_time <= $3)
    )
    ```

## Success Criteria
- Players can select a range (e.g., 2 or 3 hours) with two clicks.
- The UI prevents selecting a range that overlaps with an existing reservation.
- The owner sees a single reservation entry for the entire duration.
- The price is correctly calculated based on the duration.
