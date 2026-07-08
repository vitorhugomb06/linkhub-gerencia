// Mock data for label management

export const mockCarriersForGenerate = [
  { id: 1, name: 'Correios', icon: 'pi pi-envelope', color: 'linear-gradient(135deg,#f59e0b,#d97706)', count: 12 },
  { id: 2, name: 'Jadlog', icon: 'pi pi-truck', color: 'linear-gradient(135deg,#3b82f6,#2563eb)', count: 8 },
  { id: 3, name: 'Total Express', icon: 'pi pi-send', color: 'linear-gradient(135deg,#10b981,#059669)', count: 5 },
  { id: 4, name: 'Azul Cargo', icon: 'pi pi-globe', color: 'linear-gradient(135deg,#6366f1,#4f46e5)', count: 3 },
  { id: 5, name: 'Sequoia', icon: 'pi pi-map-marker', color: 'linear-gradient(135deg,#ec4899,#db2777)', count: 0 },
]

export const mockCarriersForPrint = [
  { id: 1, name: 'Correios', icon: 'pi pi-envelope', color: 'linear-gradient(135deg,#f59e0b,#d97706)', count: 3 },
  { id: 2, name: 'Jadlog', icon: 'pi pi-truck', color: 'linear-gradient(135deg,#3b82f6,#2563eb)', count: 2 },
  { id: 3, name: 'Total Express', icon: 'pi pi-send', color: 'linear-gradient(135deg,#10b981,#059669)', count: 1 },
  { id: 4, name: 'Azul Cargo', icon: 'pi pi-globe', color: 'linear-gradient(135deg,#6366f1,#4f46e5)', count: 0 },
]

const statuses = ['Aguardando', 'Aprovado', 'Em separação', 'Pendente']
const clients = ['Maria Silva', 'João Souza', 'Ana Oliveira', 'Carlos Lima', 'Fernanda Costa', 'Roberto Alves', 'Patrícia Mendes', 'Lucas Ferreira']
const shippingMethods = ['PAC', 'SEDEX', 'SEDEX 10', 'Econômico', 'Expresso']

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randomValue() { return Math.floor(Math.random() * 50000 + 5000) / 100 }
function randomDate() {
  const d = new Date(2026, 4, Math.floor(Math.random() * 22) + 1)
  return d.toLocaleDateString('pt-BR')
}

export function generateOrders(carrierId, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${carrierId}-${i + 1}`,
    number: `PED${String(Math.floor(Math.random() * 9000) + 1000)}`,
    client: randomItem(clients),
    date: randomDate(),
    value: randomValue(),
    items: Math.floor(Math.random() * 8) + 1,
    shippingMethod: randomItem(shippingMethods),
    status: randomItem(statuses),
  }))
}

const groupUsers = ['Vitor Hugo', 'Ana Paula', 'Carlos Mendes', 'Fernanda Lima']
const groupStatuses = ['Pronto', 'Impresso', 'Pendente']

function generateGroupOrders(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `go-${i}`,
    number: `PED${String(Math.floor(Math.random() * 9000) + 1000)}`,
    client: randomItem(clients),
    value: randomValue(),
    labelCode: `ETQ${String(Math.floor(Math.random() * 900000) + 100000)}`,
    labelStatus: randomItem(['Gerada', 'Pendente', 'Erro']),
    generatedAt: randomDate(),
  }))
}

export function generateGroups(carrierId, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `GRP-${carrierId}-${String(i + 1).padStart(3, '0')}`,
    name: `Grupo ${i + 1}`,
    generatedAt: randomDate(),
    user: randomItem(groupUsers),
    status: randomItem(groupStatuses),
    orders: generateGroupOrders(Math.floor(Math.random() * 10) + 2),
  }))
}

// Simulate async API calls
export async function fetchOrdersForCarrier(carrierId) {
  await new Promise(r => setTimeout(r, 800))
  const carrier = mockCarriersForGenerate.find(c => c.id === carrierId)
  return generateOrders(carrierId, carrier?.count || 0)
}

export async function fetchGroupsForCarrier(carrierId) {
  await new Promise(r => setTimeout(r, 800))
  const carrier = mockCarriersForPrint.find(c => c.id === carrierId)
  return generateGroups(carrierId, carrier?.count || 0)
}
