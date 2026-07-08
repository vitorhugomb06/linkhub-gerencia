<template>
  <Transition name="notification-overlay">
    <div v-if="isPanelOpen" class="notification-overlay" @click.self="closePanel"></div>
  </Transition>

  <Transition name="notification-panel">
    <aside v-if="isPanelOpen" class="notification-panel">
      <!-- Header -->
      <div class="notification-panel-header">
        <div class="notification-panel-title-row">
          <div class="notification-panel-title-group">
            <h2 class="notification-panel-title">
              Notificações
              <span v-if="unreadCount > 0" class="notification-title-badge">{{ unreadCount }}</span>
            </h2>
            <p class="notification-panel-subtitle">
              <template v-if="unreadCount > 0">
                Você possui <strong>{{ unreadCount }}</strong> {{ unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas' }}
              </template>
              <template v-else>
                Tudo em dia — nenhuma pendência
              </template>
            </p>
          </div>
          <button class="notification-close-btn" @click="closePanel">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Status filter + actions -->
        <div class="notification-toolbar">
          <div class="notification-status-tabs">
            <button
              class="notification-status-tab"
              :class="{ active: statusFilter === 'all' }"
              @click="statusFilter = 'all'"
            >
              Todas
              <span class="status-count">{{ notifications.length }}</span>
            </button>
            <button
              class="notification-status-tab"
              :class="{ active: statusFilter === 'unread' }"
              @click="statusFilter = 'unread'"
            >
              Não lidas
              <span class="status-count">{{ unreadCount }}</span>
            </button>
          </div>
        </div>

        <!-- Category chips -->
        <div class="notification-chips">
          <button
            v-for="cat in categoriesWithCount"
            :key="cat.key"
            class="notification-chip"
            :class="{ active: categoryFilter === cat.key }"
            :style="categoryFilter === cat.key ? { backgroundColor: cat.color + '18', color: cat.color, borderColor: cat.color } : {}"
            @click="categoryFilter = categoryFilter === cat.key ? 'all' : cat.key"
          >
            <i :class="cat.icon"></i>
            <span class="chip-label">{{ cat.label }}</span>
            <span
              class="chip-count"
              :style="categoryFilter === cat.key ? { backgroundColor: cat.color, color: '#ffffff' } : {}"
            >{{ cat.count }}</span>
          </button>
        </div>
      </div>

      <!-- Notification list -->
      <div class="notification-list">
        <!-- Ações pendentes -->
        <div v-if="pendingActions.length > 0" class="notification-pending-section">
          <div class="notification-pending-header">
            <i class="pi pi-exclamation-circle"></i>
            <span>Ações pendentes</span>
            <span class="notification-pending-count">{{ pendingActions.length }}</span>
          </div>

          <TransitionGroup name="notification-item">
            <div
              v-for="notification in pendingActions"
              :key="notification.id"
              class="notification-card pending"
              :class="{ unread: !notification.read, read: notification.read }"
              :style="{ '--accent-color': getNotificationColor(notification.type), '--card-bg': getNotificationBg(notification.type) }"
              @click="markAsRead(notification.id)"
            >
              <!-- Card header row -->
              <div class="notification-card-header">
                <div class="notification-card-icon" :style="{ backgroundColor: getNotificationColor(notification.type) + '22', color: getNotificationColor(notification.type) }">
                  <i :class="getNotificationIcon(notification.type)"></i>
                </div>
                <span class="notification-card-title">{{ notification.title }}</span>
                <span
                  class="notification-card-badge"
                  :style="{ color: getNotificationBadge(notification.type).color, backgroundColor: getNotificationBadge(notification.type).bg }"
                >
                  {{ getNotificationBadge(notification.type).label }}
                </span>
                <span class="notification-card-time">{{ formatTimestamp(notification.timestamp) }}</span>
                <span
                  class="notification-priority-indicator"
                  :style="{ color: getNotificationPriority(notification.type).color, backgroundColor: getNotificationPriority(notification.type).bg }"
                  :title="getNotificationPriority(notification.type).label"
                >
                  <i :class="getNotificationPriority(notification.type).icon"></i>
                </span>
                <span v-if="!notification.read" class="notification-unread-dot"></span>
                <div class="notification-quick-actions" @click.stop>
                  <button
                    v-if="!notification.read"
                    class="notification-quick-btn"
                    @click="markAsRead(notification.id)"
                    title="Marcar como lida"
                  >
                    <i class="pi pi-check-circle"></i>
                  </button>
                  <button
                    class="notification-quick-btn delete"
                    @click="removeNotification(notification.id)"
                    title="Excluir"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </div>

              <p class="notification-card-message">{{ notification.message }}</p>

              <div v-if="notification.actions.length > 0" class="notification-card-actions">
                <button
                  v-for="action in notification.actions"
                  :key="action.action"
                  class="notification-action-btn"
                  :class="action.style"
                  @click.stop="handleAction(notification, action.action)"
                >
                  <i v-if="action.icon" :class="action.icon"></i>
                  {{ action.label }}
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Timeline -->
        <template v-if="groupedNotifications.length > 0">
          <div v-for="group in groupedNotifications" :key="group.label" class="notification-group">
            <div class="notification-group-label">{{ group.label }}</div>

            <TransitionGroup name="notification-item">
              <div
                v-for="notification in group.items"
                :key="notification.id"
                class="notification-card"
                :class="{ unread: !notification.read, read: notification.read }"
                :style="{ '--accent-color': getNotificationColor(notification.type), '--card-bg': getNotificationBg(notification.type) }"
                @click="markAsRead(notification.id)"
              >
                <!-- Card header row -->
                <div class="notification-card-header">
                  <div class="notification-card-icon" :style="{ backgroundColor: getNotificationColor(notification.type) + '22', color: getNotificationColor(notification.type) }">
                    <i :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <span class="notification-card-title">{{ notification.title }}</span>
                  <span
                    class="notification-card-badge"
                    :style="{ color: getNotificationBadge(notification.type).color, backgroundColor: getNotificationBadge(notification.type).bg }"
                  >
                    {{ getNotificationBadge(notification.type).label }}
                  </span>
                  <span class="notification-card-time">{{ formatTimestamp(notification.timestamp) }}</span>
                  <span
                    class="notification-priority-indicator"
                    :style="{ color: getNotificationPriority(notification.type).color, backgroundColor: getNotificationPriority(notification.type).bg }"
                    :title="getNotificationPriority(notification.type).label"
                  >
                    <i :class="getNotificationPriority(notification.type).icon"></i>
                  </span>
                  <span v-if="!notification.read" class="notification-unread-dot"></span>
                  <div class="notification-quick-actions" @click.stop>
                    <button
                      v-if="!notification.read"
                      class="notification-quick-btn"
                      @click="markAsRead(notification.id)"
                      title="Marcar como lida"
                    >
                      <i class="pi pi-check-circle"></i>
                    </button>
                    <button
                      class="notification-quick-btn delete"
                      @click="removeNotification(notification.id)"
                      title="Excluir"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </div>

                <!-- Message -->
                <p class="notification-card-message">{{ notification.message }}</p>

                <!-- Action buttons -->
                <div v-if="notification.actions.length > 0" class="notification-card-actions">
                  <button
                    v-for="action in notification.actions"
                    :key="action.action"
                    class="notification-action-btn"
                    :class="action.style"
                    @click.stop="handleAction(notification, action.action)"
                  >
                    <i v-if="action.icon" :class="action.icon"></i>
                    {{ action.label }}
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </template>

        <!-- Empty state -->
        <div v-if="filteredNotifications.length === 0" class="notification-empty">
          <div class="notification-empty-icon">
            <i class="pi pi-bell-slash"></i>
          </div>
          <span class="notification-empty-title">
            {{ statusFilter === 'unread' ? 'Tudo em dia!' : 'Nenhuma notificação' }}
          </span>
          <span class="notification-empty-desc">
            {{ emptyMessage }}
          </span>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="notifications.length > 0" class="notification-panel-footer">
        <button
          class="notification-footer-btn"
          @click="markAllAsRead"
          :disabled="unreadCount === 0"
        >
          <i class="pi pi-check-circle"></i>
          Marcar todas como lidas
        </button>
        <button class="notification-footer-btn danger" @click="clearAll">
          <i class="pi pi-trash"></i>
          Limpar tudo
        </button>
      </div>
    </aside>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNotifications } from '../../composables/useNotifications'

const {
  notifications,
  isPanelOpen,
  unreadCount,
  closePanel,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll,
  handleAction,
  requiresAction,
  getNotificationPriority,
  getNotificationBadge,
  getNotificationBg,
  getNotificationIcon,
  getNotificationColor,
  getNotificationCategory,
  formatTimestamp,
  getDateGroup
} = useNotifications()

const statusFilter = ref('all')
const categoryFilter = ref('all')

const categories = [
  { key: 'invites', label: 'Convites', icon: 'pi pi-user-plus', color: '#ef4444' },
  { key: 'exports', label: 'Exportações', icon: 'pi pi-file-excel', color: '#3b82f6' },
  { key: 'imports', label: 'Importações', icon: 'pi pi-cloud-upload', color: '#14b8a6' },
  { key: 'system', label: 'Sistema', icon: 'pi pi-cog', color: '#64748b' }
]

// Conta notificações por categoria, respeitando o filtro de status ativo
const categoriesWithCount = computed(() => {
  const base = statusFilter.value === 'unread'
    ? notifications.value.filter(n => !n.read)
    : notifications.value

  return categories.map(cat => ({
    ...cat,
    count: base.filter(n => getNotificationCategory(n.type) === cat.key).length
  }))
})

const filteredNotifications = computed(() => {
  return notifications.value.filter(n => {
    const statusOk = statusFilter.value === 'all' || !n.read
    const categoryOk = categoryFilter.value === 'all' || getNotificationCategory(n.type) === categoryFilter.value
    return statusOk && categoryOk
  })
})

// Ações pendentes — notificações que exigem ação do usuário
const pendingActions = computed(() => {
  return filteredNotifications.value.filter(n => requiresAction(n.type) && !n.read)
})

// Informativas — o restante que vai na timeline
const timelineNotifications = computed(() => {
  return filteredNotifications.value.filter(n => !requiresAction(n.type) || n.read)
})

const groupedNotifications = computed(() => {
  const order = ['Hoje', 'Ontem', 'Esta semana', 'Mais antigas']
  const groups = {}

  timelineNotifications.value.forEach(n => {
    const label = getDateGroup(n.timestamp)
    if (!groups[label]) groups[label] = []
    groups[label].push(n)
  })

  return order
    .filter(label => groups[label])
    .map(label => ({ label, items: groups[label] }))
})

const emptyMessage = computed(() => {
  if (statusFilter.value === 'unread') return 'Você não tem notificações não lidas.'
  if (categoryFilter.value !== 'all') return 'Nenhuma notificação nesta categoria.'
  return 'Suas notificações aparecerão aqui.'
})
</script>

<style scoped>
/* Overlay */
.notification-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

/* Panel - fundo branco (tema claro) */
.notification-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 580px;
  max-width: 100vw;
  height: 100vh;
  background: #f7f8fc;
  box-shadow: -4px 0 40px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.notification-panel-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: #ffffff;
}

