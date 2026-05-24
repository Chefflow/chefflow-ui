# Tarea: Slots configurables por usuario y multi-receta por slot (Frontend)

> **Componente principal afectado**: `src/components/dashboard/PlanningTab/PlanningTab.tsx`
> **Componentes afectados**: `SlotCard`, `RecipePickerModal`, `DayColumn` (sin cambios), `ShoppingListPanel` (sin cambios)
> **Hooks afectados**: `usePlanning`, `useShoppingList`
> **UI nueva**: vista de Settings con preferencia `slotsPerDay`
> **Dependencia**: este cambio requiere el backend correspondiente (`chefflow-api/docs/tasks/configurable-multi-recipe-slots.md`). Se entrega coordinado.

---

## 1. Resumen

Dos cambios complementarios sobre la planificación semanal en el frontend:

1. **Slots por día configurable**: actualmente el código tiene hardcodeado `[1, 2, 3]` en dos sitios de `PlanningTab.tsx`. Se sustituye por un valor dinámico procedente del propio planning (`planning.slotsPerDay`) cuando existe, o del usuario (`user.slotsPerDay`) cuando navegamos a una semana sin planning todavía. Rango permitido 1-6, default 3. La preferencia se edita desde una nueva sección de Settings.

2. **Multi-receta por slot**: actualmente `PlanningSlot.recipe: Recipe | null` representa la única receta del slot. Se sustituye por `PlanningSlot.recipes: Recipe[]` (vacío, una, o hasta 5). Caso de uso: combinar "arroz blanco" + "curry" en un slot sin crear una receta nueva. La `SlotCard` ya tiene botones de editar (lápiz) y eliminar (papelera); el cambio principal es **cómo se muestran varias recetas en el card** y **cómo el modal de picker permite añadir más sin reemplazar**.

Ambos cambios viajan juntos porque comparten archivos y tipos.

---

## 2. Reglas generales (obligatorias)

Estas reglas tienen prioridad sobre cualquier preferencia personal del implementador. Si entran en conflicto con consejos genéricos (incluidos los de `CLAUDE.md`), gana lo que dice esta sección.

### 2.1 TypeScript
- **Prohibido `any`**. Usar `unknown` con narrowing si el tipo es desconocido.
- **Strict mode** activo. Respetar nullability.
- **Nullish coalescing** (`??`) en lugar de `||` cuando se quiere fallback solo en `null`/`undefined`.
- Preferir `interface` sobre `type` (regla del repo en `CLAUDE.md`).
- Tipos explícitos en retornos de funciones públicas.

### 2.2 Arquitectura del proyecto > best practices genéricas
- **Respetar patrones del repo** antes de aplicar consejos genéricos. Si chocan, gana el patrón.
- **Patrones obligatorios**:
  - Componentes Cliente: `'use client'` arriba, declarados como `const Component = () => {}` (no `function`).
  - Cada componente en su propia carpeta `PascalCase/PascalCase.tsx` (excepto `src/components/ui/` que mantiene kebab-case por shadcn).
  - Named exports preferidos. Importar tipos con `import type`.
  - Usar `cn()` de `@/lib/utils` para combinar clases.
  - i18n con `useTranslations` (cliente) / `getTranslations` (server). Las claves nuevas deben añadirse a las **5** traducciones (`en`, `es`, `fr`, `de`, `it`).
  - shadcn/ui como librería base. Si necesitas un componente nuevo, instalar con `pnpm dlx shadcn@latest add ...` y luego `pnpm run format`.
  - Después de tocar archivos, ejecutar `pnpm run format` para que Biome no marque diff en commit.

### 2.3 Estado y data fetching
- React Query (`@tanstack/react-query`) para server state. Mantener las keys consistentes con `PLANNING_KEYS` ya existente.
- Optimistic updates donde se pueda. Mantener consistencia con la implementación actual de `useAssignSlot` / `useDeleteSlot`.
- No introducir global state nuevo (zustand/jotai/context) si no es estrictamente necesario.

