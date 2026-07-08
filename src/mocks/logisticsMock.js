// Mock data for logistics settings module

// In-memory persistence store: Map<`${marketplaceId}:${logisticId}`, boolean>
const enabledStore = new Map()

// ─── Marketplaces ────────────────────────────────────────────────────────────

export const mockMarketplaces = [
  {
    id: 'MKT-001',
    name: 'Mercado Livre',
    logo: 'pi pi-shopping-bag',
    color: 'linear-gradient(135deg,#ffe600,#f5a623)',
    logisticsCount: 5
  },
  {
    id: 'MKT-002',
    name: 'Shopee',
    logo: 'pi pi-shop',
    color: 'linear-gradient(135deg,#ff6633,#ee4d2d)',
    logisticsCount: 3
  },
  {
    id: 'MKT-003',
    name: 'Amazon',
    logo: 'pi pi-globe',
    color: 'linear-gradient(135deg,#ff9900,#e47911)',
    logisticsCount: 4
  },
  {
    id: 'MKT-004',
    name: 'Magalu',
    logo: 'pi pi-star',
    color: 'linear-gradient(135deg,#0086ff,#0054a3)',
    logisticsCount: 2
  },
  {
    id: 'MKT-005',
    name: 'Via Varejo',
    logo: 'pi pi-building',
    color: 'linear-gradient(135deg,#e30613,#9b0000)',
    logisticsCount: 0
  }
]

// ─── Logistics per marketplace ────────────────────────────────────────────────

