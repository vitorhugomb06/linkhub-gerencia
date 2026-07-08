import { ref, computed } from 'vue'

const notifications = ref([
  {
    id: 1,
    type: 'invite_accepted',
    title: 'Convite aceito com sucesso',
    message: 'Seu convite para Opção Móveis foi aceito por thaylon teste',
    timestamp: '2026-06-08T18:18:28',
    read: false,
    actions: []
  },
  {
    id: 2,
    type: 'invite_received',
    title: 'Novo convite recebido',
    message: 'Você foi convidado para se juntar à loja Caemmun por Vitor Hugo Martins',
    timestamp: '2026-05-28T18:01:25',
    read: false,
    actions: [
      { label: 'Recusar', style: 'danger', action: 'reject_invite' },
      { label: 'Aceitar', style: 'success', icon: 'pi pi-check', action: 'accept_invite' }
    ]
  },
  {
    id: 3,
    type: 'export_ready',
    title: 'Sua exportação está pronta',
    message: 'Sua exportação de pedidos (Junho 2026) está pronta para download.',
    timestamp: '2026-06-10T09:30:00',
    read: false,
    actions: [
      { label: 'Baixar Excel', style: 'primary', icon: 'pi pi-download', action: 'download_export' },
      { label: 'Ver exportações', style: 'secondary', icon: 'pi pi-external-link', action: 'view_exports' }
    ]
  },
  {
    id: 5,
    type: 'system',
    title: 'Manutenção agendada',
    message: 'O sistema ficará indisponível dia 15/06 das 02:00 às 04:00 para manutenção.',
    timestamp: '2026-06-07T10:00:00',
    read: true,
    actions: []
  },
  {
    id: 6,
    type: 'sync_error',
    title: 'Falha ao sincronizar produtos',
    message: 'Falha ao sincronizar produtos com Mercado Livre. Verifique suas credenciais.',
    timestamp: '2026-06-06T16:45:00',
    read: true,
    actions: [
      { label: 'Ver detalhes', style: 'secondary', icon: 'pi pi-eye', action: 'view_sync_error' }
    ]
  },
  {
    id: 7,
    type: 'import_ready',
    title: 'Importação concluída',
    message: 'A importação de produtos (planilha_produtos.xlsx) foi concluída com sucesso. 320 itens importados.',
    timestamp: '2026-06-10T11:15:00',
    read: false,
    actions: [
      { label: 'Ver importações', style: 'secondary', icon: 'pi pi-external-link', action: 'view_imports' }
    ]
  },
  {
    id: 8,
    type: 'import_error',
    title: 'Erro na importação de estoque',
    message: 'A importação de estoque falhou. 12 linhas com erros de formatação foram encontradas.',
    timestamp: '2026-06-09T08:40:00',
    read: true,
    actions: [
      { label: 'Baixar relatório', style: 'primary', icon: 'pi pi-download', action: 'download_import_report' },
      { label: 'Ver importações', style: 'secondary', icon: 'pi pi-external-link', action: 'view_imports' }
    ]
  }
])

const isPanelOpen = ref(false)