### 2.4 Accesibilidad y UX
- Botones de eliminar receta concreta dentro del SlotCard deben tener `aria-label` traducido.
- El estado "slot lleno" (5 recetas) oculta o deshabilita visualmente el botón "+" pero mantiene los chips legibles.
- Estados pasados (`isPast`) preservan la restricción actual de no editar.
- El loading sigue mostrándose como skeleton; no parpadear durante optimistic updates.

### 2.5 Tests / verificación manual
- No hay infraestructura de tests unitarios en este repo (verificable con `pnpm run test` que no existe). La verificación es manual:
  - **Antes de marcar la tarea como completada, levantar `pnpm run dev` y probar los flujos descritos en §6** en el navegador.
  - Verificar la golden path y al menos los edge cases UI listados en §7.
  - Type-check con `tsc --noEmit` (o `pnpm run build`) **debe pasar**.
  - `pnpm run lint` **debe pasar** sin warnings nuevos.

---

## 3. Decisiones de diseño cerradas (NO replantear)

| Decisión | Valor |
|---|---|
| Rango `slotsPerDay` | 1 a 6 |
| Default | 3 |
| Identidad de los slots | Posicional (slot 1, 2, 3…). Sin nombre semántico. |
| Política de cambio | El cambio de `slotsPerDay` afecta a **plannings creados después**. Plannings existentes mantienen el suyo (snapshot del backend). |
| Fuente de verdad para "cuántos slots renderizar" | `planning.slotsPerDay` cuando hay planning para esa semana. `user.slotsPerDay` como fallback (semanas sin planning aún). |
| Slots permitiendo multi-receta | Todos. Sin configuración por slot. |
| Tope de recetas por slot | 5 |
| Mínimo | 0 (slot vacío es válido) |
| Duplicados en mismo slot | Prohibidos. La modal de picker debe **filtrar** las recetas que ya están en el slot. |
| Orden | Por orden de inserción (server-side `position` ASC). No drag & drop. |
| UX de añadir receta a slot vacío | Click en SlotCard vacío → abre `RecipePickerModal` → seleccionas 1 → POST → modal cierra. |
| UX de añadir 2ª/3ª receta | Click en botón "+" dentro del SlotCard → abre el mismo modal (filtrando ya añadidas) → seleccionas 1 → POST → modal cierra. |
| UX del botón papelera de la SlotCard | Borra **todas** las recetas del slot (DELETE `/slots/:day/:slot`). Confirmar con un AlertDialog si hay más de 1 receta. Si hay 1 sola, sin confirmación (consistente con comportamiento actual). |
| UX del botón editar (lápiz) de la SlotCard | Abre el modal con las recetas actuales pre-marcadas (modo "edición") → permite añadir o quitar — DECISIÓN A CONFIRMAR (ver §9). Implementación recomendada: **el botón lápiz se elimina** y la edición se hace por interacción directa con los chips dentro del card (X en cada chip, "+" para añadir). |
| UX al eliminar la última receta | El slot vuelve al estado vacío visualmente (botón "Añadir"). En backend la fila persiste pero eso es transparente al frontend. |
| Cómo se renderizan varias recetas en SlotCard | Stack vertical de chips/badges (uno por receta) cada uno con su botón "X" para eliminarlo. Botón "+" al final si `recipes.length < 5`. Sin scroll dentro del card (cabe en la altura natural; con 5 elementos podría aumentar la altura del card y eso es aceptable). |

---

## 4. Cambios en tipos (`src/lib/api/interface/`)

### 4.1 `planning/index.ts`

**Antes** (relevante):
```typescript
export interface PlanningSlot {
  id: number;
  dayOfWeek: PlanningDayOfWeek;
  slotNumber: number;
  recipeId: number;
  recipe: Recipe | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssignSlotRequest {
  recipeId: number;
}

export interface WeeklyPlanning {
  id: number;
  weekStart: string;
  weekEnd: string;
  slots: PlanningSlot[];
  // ...
}
```