.notification-panel-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.notification-panel-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.2px;
  margin: 0;
}

.notification-panel-subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
  font-weight: 400;
}

.notification-panel-subtitle strong {
  color: #6366f1;
  font-weight: 600;
}

.notification-title-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  letter-spacing: 0;
  min-width: 20px;
  text-align: center;
}

.notification-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f1f5f9;
  border-radius: 10px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.notification-close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

/* Toolbar - status tabs + mark read */
.notification-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.notification-status-tabs {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  flex: 1;
}

.notification-status-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Poppins', sans-serif;
}

.notification-status-tab:hover {
  color: #1e293b;
}

.notification-status-tab.active {
  background: #ffffff;
  color: #6366f1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-count {
  font-size: 10px;
  font-weight: 600;
  background: #e2e8f0;
  color: #64748b;
  padding: 1px 6px;
  border-radius: 8px;
  min-width: 18px;
}

.notification-status-tab.active .status-count {
  background: #ede9fe;
  color: #6366f1;
}

/* Category chips */
.notification-chips {
  display: flex;
  gap: 6px;
  padding-bottom: 4px;
}

.notification-chip {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e8ecf2;
  background: #ffffff;
  border-radius: 24px;
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  font-family: 'Poppins', sans-serif;
}

.notification-chip:hover {
  background: #f8fafc;
  color: #1e293b;
  border-color: #cbd5e1;
}

