---
name: react-component
description: React frontend conventions for the car-parts store. CSS Modules, TypeScript, component patterns, API integration. Use when creating or modifying React components, pages, styles, or API calls.
---

# Car Parts Store - React Frontend Conventions

## Project Structure
```
frontend/src/
  api/          # API client functions (one file per module)
  components/
    Layout/     # StoreLayout, AdminLayout
    UI/         # Reusable: Button, Input, Select, Modal, Table, Badge, Card, etc.
    Product/    # ProductCard, etc.
    Vehicle/    # VehicleSelector
  contexts/     # AuthContext, CartContext, ThemeContext
  pages/
    admin/      # Admin pages: *AdminPage.tsx + *.module.css
    store/      # Store pages: *Page.tsx + *.module.css
    auth/       # Login, Register, Profile
  types/        # index.ts - all TypeScript interfaces
  utils/        # formatters.ts, etc.
```

## Component Pattern
```tsx
import React, { useState, useEffect } from 'react';
import styles from './ComponentName.module.css';

interface Props { /* typed props */ }

const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div className={styles.container}>...</div>;
};

export default ComponentName;
```

## Styling: CSS Modules ONLY
- Every component/page has a `.module.css` file
- Use `className={styles.className}` - NEVER inline styles
- Use CSS variables from `index.css` for theming:
  - Colors: `var(--color-primary)`, `var(--color-accent)`, `var(--color-accent-hover)`
  - Primary = Deep Navy Blue (#1e3a5f), Accent = Vivid Orange (#f47920)
  - Text: `var(--text-primary)`, `var(--text-secondary)`, `var(--text-tertiary)`
  - Backgrounds: `var(--bg-primary)`, `var(--bg-secondary)`, `var(--bg-elevated)`
  - Borders: `var(--border-primary)`, `var(--border-input)`
  - Radius: `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`
  - Shadows: `var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-lg)`
  - Transitions: `var(--transition-fast)`, `var(--transition-base)`
- Dark mode is handled automatically via CSS variables in `:root[data-theme="dark"]`
- Multi-class: `className={`${styles.btn} ${styles.active}`}`

## Admin Pages: Modal-Based CRUD Pattern
ALL admin pages use modals for create/edit (NOT separate page navigation):
```tsx
const [modalOpen, setModalOpen] = useState(false);
const [editing, setEditing] = useState<Item | null>(null);
const [formData, setFormData] = useState(initialFormData);

const openCreate = () => { setEditing(null); setFormData(initial); setModalOpen(true); };
const openEdit = (item) => { setEditing(item); setFormData(fromItem(item)); setModalOpen(true); };

// Use <Modal isOpen={modalOpen} size="large" title={editing ? 'Edit' : 'Create'}>
// For large forms, use size="large" (900px max-width)
```

## API Client Pattern
```typescript
// api/resource.ts
import apiClient from './client';  // Axios instance with baseURL + auth headers

export const getResources = async (params?: Record<string, any>): Promise<PaginatedResponse<Resource>> => {
  const response = await apiClient.get('/resources', { params });
  return response.data;
};

export const getResource = async (id: string): Promise<Resource> => {
  const response = await apiClient.get(`/resources/${id}`);
  return response.data.data;
};
```

## TypeScript Types
- ALL types defined in `types/index.ts`
- Use interfaces, not type aliases for objects
- API responses: `PaginatedResponse<T>` with `data`, `meta`, `links`
- Form data interfaces separate from API response interfaces

## UI Components Available
- `Button` (variant: primary/outline/danger, loading, fullWidth)
- `Input` (label, name, type, required, onChange)
- `Select` (label, options: {value, label}[], placeholder, onChange)
- `Modal` (isOpen, onClose, title, footer, size: default/large)
- `Table` (columns, data, loading, emptyMessage)
- `Badge` (variant: success/warning/danger/default)
- `Card`, `SearchBar`, `Pagination`, `LoadingSpinner`, `EmptyState`

## Icons: react-icons/fi (Feather Icons)
Import from `react-icons/fi`: FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiSearch, etc.

## Routing
- React Router v6 with `<Routes>`, `<Route>`, `useNavigate`, `useParams`
- Store routes under `<StoreLayout />`, admin under `<AdminLayout />`
- Protected routes wrap with `<ProtectedRoute />` or `<ProtectedRoute requireAdmin />`

## Toast Notifications
```typescript
import toast from 'react-hot-toast';
toast.success('Created successfully');
toast.error('Failed to create');
```