**Después**:
```typescript
export interface PlanningSlot {
  id: number;
  dayOfWeek: PlanningDayOfWeek;
  slotNumber: number;
  recipes: Recipe[];        // ← reemplaza recipeId + recipe (singular)
  createdAt: string;
  updatedAt: string;
}

export interface AddRecipeToSlotRequest {
  recipeId: number;
}

export interface WeeklyPlanning {
  id: number;
  weekStart: string;
  weekEnd: string;
  slotsPerDay: number;      // ← nuevo
  slots: PlanningSlot[];
  // ...
}
```

> Eliminar `AssignSlotRequest` (asociado al endpoint `PUT` que el backend elimina).

### 4.2 `auth/index.ts` (o equivalente del User)

Añadir `slotsPerDay` al tipo `User` / `ApiUser`:

```typescript
export interface ApiUser {
  // ... campos existentes
  slotsPerDay: number;
}
```

Y al request de update:

```typescript
export interface UpdateProfileRequest {
  name?: string;
  image?: string;
  slotsPerDay?: number;     // ← nuevo
}
```

---

## 5. Cambios en API client y hooks

### 5.1 `src/lib/api/planning-client.ts`

Cambios:
- Eliminar `assignSlot()` (endpoint `PUT` desaparece).
- Añadir `addRecipeToSlot(planningId, day, slotNumber, body: AddRecipeToSlotRequest)`: `POST /weekly-plannings/:id/slots/:day/:slot/recipes`. Devuelve el slot actualizado.
- Añadir `removeRecipeFromSlot(planningId, day, slotNumber, recipeId)`: `DELETE /weekly-plannings/:id/slots/:day/:slot/recipes/:recipeId`. Devuelve `void`.
- Mantener `deleteSlot()` (existente). Borra todas las recetas del slot.

### 5.2 `src/hooks/usePlanning/usePlanning.ts`

Cambios:
- **Eliminar** `useAssignSlot`.
- **Añadir** `useAddRecipeToSlot(planningId)`:
  - Mutation que llama a `planningClient.addRecipeToSlot`.
  - Optimistic update: añade la receta al slot correspondiente en la cache de `PLANNING_KEYS.detail(planningId)`. Si el slot no existe en cache aún (slot vacío), crearlo localmente.
  - On error, rollback + toast.
  - Invalidate `PLANNING_KEYS.detail(planningId)` on settled.
- **Añadir** `useRemoveRecipeFromSlot(planningId)`:
  - Mutation que llama a `planningClient.removeRecipeFromSlot`.
  - Optimistic update: filtra la receta del slot en cache. Si quedan 0 recetas, **mantener el slot** en cache con `recipes: []` (consistente con backend).
  - Invalidate al settled.
- **Mantener** `useDeleteSlot` (borra slot completo).
- **Mantener** `useCreatePlanning`, `useWeeklyPlanning`, `useWeeklyPlannings`.
- Las keys (`PLANNING_KEYS`) no requieren cambios estructurales.

### 5.3 `src/hooks/useShoppongList/useShoppingList.ts`

> Nota: el archivo está mal escrito como `useShoppongList` (con typo). No corregir en esta tarea para no introducir cambios no relacionados — abrir issue por separado.

Cambios:
- Donde itera `slot.recipe` → cambiar a iterar `slot.recipes` (array).
- Acumulación de ingredientes ya soporta múltiples recetas (la lógica del Map por `ingredientName::unit` no cambia).
- Si una receta aparece en múltiples slots **o múltiples veces dentro de slots distintos**, las cantidades se suman correctamente (esto ya funciona porque la lógica suma sin deduplicar).

### 5.4 `src/hooks/useUpdateProfile` (nuevo o existente)

Buscar si ya existe un hook para actualizar el perfil. Si existe, añadir soporte para `slotsPerDay`. Si no:

- Crear `src/hooks/useUpdateProfile/useUpdateProfile.ts`.
- Mutation: `PATCH /users/me` (o el endpoint del backend correspondiente — coordinar con backend).
- Body: `UpdateProfileRequest`.
- On success: actualizar la cache de la query del perfil del usuario y mostrar toast de "Guardado".
- Invalidate la query del User.

