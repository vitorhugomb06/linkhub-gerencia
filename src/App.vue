<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="app-sidebar">
      <div class="sidebar-logo">
        <div class="topbar-logo-icon">
          <i class="pi pi-link" style="color:#fff;font-size:16px"></i>
        </div>
      </div>

      <router-link
        v-for="item in navItems"
        :key="item.path"
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

      <div style="flex:1"></div>

      <div class="sidebar-nav-item" title="Configurações">
        <i class="pi pi-cog"></i>
      </div>
      <div class="sidebar-nav-item" title="Suporte">
        <i class="pi pi-question-circle"></i>
      </div>
    </aside>

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
          <div class="topbar-env-selector">
            <div class="env-badge">
              <i class="pi pi-circle-fill" style="color:#4ade80;font-size:8px"></i>
              Homologação
            </div>
            <div class="env-badge">
              <i class="pi pi-circle-fill" style="color:#4ade80;font-size:8px"></i>
              Homologação
              <i class="pi pi-chevron-down" style="font-size:10px;margin-left:4px"></i>
            </div>
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
          <div class="topbar-user">
            <span class="topbar-user-name">Vitor Hugo Martins</span>
            <div class="topbar-user-avatar">V</div>
          </div>
        </div>
      </header>

      <!-- Router view with breadcrumb injected per page -->
      <router-view />
    </div>
  </div>

  <NotificationPanel />
  <Toast position="top-right" />
  <ConfirmDialog />
</template>

<script setup>
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import NotificationPanel from './components/notifications/NotificationPanel.vue'
import { useNotifications } from './composables/useNotifications'

const { togglePanel, unreadCount } = useNotifications()

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'pi pi-home' },
  { path: '/analytics', label: 'Analytics', icon: 'pi pi-chart-bar' },
  { path: '/relatorios', label: 'Relatórios', icon: 'pi pi-chart-line' },
  { path: '/sincronizacao', label: 'Sincronização', icon: 'pi pi-sync' },
  { path: '/produtos', label: 'Produtos', icon: 'pi pi-box' },
  { path: '/produtos/estoque', label: 'Estoque (demo)', icon: 'pi pi-warehouse' },
  { path: '/pedidos', label: 'Pedidos', icon: 'pi pi-shopping-cart' },
  { path: '/etiquetas', label: 'Etiquetas', icon: 'pi pi-tag' },
  { path: '/configuracoes-logisticas', label: 'Config. Logísticas', icon: 'pi pi-truck' },
  { path: '/pedido-detalhe', label: 'Detalhe Pedido (demo)', icon: 'pi pi-file-edit' },
  { path: '/clientes', label: 'Clientes', icon: 'pi pi-users' },
  { path: '/configuracoes', label: 'Configurações', icon: 'pi pi-sliders-h' },
  { path: '/integracao', label: 'Integração', icon: 'pi pi-share-alt' },
]
</script>
