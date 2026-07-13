// Mock data for "Vendas por Canal" report

export const MARKETPLACES_CHANNELS = [
  { id: 'banco-inter', name: 'Banco Inter', icon: 'pi pi-wallet', color: '#FF7A00', logo: 'https://logospng.org/download/banco-inter/logo-banco-inter-icon-1024.png' },
  { id: 'mercado-livre', name: 'Mercado Livre', icon: 'pi pi-shopping-bag', color: '#FFE600', logo: 'https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.6.92/mercadolibre/logo_large_25years@2x.png' },
  { id: 'shopee', name: 'Shopee', icon: 'pi pi-shopping-cart', color: '#EE4D2D', logo: 'https://cf.shopee.com.br/file/br-50009109-1a827b10e5734ba1a728a0f87d3583b5_xhdpi' },
  { id: 'amazon', name: 'Amazon', icon: 'pi pi-box', color: '#FF9900', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { id: 'magalu', name: 'Magazine Luiza', icon: 'pi pi-bolt', color: '#0086FF', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_Magazine_Luiza.svg/1200px-Logo_Magazine_Luiza.svg.png' },
]

export const CATEGORIAS = [
  { label: 'Eletrônicos', value: 'eletronicos' },
  { label: 'Moda', value: 'moda' },
  { label: 'Casa e Decoração', value: 'casa' },
  { label: 'Esportes', value: 'esportes' },
  { label: 'Beleza', value: 'beleza' },
]

export const SITUACOES = [
  { label: 'Completado', value: 'completado' },
  { label: 'Pendente', value: 'pendente' },
  { label: 'Cancelado', value: 'cancelado' },
]

// Individual orders with all filterable attributes
function generatePedidos() {
  const canais = MARKETPLACES_CHANNELS
  const categorias = ['eletronicos', 'moda', 'casa', 'esportes', 'beleza']
  const situacoes = ['completado', 'completado', 'completado', 'pendente', 'cancelado'] // weighted towards completado

  const pedidos = []
  let id = 1

  // Banco Inter - 2 pedidos
  pedidos.push(
    { id: id++, canalId: 'banco-inter', categoria: 'eletronicos', situacao: 'completado', valor: 189.90, data: new Date(2026, 5, 12) },
    { id: id++, canalId: 'banco-inter', categoria: 'moda', situacao: 'completado', valor: 142.48, data: new Date(2026, 5, 18) },
  )

  // Mercado Livre - 47 pedidos
  const mlDates = [
    new Date(2026, 0, 5), new Date(2026, 0, 12), new Date(2026, 0, 22),
    new Date(2026, 1, 3), new Date(2026, 1, 14), new Date(2026, 1, 20), new Date(2026, 1, 28),
    new Date(2026, 2, 4), new Date(2026, 2, 15), new Date(2026, 2, 22),
    new Date(2026, 3, 1), new Date(2026, 3, 10), new Date(2026, 3, 18), new Date(2026, 3, 25),
    new Date(2026, 4, 2), new Date(2026, 4, 8), new Date(2026, 4, 14), new Date(2026, 4, 20), new Date(2026, 4, 28),
    new Date(2026, 5, 1), new Date(2026, 5, 5), new Date(2026, 5, 8), new Date(2026, 5, 11),
    new Date(2026, 5, 14), new Date(2026, 5, 16), new Date(2026, 5, 18), new Date(2026, 5, 20),
    new Date(2026, 5, 22), new Date(2026, 5, 23), new Date(2026, 5, 24), new Date(2026, 5, 25),
    new Date(2026, 5, 26), new Date(2026, 5, 27), new Date(2026, 5, 28), new Date(2026, 5, 29),
    new Date(2026, 6, 1), new Date(2026, 6, 2), new Date(2026, 6, 3), new Date(2026, 6, 4),
    new Date(2026, 6, 5), new Date(2026, 6, 5), new Date(2026, 6, 6), new Date(2026, 6, 6),
    new Date(2026, 6, 7), new Date(2026, 6, 7), new Date(2026, 6, 7), new Date(2026, 6, 8),
  ]
  for (let i = 0; i < 47; i++) {
    const sit = i < 42 ? 'completado' : (i < 44 ? 'pendente' : 'cancelado')
    const cat = categorias[i % categorias.length]
    const valor = 120 + Math.round(Math.sin(i * 1.3) * 80 + 150)
    pedidos.push({ id: id++, canalId: 'mercado-livre', categoria: cat, situacao: sit, valor, data: mlDates[i] })
  }

  // Shopee - 63 pedidos
  for (let i = 0; i < 63; i++) {
    const sit = i < 56 ? 'completado' : (i < 60 ? 'pendente' : 'cancelado')
    const cat = categorias[(i + 2) % categorias.length]
    const valor = 60 + Math.round(Math.cos(i * 0.9) * 50 + 80)
    const month = Math.floor(i / 11)
    const day = 1 + (i % 28)
    pedidos.push({ id: id++, canalId: 'shopee', categoria: cat, situacao: sit, valor, data: new Date(2026, month, day) })
  }

  // Amazon - 18 pedidos
  for (let i = 0; i < 18; i++) {
    const sit = i < 17 ? 'completado' : 'cancelado'
    const cat = categorias[(i + 1) % categorias.length]
    const valor = 200 + Math.round(Math.sin(i * 2.1) * 100 + 90)
    const month = 2 + Math.floor(i / 5)
    const day = 3 + (i * 2) % 25
    pedidos.push({ id: id++, canalId: 'amazon', categoria: cat, situacao: sit, valor, data: new Date(2026, month, day) })
  }

  // Magazine Luiza - 12 pedidos
  for (let i = 0; i < 12; i++) {
    const sit = i < 11 ? 'completado' : 'cancelado'
    const cat = categorias[(i + 3) % categorias.length]
    const valor = 150 + Math.round(Math.sin(i * 1.7) * 90 + 100)
    const month = 3 + Math.floor(i / 4)
    const day = 5 + (i * 3) % 22
    pedidos.push({ id: id++, canalId: 'magalu', categoria: cat, situacao: sit, valor, data: new Date(2026, month, day) })
  }

  return pedidos
}

export const mockPedidos = generatePedidos()

// Aggregate pedidos into channel summary, applying filters
export function aggregateByCanal(pedidos) {
  const channelMap = {}

  for (const canal of MARKETPLACES_CHANNELS) {
    channelMap[canal.id] = {
      id: canal.id,
      canal: canal.name,
      icon: canal.icon,
      color: canal.color,
      logo: canal.logo,
      vendasTotais: 0,
      vendasCompletadas: 0,
      vendasNaoCompletadas: 0,
      pedidosTotais: 0,
      pedidosCompletados: 0,
      pedidosCancelados: 0,
      pedidosPendentes: 0,
      ticketMedio: 0,
    }
  }

  for (const pedido of pedidos) {
    const ch = channelMap[pedido.canalId]
    if (!ch) continue

    ch.pedidosTotais++
    ch.vendasTotais += pedido.valor

    if (pedido.situacao === 'completado') {
      ch.pedidosCompletados++
      ch.vendasCompletadas += pedido.valor
    } else if (pedido.situacao === 'pendente') {
      ch.pedidosPendentes++
      ch.vendasNaoCompletadas += pedido.valor
    } else if (pedido.situacao === 'cancelado') {
      ch.pedidosCancelados++
      ch.vendasNaoCompletadas += pedido.valor
    }
  }

  const result = []
  for (const canal of MARKETPLACES_CHANNELS) {
    const ch = channelMap[canal.id]
    if (ch.pedidosTotais > 0) {
      ch.ticketMedio = ch.vendasTotais / ch.pedidosTotais
      result.push(ch)
    }
  }

  return result
}

export async function fetchPedidos() {
  await new Promise(r => setTimeout(r, 600))
  return [...mockPedidos]
}