### 5.5 `src/hooks/useWeekPlanning/useWeekPlanning.ts`

Sin cambios estructurales. Sigue calculando el rango y la navegación de la semana.

---

## 6. Cambios en componentes

### 6.1 `src/components/dashboard/PlanningTab/PlanningTab.tsx`

**Cambios concretos**:

**Línea 30-38**: el array `DAY_OF_WEEK` se mantiene.

**Líneas 40-50** (`getSlotsForDay`): el slice `[1, 2, 3]` se reemplaza por un array dinámico:

```typescript
function getSlotsForDay(
  slots: PlanningSlot[],
  dayOfWeek: PlanningDayOfWeek,
  slotsPerDay: number,
): (PlanningSlot | null)[] {
  return Array.from({ length: slotsPerDay }, (_, i) => i + 1).map(
    (slotNumber) =>
      slots.find(
        (s) => s.dayOfWeek === dayOfWeek && s.slotNumber === slotNumber,
      ) ?? null,
  );
}
```

**Líneas 173-218** (render del grid): el `[1, 2, 3] as const` (línea 181) se reemplaza por un array dinámico.

Determinar `slotsPerDay` para la semana visible:
- Si hay `currentPlanning` y se ha cargado el detalle: usar `planning.slotsPerDay`.
- Si no hay planning todavía (semana sin planificar): usar `user.slotsPerDay`.

```typescript
const effectiveSlotsPerDay = planning?.slotsPerDay ?? user?.slotsPerDay ?? 3;
const slotNumbers = Array.from({ length: effectiveSlotsPerDay }, (_, i) => i + 1);
```

Reemplazar las dos ocurrencias de `[1, 2, 3]`:
- Línea 44 → `Array.from({ length: effectiveSlotsPerDay }, (_, i) => i + 1)`
- Línea 181 → `slotNumbers`

**Funciones `assignRecipeToSlot` / `handleRecipeSelect`**: refactorizar para usar el nuevo flujo:
- Renombrar `assignRecipeToSlot` → `addRecipeToSlot`.
- Cambiar la llamada interna de `assignSlot` → `addRecipeToSlot` (nuevo hook).
- El comportamiento al crear un planning nuevo (rama `else` que usa `createPlanning`) se mantiene, pero usando el nuevo método del client (`addRecipeToSlot` en lugar de `assignSlot`).

**Estado `pendingSlot`**: extender para llevar la info de "qué recetas hay ya en ese slot" (para que el modal pueda filtrarlas):

```typescript
const [pendingSlot, setPendingSlot] = useState<{
  dayIndex: number;
  slotNumber: number;
  existingRecipeIds: number[];   // ← nuevo: para filtrar el picker
} | null>(null);
```

Al setear `pendingSlot`, pasar los IDs de recetas ya presentes:

```typescript
onAdd={() => {
  const slot = /* resolver el slot */;
  setPendingSlot({
    dayIndex,
    slotNumber,
    existingRecipeIds: slot?.recipes.map((r) => r.id) ?? [],
  });
}}
```

**Loading state**: si `user` aún no está cargado y no tenemos `slotsPerDay`, usar 3 como fallback temporal y aceptar un re-render cuando llegue el dato.

### 6.2 `src/components/planning/SlotCard/SlotCard.tsx`

**Cambios de props**:

**Antes**:
```typescript
interface SlotCardProps {
  slotNumber: number;
  slotLabel: string;
  recipe: { id: number; title: string } | null;   // ← singular
  isPast: boolean;
  isLoading: boolean;
  onAdd: () => void;
  onRemove: () => void;                            // borraba el slot completo
  changeLabel: string;
  removeLabel: string;
}
```