const logisticsByMarketplace = {
  'MKT-001': [
    {
      id: 'LOG-ML-001',
      name: 'Mercado Envios Full',
      status: 'Ativo',
      enabled: true,
      minWeight: 0.1,
      maxWeight: 30,
      height: 200,
      width: 200,
      depth: 150,
      maxCubicVolume: 999,
      minVolume: 0,
      maxVolume: 600,
      description: 'Modalidade de fulfillment do Mercado Livre. Os produtos são armazenados e despachados diretamente pelos centros de distribuição do ML.'
    },
    {
      id: 'LOG-ML-002',
      name: 'Mercado Envios Flex',
      status: 'Ativo',
      enabled: false,
      minWeight: 0.1,
      maxWeight: 20,
      height: 500,
      width: 500,
      depth: 400,
      maxCubicVolume: 100,
      minVolume: 0,
      maxVolume: 100,
      description: 'Envio feito pelo próprio vendedor no mesmo dia. Disponível apenas para pedidos dentro da área de cobertura do vendedor.'
    },
    {
      id: 'LOG-ML-003',
      name: 'Correios PAC',
      status: 'Ativo',
      enabled: true,
      minWeight: 0.05,
      maxWeight: 30,
      height: 105,
      width: 105,
      depth: 15,
      maxCubicVolume: 999,
      minVolume: 0,
      maxVolume: 999,
      description: 'Serviço econômico dos Correios para envios sem urgência. Prazo de entrega de 5 a 10 dias úteis.'
    },
    {
      id: 'LOG-ML-004',
      name: 'Correios SEDEX',
      status: 'Ativo',
      enabled: true,
      minWeight: 0.05,
      maxWeight: 30,
      height: 105,
      width: 105,
      depth: 15,
      maxCubicVolume: 999,
      minVolume: 0,
      maxVolume: 999,
      description: 'Serviço expresso dos Correios. Prazo de entrega de 1 a 3 dias úteis conforme a origem e destino.'
    },
    {
      id: 'LOG-ML-005',
      name: 'Agência Mercado Livre',
      status: 'Inativo',
      enabled: false,
      minWeight: 0.1,
      maxWeight: 15,
      height: 300,
      width: 300,
      depth: 200,
      maxCubicVolume: 50,
      minVolume: 0,
      maxVolume: 18,
      description: 'Entrega em pontos de retirada parceiros do Mercado Livre. Modalidade temporariamente indisponível nesta região.'
    }
  ],

  'MKT-002': [
    {
      id: 'LOG-SHP-001',
      name: 'Shopee Xpress',
      status: 'Ativo',
      enabled: true,
      minWeight: 0.1,
      maxWeight: 50,
      height: 600,
      width: 600,
      depth: 500,
      maxCubicVolume: 180,
      minVolume: 0,
      maxVolume: 180,
      description: 'Serviço logístico padrão da Shopee com integração direta à plataforma. Rastreamento em tempo real disponível.'
    },
    {
      id: 'LOG-SHP-002',
      name: 'J&T Express',
      status: 'Ativo',
      enabled: false,
      minWeight: 0.1,
      maxWeight: 30,
      height: 400,
      width: 400,
      depth: 300,
      maxCubicVolume: 48,
      minVolume: 0,
      maxVolume: 48,
      description: 'Parceiro logístico da Shopee com cobertura nacional e coleta na origem do vendedor.'
    },
    {
      id: 'LOG-SHP-003',
      name: 'Shopee Fulfillment',
      status: 'Inativo',
      enabled: false,
      minWeight: 0.2,
      maxWeight: 20,
      height: 400,
      width: 350,
      depth: 300,
      maxCubicVolume: 42,
      minVolume: 0,
      maxVolume: 42,
      description: 'Serviço de armazenagem e despacho da Shopee. Indisponível para novos vendedores no momento.'
    }
  ],

  'MKT-003': [
    {
      id: 'LOG-AMZ-001',
      name: 'Amazon Prime',
      status: 'Ativo',
      enabled: true,
      minWeight: 0.05,
      maxWeight: 25,
      height: 350,
      width: 350,
      depth: 250,
      maxCubicVolume: 30,
      minVolume: 0,
      maxVolume: 30,
      description: 'Entrega para assinantes Prime com prazo de 1 dia útil. Requer estoque nos centros de distribuição da Amazon.'
    },
    {
      id: 'LOG-AMZ-002',
      name: 'Amazon Standard',
      status: 'Ativo',
      enabled: true,
      minWeight: 0.05,
      maxWeight: 30,
      height: 500,
      width: 500,
      depth: 400,
      maxCubicVolume: 100,
      minVolume: 0,
      maxVolume: 100,
      description: 'Entrega padrão Amazon com prazo de 3 a 5 dias úteis. Disponível para todos os vendedores cadastrados.'
    },
    {
      id: 'LOG-AMZ-003',
      name: 'FBA (Fulfillment by Amazon)',
      status: 'Ativo',
      enabled: false,
      minWeight: 0.1,
      maxWeight: 20,
      height: 300,
      width: 300,
      depth: 200,
      maxCubicVolume: 18,
      minVolume: 0,
      maxVolume: 18,
      description: 'Modelo em que a Amazon gerencia todo o processo de armazenagem, embalagem e despacho dos seus produtos.'
    },
    {
      id: 'LOG-AMZ-004',
      name: 'Amazon Logística Pesada',
      status: 'Inativo',
      enabled: false,
      minWeight: 5,
      maxWeight: 100,
      height: 2000,
      width: 1500,
      depth: 1000,
      maxCubicVolume: 3000,
      minVolume: 0,
      maxVolume: 3000,
      description: 'Modalidade para itens pesados e volumosos. Requer agendamento prévio com a transportadora parceira.'
    }
  ],

  'MKT-004': [
    {
      id: 'LOG-MAG-001',
      name: 'Magalu Entregas',
      status: 'Ativo',
      enabled: true,
      minWeight: 0.1,
      maxWeight: 50,
      height: 600,
      width: 600,
      depth: 500,
      maxCubicVolume: 180,
      minVolume: 0,
      maxVolume: 180,
      description: 'Serviço logístico próprio do Magalu com cobertura nas principais capitais e regiões metropolitanas.'
    },
    {
      id: 'LOG-MAG-002',
      name: 'Retirada em Loja',
      status: 'Ativo',
      enabled: false,
      minWeight: 0,
      maxWeight: 100,
      height: 0,
      width: 0,
      depth: 0,
      maxCubicVolume: 0,
      minVolume: 0,
      maxVolume: 0,
      description: 'O cliente retira o produto diretamente em uma das lojas físicas do Magalu mais próxima. Sem custo de frete.'
    }
  ],

  'MKT-005': []
}

// ─── Async API simulation ─────────────────────────────────────────────────────

export async function fetchMarketplaces() {
  await new Promise(r => setTimeout(r, 800))
  return [...mockMarketplaces]
}

export async function fetchLogisticsForMarketplace(marketplaceId) {
  await new Promise(r => setTimeout(r, 800))
  const logistics = logisticsByMarketplace[marketplaceId] || []
  // Apply any persisted enabled states from the store
  return logistics.map(l => ({
    ...l,
    enabled: enabledStore.has(`${marketplaceId}:${l.id}`)
      ? enabledStore.get(`${marketplaceId}:${l.id}`)
      : l.enabled
  }))
}

export async function saveLogisticEnabled(marketplaceId, logisticId, enabled) {
  await new Promise(r => setTimeout(r, 600))
  // Simulate ~10% failure rate
  if (Math.random() < 0.1) {
    throw new Error('Falha na comunicação com o servidor. Tente novamente.')
  }
  enabledStore.set(`${marketplaceId}:${logisticId}`, enabled)
}
