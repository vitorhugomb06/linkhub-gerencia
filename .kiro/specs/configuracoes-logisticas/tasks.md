# Implementation Plan: Configurações Logísticas por Marketplace

## Overview

Implement the Logistics Settings module for the LinkHub platform. The module allows users to view and configure which logistics modalities are enabled per integrated marketplace. The implementation follows the existing Labels screen visual pattern and uses the project's design system (PrimeVue/Aura, Poppins, CSS vars).

## Tasks

- [x] 1. Create mock data layer (`logisticsMock.js`)
  - Create `src/mocks/logisticsMock.js` with mock `Marketplace[]` data (4–5 marketplaces with `id`, `name`, `logo`, `color`, `logisticsCount`)
  - Create mock `Logistic[]` data with all fields: `id`, `name`, `status` (`'Ativo'`/`'Inativo'`), `enabled`, `minWeight`, `maxWeight`, `height`, `width`, `depth`, `maxCubicVolume`, `minVolume`, `maxVolume`, `description`
  - Include at least one logistic with `status === 'Inativo'` and one marketplace with zero logistics to test edge cases
  - Implement `fetchMarketplaces(): Promise<Marketplace[]>` with ~800ms simulated delay
  - Implement `fetchLogisticsForMarketplace(marketplaceId): Promise<Logistic[]>` with ~800ms simulated delay, returning only logistics for the given marketplace
  - Implement `saveLogisticEnabled(marketplaceId, logisticId, enabled): Promise<void>` with ~600ms simulated delay, persisting `enabled` state in a module-level Map so subsequent fetches reflect the saved value (Req 8.1, 8.2)
  - **Requirements:** 2.1, 3.1, 8.1, 8.2, 10.1, 10.2

- [x] 2. Create `MarketplaceList.vue` component
  - Create `src/components/logistics/MarketplaceList.vue`
  - Accept props: `marketplaces: Array`, `selectedMarketplace: Object|null`, `loading: Boolean`
  - Emit `select` event with the clicked marketplace object
  - Render 5-line Skeleton placeholder while `loading === true` (Req 2.2, 9.1)
  - Render empty-state with icon `pi pi-store`, title "Nenhum marketplace" and descriptive text when `marketplaces` is empty and `loading === false` (Req 2.4)
  - Render each marketplace as a clickable item using `.carrier-item` / `.carrier-item.active` CSS classes, showing color icon, name, and `logisticsCount` badge (Req 2.3, 10.3)
  - Apply `.active` class to the item matching `selectedMarketplace.id` (Req 3.1)
  - **Requirements:** 2.2, 2.3, 2.4, 3.1, 9.1, 10.3

- [x] 3. Create `LogisticItem.vue` component
  - Create `src/components/logistics/LogisticItem.vue`
  - Accept props: `logistic: Object`, `saving: Boolean`
  - Emit `toggle` event with `{ logisticId, enabled }` payload
  - Manage `expanded` state locally with `ref(false)`; clicking the header row toggles `expanded` independently of other items (Req 5.1)
  - Render header (always visible): name, ID (muted text), status Tag (severity `'success'` for `'Ativo'`, `'secondary'` for `'Inativo'`), expand chevron icon, and InputSwitch (Req 4.1, 4.2)
  - Bind InputSwitch to a local `localEnabled` ref synced from `logistic.enabled`; emit `toggle` on change only when `logistic.status === 'Ativo'` (Req 6.1)
  - Disable InputSwitch and apply `opacity: 0.5` to the entire item when `logistic.status === 'Inativo'` (Req 7.1, 7.2)
  - Attach `v-tooltip.top` directive to the switch wrapper with text "Esta logística está inativa no marketplace e não pode ser configurada." when `logistic.status === 'Inativo'` (Req 7.3)
  - Also disable InputSwitch while `saving === true` (Req 6.4, 9.2)
  - Render expanded detail section (hidden when `expanded === false`) with all 9 fields: Peso Mínimo, Peso Máximo, Altura, Largura, Profundidade, Cubagem Máxima, Volume Mínimo, Volume Máximo, Descrição; display `—` for null/undefined values (Req 5.2, 5.3)
  - **Requirements:** 4.1, 4.2, 5.1, 5.2, 5.3, 6.1, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5, 9.2

- [x] 4. Create `LogisticPanel.vue` component
  - Create `src/components/logistics/LogisticPanel.vue`
  - Accept props: `marketplace: Object|null`, `logistics: Array`, `loading: Boolean`, `savingId: String|null`
  - Emit `toggle` event forwarding `{ logisticId, enabled }` from child `LogisticItem`
  - Render "select a marketplace" empty-state (icon `pi pi-arrow-left`, instructional text) when `marketplace === null` and `loading === false` (Req 3.6)
  - Render Skeleton placeholder (4 rows) while `loading === true` (Req 3.2, 9.1)
  - Render empty-state (icon `pi pi-inbox`, message about no logistics for this marketplace) when `logistics` is empty and `loading === false` and `marketplace !== null` (Req 3.4)
  - Render a `LogisticItem` for each item in `logistics`, passing `saving` as `savingId === logistic.id` (Req 3.3, 10.4)
  - Show panel title including selected marketplace name (Req 3.3)
  - **Requirements:** 3.2, 3.3, 3.4, 3.6, 9.1, 10.4