**Después**:
```typescript
interface SlotCardProps {
  slotNumber: number;
  slotLabel: string;
  recipes: Array<{ id: number; title: string }>;   // ← plural, puede ser []
  maxRecipes: number;                               // 5, prop por defecto
  isPast: boolean;
  isLoading: boolean;
  onAddRecipe: () => void;                          // antes era onAdd
  onRemoveRecipe: (recipeId: number) => void;       // ← nuevo: borra una concreta
  onClearSlot: () => void;                          // antes era onRemove (borra todo)
  addRecipeLabel: string;
  removeRecipeLabel: string;                        // aria-label para X de cada chip
  clearSlotLabel: string;                           // aria-label para papelera
  slotFullLabel: string;                            // tooltip cuando recipes.length === maxRecipes
}
```

**Comportamiento del render**:

- **`recipes.length === 0`** (slot vacío): renderizar igual que ahora — un placeholder con botón "Añadir receta" que dispara `onAddRecipe`.
- **`recipes.length >= 1`**: stack vertical de chips/badges, uno por receta:
  - Cada chip muestra el `recipe.title` (truncado si excede el ancho del card).
  - Cada chip tiene un botón "X" pequeño a la derecha que dispara `onRemoveRecipe(recipe.id)`.
  - Debajo del stack: si `recipes.length < maxRecipes`, mostrar botón "+" pequeño que dispara `onAddRecipe`. Si `recipes.length === maxRecipes`, ocultar el "+" o mostrarlo deshabilitado con tooltip "slot lleno".
  - En la cabecera del card (si la hay), mantener un botón papelera que dispara `onClearSlot` (borra todo). **Solo visible si `recipes.length >= 1`.**
- **`isPast === true`**: deshabilitar todos los controles (sin botones ni clicks). Renderizar los chips en modo read-only.
- **`isLoading === true`**: skeleton.

**Sobre la "edición"**: el botón lápiz que tenía la SlotCard original deja de tener sentido — ahora la edición es directa (X en cada chip + "+" para añadir). Eliminar el lápiz si existe. Si por algún motivo el usuario quiere "rehacer" todo el slot, puede pulsar la papelera y empezar.

**Diseño visual de los chips**: usar el `Badge` de shadcn (instalar si no existe) con un botón "X" a la derecha. Mantener consistencia visual con el resto del dashboard (tipografía sans-serif, color secundario para el chip, primary para el botón "+").

### 6.3 `src/components/planning/RecipePickerModal/RecipePickerModal.tsx`

**Cambios de props**:

**Añadir**:
```typescript
interface RecipePickerModalProps {
  // ... props existentes
  excludeRecipeIds: number[];   // ← nuevo: filtra del listado las que ya están en el slot
  noAvailableRecipesText: string;  // ← nuevo: i18n para el caso "todas excluidas"
}
```

**Comportamiento**:
- Filtrar `recipes` para excluir las cuyo `id` esté en `excludeRecipeIds`.
- Si tras el filtro quedan 0: mostrar mensaje `noAvailableRecipesText` ("Todas las recetas ya están en este slot — crea una nueva") + botón "Crear nueva receta" (mantener funcionalidad existente).
- El modal sigue siendo **single-select** — selecciona una receta y cierra. Para añadir más, el usuario reabre el modal desde el "+".

> Justificación de single-select vs multi-select: simpler UI, evita gestionar estado complejo en el modal, y la operación POST por receta del backend es atómica (mejor para optimistic updates).

### 6.4 `src/components/planning/DayColumn/DayColumn.tsx`

Sin cambios. Sigue siendo un wrapper con cabecera del día.

### 6.5 `src/components/planning/ShoppingListPanel/ShoppingListPanel.tsx`

Sin cambios estructurales. La lógica de agregación de ingredientes vive en `useShoppingList`, que se actualiza para iterar `slot.recipes`.

### 6.6 `src/components/planning/PlanningHeader/PlanningHeader.tsx`

Sin cambios.

### 6.7 `src/components/planning/WeekNavigation/WeekNavigation.tsx`

Sin cambios.

### 6.8 Confirmación al limpiar slot

