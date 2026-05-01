# Player Home Grid UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `public/playerHome.html` into a modern field discovery page with a responsive grid, search, and category filtering.

**Architecture:** A single-page discovery interface using Tailwind CSS for styling and vanilla JavaScript for data fetching, rendering, and local filtering. It connects to the `GET /player/fields` endpoint.

**Tech Stack:** HTML5, Tailwind CSS (via CDN), Vanilla JS, JWT (localStorage).

---

### Task 1: HTML Structure and Styling

**Files:**
- Modify: `public/playerHome.html`

- [ ] **Step 1: Overwrite `public/playerHome.html` with the new structure and Tailwind CSS.**
- [ ] **Step 2: Add the Header, Search/Filter section, and a container for the Grid.**
- [ ] **Step 3: Add a loading spinner/placeholder.**

### Task 2: Authentication and Data Fetching

**Files:**
- Modify: `public/playerHome.html` (script section)

- [ ] **Step 1: Implement the `checkAuth` function to redirect if `authToken` is missing.**
- [ ] **Step 2: Implement the `fetchFields` function to call `GET /player/fields`.**
- [ ] **Step 3: Log the data to verify the response structure.**

### Task 3: Rendering and Card UI

**Files:**
- Modify: `public/playerHome.html` (script section)

- [ ] **Step 1: Implement the `renderFields` function to generate card HTML.**
- [ ] **Step 2: Use template literals to inject field data (name, price, type, address) into cards.**
- [ ] **Step 3: Ensure the "Ver Disponibilidad" button links to `fieldDetail.html?id=[id]`.**

### Task 4: Local Filtering Logic

**Files:**
- Modify: `public/playerHome.html` (script section)

- [ ] **Step 1: Implement the search bar event listener to filter by name.**
- [ ] **Step 2: Implement category button listeners to filter by field type.**
- [ ] **Step 3: Combine filters and re-render the grid.**

### Task 5: Placeholder for Field Detail

**Files:**
- Create: `public/fieldDetail.html`

- [ ] **Step 1: Create a basic `fieldDetail.html` to prevent 404s when clicking cards.**
- [ ] **Step 2: Add a "Back" button to return to `playerHome.html`.**

---