.notification-chip.active {
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.12);
}

.notification-chip i {
  font-size: 12px;
}

.chip-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.chip-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #f1f5f9;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  transition: all 0.2s;
}

.notification-chip:hover .chip-count {
  background: #e2e8f0;
  color: #64748b;
}

/* Notification list */
.notification-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  background: #f7f8fc;
}

/* Group */
.notification-group {
  margin-bottom: 8px;
}

.notification-group-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: #94a3b8;
  padding: 12px 4px 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-group-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(0, 0, 0, 0.04);
}

/* Pending actions section */
.notification-pending-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.06);
}

.notification-pending-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
}

.notification-pending-header i {
  font-size: 14px;
}

.notification-pending-count {
  background: #fef2f2;
  color: #dc2626;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 8px;
}

.notification-card.pending {
  border-left-width: 4px;
}

/* Notification card */
.notification-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 4px solid var(--accent-color);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 4px rgba(0, 0, 0, 0.02);
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1),
              border-color 200ms cubic-bezier(0.4, 0, 0.2, 1),
              background 300ms ease,
              opacity 400ms ease;
}

.notification-card:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.3);
  border-left-color: var(--accent-color);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.06), 0 4px 12px rgba(0, 0, 0, 0.03);
}

.notification-card:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition-duration: 100ms;
}

.notification-card.unread {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.notification-card.unread:hover {
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);
}

/* Lidas: fundo acinzentado e menor contraste */
.notification-card.read {
  background: #f1f5f9;
  border-color: #e2e8f0;
  box-shadow: none;
  opacity: 0.82;
}