Cuando el usuario pulsa la papelera para borrar todas las recetas:
- Si `recipes.length >= 2`: mostrar `AlertDialog` de shadcn confirmando.
- Si `recipes.length === 1`: ejecutar directamente sin confirmación (paridad con UX actual).
- El AlertDialog debe usar i18n keys nuevas: `planning.confirmClearSlotTitle`, `planning.confirmClearSlotMessage`, `planning.confirmClearSlotConfirm`, `planning.confirmClearSlotCancel`.

---

## 7. UI nueva: Settings (preferencias del usuario)

### 7.1 Ubicación

Propuesta: añadir una nueva ruta `/[locale]/settings` con su `page.tsx`, dentro de la zona protegida (post-auth). Layout idéntico al dashboard (mismo header, navegación lateral si la hay).

Si la convención del repo es "todas las secciones del producto en el dashboard como tabs", añadir una pestaña "Settings" / "Ajustes" al dashboard, junto a "Recetas" y "Planificación".

> Decisión a confirmar: ver §9.

### 7.2 Componente `SettingsTab` (o `SettingsPage`)

Archivo: `src/components/dashboard/SettingsTab/SettingsTab.tsx` (o `src/app/[locale]/settings/page.tsx`).

Contenido mínimo en esta iteración:
- Título "Preferencias de planificación".
- Campo `slotsPerDay`:
  - Label: "Comidas por día".
  - Texto de ayuda: "Aplica a las semanas planificadas a partir de ahora. Las semanas ya guardadas mantienen su configuración."
  - Control: `Select` de shadcn con opciones 1-6 (label = el número), valor inicial = `user.slotsPerDay`.
  - Botón "Guardar" → dispara `useUpdateProfile`.
  - Indicador de loading durante el save.
  - Toast de éxito.
- Otros campos del perfil (nombre, foto) **fuera del alcance** de esta tarea — solo añadir si ya existían.

### 7.3 Acceso desde el header

Si hay un menú de usuario en el header (avatar dropdown), añadir un item "Settings" / "Ajustes" que navegue a la nueva ruta o tab.

---

## 8. Internacionalización (i18n)

Añadir las siguientes claves a las **5** traducciones (`messages/en.json`, `es.json`, `fr.json`, `de.json`, `it.json`):

```json
{
  "planning": {
    "addRecipe": "Add recipe",
    "addAnotherRecipe": "Add another recipe",
    "removeRecipe": "Remove recipe",
    "clearSlot": "Clear slot",
    "slotFull": "Slot is full ({max} recipes max)",
    "noAvailableRecipes": "All your recipes are already in this slot",
    "confirmClearSlotTitle": "Clear all recipes?",
    "confirmClearSlotMessage": "This will remove all {count} recipes from this slot.",
    "confirmClearSlotConfirm": "Clear",
    "confirmClearSlotCancel": "Cancel"
  },
  "settings": {
    "title": "Settings",
    "planning": {
      "title": "Planning preferences",
      "slotsPerDay": "Meals per day",
      "slotsPerDayHelp": "Applies to weeks you plan from now on. Already-saved weeks keep their configuration.",
      "save": "Save",
      "saved": "Saved",
      "rangeError": "Must be between 1 and 6"
    }
  },
  "errors": {
    "slotFull": "Slot is full",
    "recipeDuplicate": "Recipe is already in this slot",
    "slotOutOfRange": "This slot is no longer available"
  }
}
```

> Las traducciones a `es`, `fr`, `de`, `it` deben ser hechas en línea — si el implementador no domina las 5 lenguas, mantener `en` como fallback en las otras claves nuevas y dejar issue para revisión nativa.

---

## 9. Flujos UX detallados (para verificación manual)

### Flujo 1 — Slot vacío → 1 receta
1. Usuario navega a Planning, semana actual.
2. Lunes, slot 1 está vacío (placeholder con botón "Añadir receta").
3. Click en el placeholder → abre `RecipePickerModal`.
4. Modal lista todas las recetas del usuario, ninguna excluida.
5. Click en una receta.
6. Modal cierra. SlotCard ahora muestra un chip con el título de la receta + botón "+" para añadir más.
7. Verificar request: `POST /weekly-plannings/{id}/slots/MONDAY/1/recipes` con `{ recipeId }`.