- [x] 5. Create `LogisticSettingsPage.vue` page component
  - Create `src/pages/LogisticSettingsPage.vue`
  - Render breadcrumb (`app-breadcrumb`) with "Home > Configurações Logísticas" (Req 1.3)
  - Render page header (`page-header`) with title "Configurações Logísticas" (icon `pi pi-truck`) and "Atualizar" button (Req 2.5 recovery)
  - Render `split-layout` div containing `MarketplaceList` (left) and `LogisticPanel` (right) (Req 1.2)
  - On `onMounted`, call `fetchMarketplaces()` and populate `marketplaces` ref; show loading skeleton; handle error with Toast (Req 2.1, 2.5, 9.1)
  - Implement `onSelectMarketplace(marketplace)`: set `selectedMarketplace`, clear `logistics`, call `fetchLogisticsForMarketplace()`; handle error with Toast (Req 3.1, 3.5)
  - Implement `onToggleLogistic({ logisticId, enabled })`: guard against inactive status; apply optimistic update; call `saveLogisticEnabled()`; show success Toast on resolve; rollback and show error Toast on reject; manage `savingId` (Req 6.1, 6.2, 6.3, 7.4, 8.1)
  - Implement `refresh()` function for the "Atualizar" button: reset state and re-call `fetchMarketplaces()` (Req 2.5 recovery)
  - **Requirements:** 1.2, 1.3, 2.1, 2.5, 3.1, 3.5, 6.1, 6.2, 6.3, 7.4, 8.1, 9.1, 9.3

- [x] 6. Register route and sidebar navigation
  - In `src/main.js`: import `LogisticSettingsPage` and add route `{ path: '/configuracoes-logisticas', component: LogisticSettingsPage }` (Req 1.1)
  - In `src/App.vue`: add `{ path: '/configuracoes-logisticas', label: 'Config. Logísticas', icon: 'pi pi-truck' }` to the `navItems` array (Req 1.1)
  - Verify the sidebar item is visible and navigates correctly to the new page
  - **Requirements:** 1.1

- [x] 7. Register `Tooltip` directive in PrimeVue
  - In `src/main.js`: import `Tooltip` from `primevue/tooltip` and register it as a global directive with `app.directive('tooltip', Tooltip)` so `v-tooltip` works in `LogisticItem.vue`
  - Verify tooltip appears on hover over disabled switches for inactive logistics (Req 7.3)
  - **Requirements:** 7.3

- [x] 8. Add CSS for logistics module
  - In `src/assets/main.css`: add `.logistic-item` card styles (border, border-radius, padding, hover shadow — matching `.group-card` pattern)
  - Add `.logistic-item--inactive` modifier class that sets `opacity: 0.5` and `cursor: not-allowed` on the switch wrapper
  - Add `.logistic-detail-grid` for the expanded section: 3-column responsive grid for the dimension fields
  - Add `.logistic-meta-label` and `.logistic-meta-value` (can reuse `.group-meta-label`/`.group-meta-value` pattern)
  - **Requirements:** 7.1, 7.2, 5.2

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "7", "8"] },
    { "wave": 2, "tasks": ["2", "3"] },
    { "wave": 3, "tasks": ["4"] },
    { "wave": 4, "tasks": ["5"] },
    { "wave": 5, "tasks": ["6"] }
  ]
}
```

- Task 1 (mock), Task 7 (tooltip directive) and Task 8 (CSS) can start simultaneously.
- Tasks 2 (MarketplaceList) and 3 (LogisticItem) depend on Task 1 and can run in parallel.
- Task 4 (LogisticPanel) depends on Task 3.
- Task 5 (LogisticSettingsPage) depends on Tasks 2 and 4.
- Task 6 (route + sidebar) depends on Task 5.

## Notes

- All components follow the existing `CarrierList.vue` / `ReadyToPrintGroups.vue` visual pattern from the Labels module. Reuse `.carrier-item`, `.group-card`, `.empty-state`, `.panel-header`, `.split-layout` CSS classes from `main.css`.
- The mock layer (`logisticsMock.js`) uses a module-level `Map` to simulate persistence across calls in the same browser session, matching the pattern in `labelsMock.js`.
- `InputSwitch` (PrimeVue) requires `v-model` bound to a local ref; emit the `toggle` event in the `@update:modelValue` or `@change` handler, not directly on the model.
- The `v-tooltip` directive must be registered globally before it can be used in any component. This is done in Task 7 before verifying Task 3.
- No new npm dependencies are required — all PrimeVue components used (`InputSwitch`, `Tag`, `Badge`, `Skeleton`, `Tooltip`, `Button`, `Divider`) are already installed.
- When implementing the optimistic update + rollback pattern in Task 5, store the previous value before mutating so it can be restored without reloading from the mock.
