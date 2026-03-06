

## Plan: Fix Non-Functional UI Elements

### Problems Found

1. **Dashboard buttons** — "Hoy" and "Nueva Venta" have no click handlers
2. **Header search bar** — No search logic; purely decorative
3. **User menu "Mi Perfil"** — No onClick, does nothing
4. **User menu "Configuración"** — Navigates to `/configuracion` instead of `/admin/configuracion` (wrong route)

---

### Solution

#### 1. Dashboard Buttons (src/pages/Dashboard.tsx)
- **"Hoy"** → Navigate to `/admin/reservas` (show today's appointments — the most logical action for "Today")
- **"Nueva Venta"** → Navigate to `/admin/pos` (open Point of Sale)
- Add `useNavigate` from react-router-dom

#### 2. Header Search (src/components/layout/Header.tsx)
- Implement a global search that filters across sections: Clientes, Barberos, Inventario, Reservas
- On typing, show a dropdown with grouped results (using existing data hooks or lightweight queries)
- Clicking a result navigates to the appropriate section
- **Simpler approach**: Make the search a command palette (using the existing `cmdk` package already installed) that lets users quickly jump to any page or search clients/products

#### 3. User Menu Fixes (src/components/layout/Header.tsx)
- **"Mi Perfil"** → Navigate to `/admin/configuracion` with the password tab active (since that's where profile/account settings live), or create a simple profile view within Configuración
- **"Configuración"** → Fix route from `/configuracion` to `/admin/configuracion`

---

### Files to Modify

| File | Change |
|---|---|
| `src/pages/Dashboard.tsx` | Add `useNavigate`, wire "Hoy" → `/admin/reservas`, "Nueva Venta" → `/admin/pos` |
| `src/components/layout/Header.tsx` | Fix Configuración route to `/admin/configuracion`. Wire "Mi Perfil" → `/admin/configuracion`. Implement search with command palette using `cmdk` (already installed) that searches pages + clients + products |

### Technical Details

**Command Palette Search** — Using the already-installed `cmdk` library:
- Trigger on focus of search input or Ctrl+K shortcut
- Sections: "Páginas" (Dashboard, Reservas, POS, etc.), "Acciones" (Nueva Venta, Nuevo Cliente)
- Each item navigates to the correct route on selection
- Lightweight, no extra DB queries needed for page navigation; can optionally query clients/products as the user types