export function useNotifications() {
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value
  }

  function openPanel() {
    isPanelOpen.value = true
  }

  function closePanel() {
    isPanelOpen.value = false
  }

  function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) notification.read = true
  }

  function markAllAsRead() {
    notifications.value.forEach(n => { n.read = true })
  }

  function removeNotification(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function clearAll() {
    notifications.value = []
  }

  function handleAction(notification, action) {
    console.log(`Action: ${action} on notification ${notification.id}`)
    if (action === 'accept_invite' || action === 'reject_invite') {
      removeNotification(notification.id)
    }
  }

  function getNotificationIcon(type) {
    const icons = {
      invite_accepted: 'pi pi-check-circle',
      invite_received: 'pi pi-user-plus',
      export_ready: 'pi pi-file-excel',
      order_status: 'pi pi-shopping-cart',
      system: 'pi pi-info-circle',
      sync_error: 'pi pi-exclamation-triangle',
      label_ready: 'pi pi-tag',
      payment: 'pi pi-wallet',
      import_ready: 'pi pi-cloud-upload',
      import_error: 'pi pi-exclamation-circle'
    }
    return icons[type] || 'pi pi-bell'
  }

  // Tipos que exigem ação do usuário
  function requiresAction(type) {
    const actionTypes = ['invite_received', 'sync_error', 'import_error']
    return actionTypes.includes(type)
  }

  // Prioridade por tipo — Crítico, Aviso, Sucesso, Info
  function getNotificationPriority(type) {
    const priorities = {
      sync_error: { level: 'critical', label: 'Crítico', icon: 'pi pi-exclamation-circle', color: '#dc2626', bg: '#fef2f2' },
      import_error: { level: 'critical', label: 'Crítico', icon: 'pi pi-exclamation-circle', color: '#dc2626', bg: '#fef2f2' },
      invite_received: { level: 'warning', label: 'Aviso', icon: 'pi pi-exclamation-triangle', color: '#d97706', bg: '#fffbeb' },
      system: { level: 'info', label: 'Info', icon: 'pi pi-info-circle', color: '#6366f1', bg: '#eef2ff' },
      invite_accepted: { level: 'success', label: 'Sucesso', icon: 'pi pi-check-circle', color: '#059669', bg: '#ecfdf5' },
      export_ready: { level: 'success', label: 'Sucesso', icon: 'pi pi-check-circle', color: '#059669', bg: '#ecfdf5' },
      import_ready: { level: 'success', label: 'Sucesso', icon: 'pi pi-check-circle', color: '#059669', bg: '#ecfdf5' }
    }
    return priorities[type] || { level: 'info', label: 'Info', icon: 'pi pi-info-circle', color: '#6366f1', bg: '#eef2ff' }
  }

  // Badge de status por tipo — comunica rapidamente o estado
  function getNotificationBadge(type) {
    const badges = {
      invite_accepted: { label: 'Concluído', color: '#10b981', bg: '#ecfdf5' },
      invite_received: { label: 'Ação necessária', color: '#f59e0b', bg: '#fffbeb' },
      export_ready: { label: 'Pronto', color: '#3b82f6', bg: '#eff6ff' },
      import_ready: { label: 'Importado', color: '#14b8a6', bg: '#f0fdfa' },
      import_error: { label: 'Erro', color: '#ef4444', bg: '#fef2f2' },
      sync_error: { label: 'Falha', color: '#ef4444', bg: '#fef2f2' },
      system: { label: 'Agendada', color: '#64748b', bg: '#f8fafc' },
      order_status: { label: 'Atualizado', color: '#f59e0b', bg: '#fffbeb' },
      label_ready: { label: 'Concluído', color: '#8b5cf6', bg: '#f5f3ff' },
      payment: { label: 'Pendente', color: '#f59e0b', bg: '#fffbeb' }
    }
    return badges[type] || { label: 'Info', color: '#64748b', bg: '#f8fafc' }
  }

  // Cor de fundo suave por tipo — hierarquia visual de prioridade
  function getNotificationBg(type) {
    const backgrounds = {
      // Erros / atenção urgente (vermelho)
      sync_error: '#fef2f2',
      import_error: '#fef2f2',
      // Convites pendentes (amarelo — precisa de ação)
      invite_received: '#fffbeb',
      // Sucesso / aceito (verde)
      invite_accepted: '#ecfdf5',
      import_ready: '#ecfdf5',
      // Processos concluídos (azul)
      export_ready: '#eff6ff',
      // Informativo / sistema (neutro)
      system: '#f8fafc'
    }
    return backgrounds[type] || '#ffffff'
  }

  function getNotificationColor(type) {
    const colors = {
      invite_accepted: '#10b981',
      invite_received: '#ef4444',
      export_ready: '#3b82f6',
      order_status: '#f59e0b',
      system: '#64748b',
      sync_error: '#ef4444',
      label_ready: '#8b5cf6',
      payment: '#10b981',
      import_ready: '#14b8a6',
      import_error: '#f97316'
    }
    return colors[type] || '#3b82f6'
  }

  // Categoria agrupa os tipos para os filtros
  function getNotificationCategory(type) {
    const categories = {
      invite_accepted: 'invites',
      invite_received: 'invites',
      export_ready: 'exports',
      order_status: 'orders',
      system: 'system',
      sync_error: 'system',
      label_ready: 'orders',
      payment: 'orders',
      import_ready: 'imports',
      import_error: 'imports'
    }
    return categories[type] || 'system'
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)

    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    if (date >= startOfToday) return `Hoje • ${time}`
    if (date >= startOfYesterday) return `Ontem • ${time}`

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${day}/${month} • ${time}`
  }

  // Agrupa por período: Hoje, Ontem, Esta semana, Mais antigas
  function getDateGroup(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

    if (date >= startOfToday) return 'Hoje'
    if (date >= startOfYesterday) return 'Ontem'
    if (date >= startOfWeek) return 'Esta semana'
    return 'Mais antigas'
  }

  return {
    notifications,
    isPanelOpen,
    unreadCount,
    togglePanel,
    openPanel,
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
  }
}