### Flujo 2 — Añadir 2ª receta a un slot que ya tiene 1
1. Slot con 1 chip ("Arroz blanco").
2. Click en "+".
3. Modal abre, **filtra "Arroz blanco"** del listado.
4. Click en "Curry".
5. Modal cierra. SlotCard muestra ahora 2 chips: "Arroz blanco" + "Curry" (en ese orden, por `position`).
6. Botón "+" sigue visible (3 espacios libres aún).

### Flujo 3 — Slot lleno (5 recetas)
1. Repetir flujo 2 hasta llegar a 5 chips.
2. Botón "+" desaparece (o queda deshabilitado con tooltip "slot lleno").
3. Si se intenta forzar (caso edge: optimistic update fallido) → toast de error con i18n `errors.slotFull`.

### Flujo 4 — Eliminar 1 receta de slot con varias
1. Slot con 3 chips.
2. Click en "X" de la 2ª receta.
3. Optimistic update: la 2ª desaparece. Quedan 2 chips.
4. Request: `DELETE /weekly-plannings/{id}/slots/MONDAY/1/recipes/{recipeId}` → 204.
5. No re-fetch immediate; on settled invalida la query.

### Flujo 5 — Eliminar la última receta del slot
1. Slot con 1 chip.
2. Click en "X" del único chip.
3. Optimistic update: el chip desaparece. SlotCard vuelve al estado vacío con botón "Añadir receta" — **el slot sigue ahí**, no desaparece visualmente (porque es uno de los `slotsPerDay`).
4. Request: `DELETE /slots/.../recipes/{recipeId}` → 204.

### Flujo 6 — Vaciar slot completo (papelera)
1. Slot con 3 chips.
2. Click en papelera → `AlertDialog` "Clear all 3 recipes?".
3. Confirmar → request `DELETE /weekly-plannings/{id}/slots/MONDAY/1` → 204. Slot vacío.
4. Si el slot tenía solo 1 receta, no aparece el AlertDialog: borra directamente.

### Flujo 7 — Cambiar `slotsPerDay`
1. Usuario va a Settings.
2. Cambia "Meals per day" de 3 a 5.
3. Click "Save" → toast "Saved".
4. Vuelve al dashboard / Planning. La semana actual sigue mostrando 3 columnas de slots **si ya tenía planning**. Si no tenía planning, ahora muestra 5.
5. Navegar con la flecha a la siguiente semana sin planificar → muestra 5 slots.
6. Crear primer slot en la siguiente semana → al volver, sigue 5 slots (snapshot del backend).

### Flujo 8 — Reducir `slotsPerDay` con datos en slots > nuevo límite
1. Usuario tiene `slotsPerDay = 5`. Plannificó la semana actual con receta en slot 4.
2. Va a Settings → cambia a 3 → Save.
3. Vuelve a Planning, semana actual: sigue mostrando 5 slots (porque `planning.slotsPerDay = 5`, snapshot). Nada se pierde.
4. Va a la siguiente semana sin planificar → muestra 3.

### Flujo 9 — Día pasado (read-only)
1. Navegar a una semana pasada o ver el lunes ya pasado de la semana actual.
2. SlotCards no permiten añadir/eliminar. Botones ocultos o deshabilitados.
3. La X de cada chip **no se muestra** (consistente con la restricción `isPast`).

### Flujo 10 — Crear receta nueva desde el modal
1. En el `RecipePickerModal`, click "Crear nueva receta".
2. Abre el modal de creación de receta (flujo existente).
3. Al guardar, la receta se asigna al slot pendiente (callback `onCreated`). Esta lógica existe ya — **mantenerla** apuntando al nuevo flujo `addRecipeToSlot`.

---

## 10. Edge cases UI

