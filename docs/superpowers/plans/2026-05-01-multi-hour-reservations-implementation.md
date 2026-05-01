# Multi-Hour Range Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the reservation UI to allow selecting a range of hours with two clicks while preventing overlaps.

**Architecture:**
- Frontend: Update `fieldDetail.html` with range selection state and interactive slot handling.
- Backend: Ensure `index.js` correctly validates the full time range.

**Tech Stack:** HTML/CSS/JS, Node.js, Express, PostgreSQL.

---

### Task 1: Update Frontend Interaction in `fieldDetail.html`

**Files:**
- Modify: `public/fieldDetail.html`

- [ ] **Step 1: Update CSS for range selection**
Add styles for "selected", "range-middle", and "invalid-range" states.
```css
.time-slot.selected { background-color: var(--primary-green); color: white; }
.time-slot.range-middle { background-color: rgba(46, 204, 113, 0.3); }
.time-slot.invalid-range { background-color: rgba(231, 76, 60, 0.3); cursor: not-allowed; }
```

- [ ] **Step 2: Update JS to handle Two-Click logic**
Modify `renderAvailability` to add event listeners for `click` and `mouseenter`.
Store `selectionStart` and `selectionEnd`.
Implement `handleSlotClick` and `handleSlotHover`.

- [ ] **Step 3: Update Confirmation Modal**
Calculate total hours and price in the confirmation dialog.

---

### Task 2: Backend Validation Reinforcement

**Files:**
- Modify: `index.js`

- [ ] **Step 1: Verify and Refine overlap logic**
Ensure the SQL query in `POST /player/reserve` covers all overlap scenarios:
1. Existing reservation starts during the new one.
2. Existing reservation ends during the new one.
3. Existing reservation completely covers the new one.
4. New reservation completely covers the existing one.

```sql
SELECT * FROM reservations 
WHERE field_id = $1 AND status != 'cancelada'
AND (
    (start_time < $3 AND end_time > $2)
)
```
*Note: (NewStart < OldEnd) AND (NewEnd > OldStart) is the standard formula for range overlap.*

---

### Task 3: Verification

- [ ] **Step 1: Manual Test**
1. Select 9:00 as start.
2. Hover over 10:00 and 11:00.
3. Click 11:00 as end.
4. Verify modal shows "2 hours" (9 to 11).
5. Confirm and check DB/Owner view.
