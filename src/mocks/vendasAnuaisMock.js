// Mock data for "Vendas Anuais" report

export const ANOS_DISPONIVEIS = [
  { label: '2026', value: 2026 },
  { label: '2025', value: 2025 },
  { label: '2024', value: 2024 },
]

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

// Raw data per year/channel/month
const rawData = {
  2026: {
    'mercado-livre': [0, 0, 4820.5, 7210.0, 9340.8, 11250.4, 2352.57, 0, 0, 0, 0, 0],
    'shopee':        [2100.0, 3450.9, 5620.3, 6780.0, 8120.5, 9300.0, 0, 0, 0, 0, 0, 0],
    'amazon':        [0, 0, 0, 3200.0, 5640.0, 7890.4, 0, 0, 0, 0, 0, 0],
    'magalu':        [0, 0, 1850.0, 2640.0, 3900.0, 4200.0, 0, 0, 0, 0, 0, 0],
    'banco-inter':   [0, 0, 0, 0, 0, 332.38, 0, 0, 0, 0, 0, 0],
  },
  2025: {
    'mercado-livre': [14200.0, 13400.0, 15800.0, 17200.0, 19400.0, 21300.0, 18700.0, 20100.0, 22400.0, 24800.0, 28600.0, 31200.0],
    'shopee':        [8900.0, 9200.0, 10400.0, 11800.0, 13200.0, 14600.0, 12800.0, 13900.0, 15200.0, 17100.0, 19800.0, 22300.0],
    'amazon':        [6100.0, 6800.0, 7200.0, 8400.0, 9600.0, 10200.0, 9800.0, 10400.0, 11800.0, 13200.0, 15400.0, 17600.0],
    'magalu':        [3200.0, 3600.0, 4100.0, 4800.0, 5400.0, 5900.0, 5200.0, 5700.0, 6400.0, 7200.0, 8600.0, 9800.0],
    'banco-inter':   [1200.0, 980.0, 1450.0, 1780.0, 2100.0, 2340.0, 1980.0, 2200.0, 2600.0, 3100.0, 3800.0, 4200.0],
  },
  2024: {
    'mercado-livre': [11200.0, 10800.0, 12400.0, 13900.0, 15600.0, 17200.0, 15400.0, 16800.0, 18200.0, 20400.0, 24100.0, 26800.0],
    'shopee':        [5800.0, 6200.0, 7100.0, 8400.0, 9600.0, 10800.0, 9400.0, 10200.0, 11400.0, 12900.0, 15200.0, 17400.0],
    'amazon':        [4200.0, 4600.0, 5100.0, 6200.0, 7100.0, 8200.0, 7600.0, 8100.0, 9200.0, 10400.0, 12600.0, 14200.0],
    'magalu':        [2100.0, 2400.0, 2800.0, 3200.0, 3800.0, 4200.0, 3900.0, 4200.0, 4800.0, 5400.0, 6800.0, 7600.0],
    'banco-inter':   [800.0, 720.0, 980.0, 1200.0, 1400.0, 1600.0, 1400.0, 1600.0, 1900.0, 2200.0, 2800.0, 3200.0],
  }
}

