<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="app-sidebar">
      <div class="sidebar-logo">
        <div class="topbar-logo-icon">
          <i class="pi pi-link" style="color:#fff;font-size:16px"></i>
        </div>
      </div>

      <template v-for="item in navItems" :key="item.path">
        <!-- Item com sub-menu -->
        <div
          v-if="item.children"
          class="sidebar-nav-item-wrap"
          @mouseenter="onItemEnter($event, item)"
          @mouseleave="onItemLeave"
        >
          <router-link :to="item.path" custom v-slot="{ isActive, navigate }">
            <div
              class="sidebar-nav-item"
              :class="{ active: isActive || isChildActive(item) }"
              @click="navigate"
              :title="item.label"
            >
              <i :class="item.icon"></i>
              <span class="sidebar-nav-item__indicator"></span>
            </div>
          </router-link>
        </div>

        <!-- Item simples (sem sub-menu) -->
        <router-link
          v-else
          :to="item.path"
          custom
          v-slot="{ isActive, navigate }"
        >
          <div
            class="sidebar-nav-item"
            :class="{ active: isActive }"
            @click="navigate"
            :title="item.label"
          >
            <i :class="item.icon"></i>
          </div>
        </router-link>
      </template>

      <div style="flex:1"></div>

      <div class="sidebar-nav-item" title="Configurações">
        <i class="pi pi-cog"></i>
      </div>
      <div class="sidebar-nav-item" title="Suporte">
        <i class="pi pi-question-circle"></i>
      </div>
    </aside>

    <!-- Submenu flyout (fixed, fora do fluxo da sidebar) -->
    <Transition name="submenu-fade">
      <div
        v-if="activeSubmenu"
        class="sidebar-submenu"
        :style="{ top: submenuTop + 'px', left: submenuLeft + 'px' }"
        @mouseenter="onSubmenuEnter"
        @mouseleave="onSubmenuLeave"
      >
        <div class="sidebar-submenu__title">{{ activeSubmenu.label }}</div>
        <router-link
          v-for="child in activeSubmenu.children"
          :key="child.path"
          :to="child.path"
          custom
          v-slot="{ isActive: isChildRouteActive, navigate: navChild }"
        >
          <div
            class="sidebar-submenu__item"
            :class="{ active: isChildRouteActive }"
            @click="navChild(); activeSubmenu = null"
          >
            <i :class="child.icon" style="font-size:13px"></i>
            <span>{{ child.label }}</span>
          </div>
        </router-link>
      </div>
    </Transition>

    <!-- Main -->
    <div class="app-main">
      <!-- Topbar -->
      <header class="app-topbar">
        <div class="topbar-left">
          <span class="topbar-logo">
            <span style="color:#fff;font-weight:700;font-size:18px;font-family:'Poppins',sans-serif">
              🔗 LinkHub
            </span>
          </span>
        </div>

        <div class="topbar-center">
          <div class="topbar-company-selector">
            <i class="pi pi-desktop" style="font-size:14px;color:#94a3b8"></i>
            <span class="topbar-company-name">Caemmun</span>
            <i class="pi pi-chevron-down" style="font-size:10px;color:#94a3b8"></i>
          </div>
        </div>

        <div class="topbar-right">
          <div class="topbar-icon-btn" title="Buscar">
            <i class="pi pi-search"></i>
          </div>
          <div class="topbar-icon-btn notification-bell" title="Notificações" @click="togglePanel">
            <i class="pi pi-bell"></i>
            <span v-if="unreadCount > 0" class="notification-bell-badge">{{ unreadCount }}</span>
          </div>
          <div class="topbar-divider"></div>
          <div class="topbar-user">
            <span class="topbar-user-name">Vitor Hugo Martins</span>
            <span class="topbar-user-chevron"><i class="pi pi-chevron-down" style="font-size:10px;color:rgba(255,255,255,0.5)"></i></span>
            <div class="topbar-user-avatar">
              <i class="pi pi-user" style="font-size:14px"></i>
            </div>
          </div>
        </div>
      </header>

      <!-- Breadcrumb bar (rendered by each page via teleport) -->
      <div id="breadcrumb-bar" class="app-breadcrumb-bar"></div>

      <!-- Router view -->
      <router-view />
    </div>
  </div>

  <NotificationPanel />
  <Toast position="top-right" />
  <ConfirmDialog />
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import NotificationPanel from './components/notifications/NotificationPanel.vue'
import { useNotifications } from './composables/useNotifications'

const { togglePanel, unreadCount } = useNotifications()
const route = useRoute()

// ── Submenu state ──────────────────────────────────────────────────────────────
const activeSubmenu = ref(null)
const submenuTop = ref(0)
const submenuLeft = ref(0)
let submenuTimeout = null

function onItemEnter(event, item) {
  clearTimeout(submenuTimeout)
  const rect = event.currentTarget.getBoundingClientRect()
  submenuTop.value = rect.top
  submenuLeft.value = rect.right + 6
  activeSubmenu.value = item
}

function onItemLeave() {
  submenuTimeout = setTimeout(() => {
    activeSubmenu.value = null
  }, 250)
}

function onSubmenuEnter() {
  clearTimeout(submenuTimeout)
}

function onSubmenuLeave() {
  submenuTimeout = setTimeout(() => {
    activeSubmenu.value = null
  }, 150)
}

function isChildActive(item) {
  if (!item.children) return false
  return item.children.some(child => route.path === child.path || route.path.startsWith(child.path + '/'))
}

// ── Navigation items (com sub-menus) ───────────────────────────────────────────
const navItems = [
  { path: '/', label: 'Dashboard', icon: 'pi pi-home' },
  { path: '/analytics', label: 'Analytics', icon: 'pi pi-chart-bar' },
  { path: '/relatorios', label: 'Relatórios', icon: 'pi pi-chart-line' },
  { path: '/sincronizacao', label: 'Sincronização', icon: 'pi pi-sync' },
  {
    path: '/produtos',
    label: 'Produtos',
    icon: 'pi pi-box',
    children: [
      { path: '/produtos', label: 'Listagem', icon: 'pi pi-list' },
      { path: '/produtos/estoque', label: 'Estoque', icon: 'pi pi-warehouse' },
      { path: '/produtos/importacoes/de-para-campos', label: 'De-Para de Campos', icon: 'pi pi-arrows-h' },
    ]
  },
  { path: '/pedidos', label: 'Pedidos', icon: 'pi pi-shopping-cart' },
  { path: '/etiquetas', label: 'Etiquetas', icon: 'pi pi-tag' },
  { path: '/configuracoes-logisticas', label: 'Config. Logísticas', icon: 'pi pi-truck' },
  { path: '/pedido-detalhe', label: 'Detalhe Pedido (demo)', icon: 'pi pi-file-edit' },
  { path: '/clientes', label: 'Clientes', icon: 'pi pi-users' },
  { path: '/configuracoes', label: 'Configurações', icon: 'pi pi-sliders-h' },
  { path: '/integracao', label: 'Integração', icon: 'pi pi-share-alt' },
]
</script>