| # | Caso | Comportamiento esperado |
|---|------|-------------------------|
| 1 | Servidor rechaza POST con 409 `RECIPE_DUPLICATE` | Rollback optimistic + toast con `errors.recipeDuplicate`. No debería pasar si el filtro del modal funciona, pero se respeta como red de seguridad. |
| 2 | Servidor rechaza POST con 400 `SLOT_FULL` | Rollback + toast `errors.slotFull`. Mismo razonamiento. |
| 3 | Servidor rechaza POST con 400 `SLOT_OUT_OF_RANGE` | Rollback + toast `errors.slotOutOfRange`. Pasaría si el frontend renderizó más slots que el backend acepta — bug nuestro. |
| 4 | `user` aún no cargado al renderizar PlanningTab | Mostrar 3 slots como fallback temporal. Re-render cuando el usuario llega. |
| 5 | `planning` aún cargando, pero `user` ya disponible | Renderizar `user.slotsPerDay` como esperado. Mostrar skeletons en SlotCards. |
| 6 | Cambio de semana mientras hay un `pendingSlot` abierto | Cerrar el modal (limpiar `pendingSlot`) al cambiar de semana. |
| 7 | El usuario abre el modal, alguien añade una receta en otra pestaña | Optimistic update del POST puede chocar; al settled, invalidate refresca el estado real. Aceptable. |
| 8 | Receta eliminada del catálogo aparece todavía en planning (race) | Backend la quita por cascade. Frontend la verá desaparecer al re-fetch. Aceptable. |
| 9 | `slotsPerDay` del backend devuelve fuera de [1, 6] | Confiar en el backend. Si el backend tiene bug y devuelve 10, renderizamos 10 slots — el bug es del backend. No re-validar en frontend. |
| 10 | Modal de picker con 0 recetas disponibles tras filtro | Mostrar mensaje + botón "Crear nueva". |
| 11 | Concurrencia: el usuario hace doble click rápido en "+" o en una receta del modal | Disable button durante mutation pendiente para evitar doble POST. |
| 12 | Cambiar slotsPerDay mientras hay planning de la semana actual visible | El snapshot del planning manda. La semana actual no se altera visualmente. Solo afecta a semanas sin planning todavía. |

---

## 11. Out of scope (NO implementar)

- Drag & drop para reordenar recetas dentro del slot.
- Nombrar slots semánticamente ("Desayuno", etc.).
- Multi-select en el modal de picker (añadir varias recetas en un solo paso).
- Cantidades por receta dentro del slot.
- Edición del `slotsPerDay` por planning concreto (es snapshot inmutable).
- Compartir plannings entre usuarios.
- Confirmación al eliminar una receta concreta (X del chip). Solo se confirma el "clear all" (papelera) cuando hay 2+ recetas.
- Cambios en la lógica del shopping list más allá del cambio de `slot.recipe` → `slot.recipes`.

---

## 12. Preguntas abiertas para el implementador

Si surgen durante la implementación, anotar y consultar antes de cerrar:

1. **Settings: tab vs ruta**: el repo no parece tener una sección de "settings" todavía. ¿Tab dentro del dashboard (consistente con "Planning" / "Recipes") o ruta `/[locale]/settings` separada? **Decisión propuesta**: tab dentro del dashboard, llamado "Settings" o "Ajustes". Confirmar con diseño/producto si hay duda.
2. **Endpoint de update profile**: ¿existe `PATCH /users/me` o es `PATCH /users/:id`? Coordinar con el spec del backend.
3. **Botón lápiz de SlotCard**: confirmar que se elimina (la edición es directa por chips). Si el diseño del producto prefiere mantenerlo y abrir un modal "edición masiva", reconsiderar.
4. **Confirmación al borrar 1 chip individual**: la decisión actual es **no confirmar** porque es de bajo riesgo y reversible (re-añadir). Si UX lo pide, añadir.
5. **`useShoppongList` typo**: corregir a `useShoppingList` queda fuera de alcance — abrir issue.
6. **Estilo de los chips**: usar `Badge` de shadcn con `X` propio, o componente custom. Decisión del implementador con criterio de diseño existente.
7. **Loading state durante optimistic update**: ¿mostrar el chip "fantasma" semi-transparente o como sólido? Decisión del implementador. Sólido + fade-in al settled es la opción más simple.