// Pedidos aprovados (quantity)
const pedidosAprovadosData = {
  2026: {
    'mercado-livre': [0, 0, 18, 28, 36, 43, 4, 0, 0, 0, 0, 0],
    'shopee':        [14, 22, 34, 41, 50, 57, 0, 0, 0, 0, 0, 0],
    'amazon':        [0, 0, 0, 8, 14, 20, 0, 0, 0, 0, 0, 0],
    'magalu':        [0, 0, 5, 8, 12, 13, 0, 0, 0, 0, 0, 0],
    'banco-inter':   [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
  },
  2025: {
    'mercado-livre': [54, 51, 60, 66, 74, 81, 71, 77, 85, 94, 109, 119],
    'shopee':        [62, 64, 72, 82, 92, 101, 89, 97, 106, 119, 138, 155],
    'amazon':        [18, 20, 21, 25, 28, 30, 29, 31, 35, 39, 45, 52],
    'magalu':        [14, 16, 18, 21, 24, 26, 23, 25, 28, 32, 38, 43],
    'banco-inter':   [6, 5, 7, 9, 10, 11, 10, 11, 13, 15, 18, 21],
  },
  2024: {
    'mercado-livre': [42, 41, 47, 53, 59, 65, 58, 64, 69, 77, 91, 101],
    'shopee':        [40, 43, 49, 58, 66, 75, 65, 71, 79, 89, 105, 121],
    'amazon':        [12, 14, 15, 18, 21, 24, 22, 24, 27, 31, 37, 42],
    'magalu':        [9, 10, 12, 14, 17, 18, 17, 18, 21, 24, 30, 34],
    'banco-inter':   [4, 4, 5, 6, 7, 8, 7, 8, 9, 11, 14, 16],
  }
}

// Pedidos cancelados (quantity)
const pedidosCanceladosData = {
  2026: {
    'mercado-livre': [0, 0, 1, 2, 2, 3, 0, 0, 0, 0, 0, 0],
    'shopee':        [1, 1, 2, 2, 3, 4, 0, 0, 0, 0, 0, 0],
    'amazon':        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    'magalu':        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    'banco-inter':   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  2025: {
    'mercado-livre': [3, 2, 4, 3, 4, 5, 4, 4, 5, 5, 6, 7],
    'shopee':        [4, 3, 4, 5, 5, 6, 5, 5, 6, 7, 8, 9],
    'amazon':        [1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 4],
    'magalu':        [1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 3, 3],
    'banco-inter':   [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  },
  2024: {
    'mercado-livre': [2, 2, 3, 3, 3, 4, 3, 4, 4, 5, 6, 6],
    'shopee':        [2, 3, 3, 4, 4, 5, 4, 4, 5, 6, 7, 8],
    'amazon':        [1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 3, 3],
    'magalu':        [0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
    'banco-inter':   [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  }
}

// Metas mensais
const metasData = {
  2026: [8000, 8000, 12000, 16000, 20000, 25000, 28000, 28000, 30000, 32000, 35000, 40000],
  2025: [30000, 30000, 35000, 38000, 42000, 46000, 44000, 46000, 50000, 55000, 65000, 72000],
  2024: [22000, 22000, 26000, 28000, 32000, 36000, 33000, 36000, 40000, 44000, 54000, 61000],
}

import { MARKETPLACES_CHANNELS } from './vendasPorCanalMock.js'

export function buildVendasAnuais(ano, marketplaces = []) {
  const channels = marketplaces.length > 0
    ? MARKETPLACES_CHANNELS.filter(c => marketplaces.includes(c.id))
    : MARKETPLACES_CHANNELS

  const anoAnterior = ano - 1
  const yearData = rawData[ano] || {}
  const prevYearData = rawData[anoAnterior] || {}
  const qtdAprovados = pedidosAprovadosData[ano] || {}
  const qtdCancelados = pedidosCanceladosData[ano] || {}
  const metas = metasData[ano] || Array(12).fill(0)

  return MESES.map((mes, idx) => {
    const totalVendas = channels.reduce((sum, c) => sum + (yearData[c.id]?.[idx] || 0), 0)
    const totalAnterior = channels.reduce((sum, c) => sum + (prevYearData[c.id]?.[idx] || 0), 0)
    const canceladosValor = channels.reduce((sum, c) => {
      const total = yearData[c.id]?.[idx] || 0
      const aprovados = qtdAprovados[c.id]?.[idx] || 0
      const cancelados = qtdCancelados[c.id]?.[idx] || 0
      const total_qty = aprovados + cancelados
      const ticket = total_qty > 0 ? total / total_qty : 0
      return sum + cancelados * ticket
    }, 0)
    const pedidosAprovados = channels.reduce((sum, c) => sum + (qtdAprovados[c.id]?.[idx] || 0), 0)
    const pedidosCancelados = channels.reduce((sum, c) => sum + (qtdCancelados[c.id]?.[idx] || 0), 0)
    const totalPedidos = pedidosAprovados + pedidosCancelados
    const ticketMedio = totalPedidos > 0 ? totalVendas / totalPedidos : 0
    const meta = metas[idx]
    const vsAnterior = totalAnterior > 0 ? ((totalVendas - totalAnterior) / totalAnterior) * 100 : null
    const vsMeta = meta > 0 ? (totalVendas / meta) * 100 : 0

    return {
      mes,
      mesIdx: idx,
      totalVendas,
      canceladosValor,
      totalAnterior,
      pedidosAprovados,
      pedidosCancelados,
      ticketMedio,
      meta,
      vsAnterior,
      vsMeta,
      descontos: totalVendas > 0 ? +(totalVendas * 0.035).toFixed(2) : 0,
      frete: totalVendas > 0 ? +(totalVendas * 0.06).toFixed(2) : 0,
      mediaFatDia: totalVendas > 0 ? +(totalVendas / 30).toFixed(2) : 0,
    }
  })
}

export async function fetchVendasAnuais(ano, marketplaces = []) {
  await new Promise(r => setTimeout(r, 500))
  return buildVendasAnuais(ano, marketplaces)
}