.notification-card.read:hover {
  opacity: 1;
  background: #eef2f6;
  transform: translateY(-2px);
  border-color: #6366f1;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
}

.notification-card.read .notification-card-title {
  color: #475569;
}

.notification-card.read .notification-card-message {
  color: #64748b;
}

/* Card header */
.notification-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.notification-card-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.notification-card-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.notification-card-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2px;
  white-space: nowrap;
  flex-shrink: 0;
}

.notification-unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  flex-shrink: 0;
}

.notification-card-close {
  display: none;
}

/* Quick action buttons (1 click) */
.notification-quick-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
}

.notification-card:hover .notification-quick-actions {
  opacity: 1;
}

.notification-quick-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  color: #94a3b8;
  font-size: 14px;
  transition: all 0.2s;
}

.notification-quick-btn:hover {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
  transform: scale(1.1);
}

.notification-quick-btn.delete:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

/* Message */
.notification-card-message {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 16px 0;
  padding-left: 60px;
  font-weight: 400;
}

/* Action buttons */
.notification-card-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding-left: 60px;
  flex-wrap: wrap;
}

.notification-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Poppins', sans-serif;
}

/* Ação principal — preenchido, destacado */
.notification-action-btn.primary {
  background: #6366f1;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
}

.notification-action-btn.primary:hover {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.notification-action-btn.primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(99, 102, 241, 0.2);
}

.notification-action-btn.success {
  background: #10b981;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.notification-action-btn.success:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
}

.notification-action-btn.success:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(16, 185, 129, 0.2);
}

/* Ação secundária — outline / link */
.notification-action-btn.secondary {
  background: transparent;
  color: #6366f1;
  border: 1px solid #e2e8f0;
  font-weight: 500;
}

.notification-action-btn.secondary:hover {
  background: #f5f3ff;
  border-color: #c7d2fe;
  color: #4f46e5;
}

/* Ação de perigo — outline vermelho */
.notification-action-btn.danger {
  background: transparent;
  color: #ef4444;
  border: 1px solid #fecaca;
  font-weight: 500;
}

.notification-action-btn.danger:hover {
  background: #fef2f2;
  border-color: #ef4444;
}

.notification-action-btn i {
  font-size: 12px;
}

/* Timestamp */
.notification-card-time {
  font-size: 11px;
  color: #b0bec5;
  font-weight: 400;
  white-space: nowrap;
  flex-shrink: 0;
}

.notification-card-time i {
  font-size: 10px;
}

/* Priority indicator */
.notification-priority-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  flex-shrink: 0;
}

.notification-priority-indicator i {
  font-size: 12px;
}

/* Empty state */
.notification-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  gap: 16px;
}

.notification-empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #a5b4fc;
}

.notification-empty-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.notification-empty-desc {
  font-size: 12px;
  color: #94a3b8;
}

/* Footer */
.notification-panel-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-footer-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid #e8ecf2;
  background: #ffffff;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: #6366f1;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Poppins', sans-serif;
}

.notification-footer-btn:hover:not(:disabled) {
  background: #eef2ff;
  border-color: #c7d2fe;
}

.notification-footer-btn:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.6;
}

.notification-footer-btn.danger {
  color: #94a3b8;
}

.notification-footer-btn.danger:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #ef4444;
}

.notification-footer-btn i {
  font-size: 13px;
}

/* ═══════════════════════════════════════════════════════
   ANIMATIONS — Fade + Slide, entrada, lida, remoção
   ═══════════════════════════════════════════════════════ */

/* Overlay — Fade suave */
.notification-overlay-enter-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-overlay-leave-active {
  transition: opacity 0.2s ease-out;
}

.notification-overlay-enter-from,
.notification-overlay-leave-to {
  opacity: 0;
}

/* Painel — Fade + Slide da direita */
.notification-panel-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.25s ease;
}

.notification-panel-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 1, 1),
              opacity 0.2s ease 0.05s;
}

.notification-panel-enter-from {
  transform: translateX(100%);
  opacity: 0.5;
}

.notification-panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Cards — Entrada com slide up + fade */
.notification-item-enter-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Cards — Saída com slide lateral + fade */
.notification-item-leave-active {
  transition: opacity 0.25s ease,
              transform 0.3s cubic-bezier(0.4, 0, 1, 1);
  position: absolute;
  width: calc(100% - 32px);
}

.notification-item-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.97);
}

.notification-item-leave-to {
  opacity: 0;
  transform: translateX(60px) scale(0.95);
}

/* Reordenamento suave ao remover/filtrar */
.notification-item-move {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Transição de lida — propriedades extras adicionadas ao card */

/* Responsive */
@media (max-width: 480px) {
  .notification-panel {
    width: 100vw;
  }
}
</style>

