// Mock data for Product Stock (Estoque) page
// Model: SKU Grupo → N variações (SKUs) → cada variação tem suas filiais

const MARKETPLACES = [
  { id: 'MKT-001', name: 'Mercado Livre' },
  { id: 'MKT-002', name: 'Shopee' },
  { id: 'MKT-003', name: 'Amazon' },
  { id: 'MKT-004', name: 'Magalu' },
]

const TIPOS_ESTOQUE = [
  { label: 'Automático', value: 'automatico' },
  { label: 'Fixo',       value: 'fixo' },
  { label: 'Baixando',   value: 'baixando' },
]

export { TIPOS_ESTOQUE, MARKETPLACES }

// 50 filiais realistas distribuídas pelo Brasil
const ESTADOS = [
  { uf: 'SP', cidades: ['São Paulo','Campinas','Guarulhos','Santo André','São Bernardo do Campo','Ribeirão Preto','Sorocaba','Cajamar','Cotia','Jundiaí','Osasco','Mauá','Santos'] },
  { uf: 'RJ', cidades: ['Rio de Janeiro','Niterói','Nova Iguaçu','Duque de Caxias','São Gonçalo'] },
  { uf: 'MG', cidades: ['Belo Horizonte','Contagem','Uberlândia','Juiz de Fora','Betim'] },
  { uf: 'PR', cidades: ['Curitiba','Arapongas','Londrina','Maringá','Cascavel'] },
  { uf: 'RS', cidades: ['Porto Alegre','Caxias do Sul','Canoas','Pelotas','Santa Maria'] },
  { uf: 'SC', cidades: ['Florianópolis','Joinville','Blumenau','São José','Chapecó'] },
  { uf: 'BA', cidades: ['Salvador','Feira de Santana','Vitória da Conquista'] },
  { uf: 'PE', cidades: ['Recife','Caruaru','Petrolina'] },
  { uf: 'CE', cidades: ['Fortaleza','Caucaia'] },
  { uf: 'AM', cidades: ['Manaus'] },
  { uf: 'PA', cidades: ['Belém'] },
  { uf: 'GO', cidades: ['Goiânia','Anápolis'] },
  { uf: 'DF', cidades: ['Brasília'] },
  { uf: 'ES', cidades: ['Vitória','Serra'] },
  { uf: 'MT', cidades: ['Cuiabá'] },
  { uf: 'MS', cidades: ['Campo Grande'] },
]

function buildFilialBase() {
  const filiais = []
  let id = 1
  for (const estado of ESTADOS) {
    for (const cidade of estado.cidades) {
      filiais.push({
        id,
        nome: `Centro de Distribuição (${cidade} - ${estado.uf})`,
        status: id % 11 === 0 ? 'inativo' : 'ativo', // ~1 em 11 é inativo
      })
      id++
      if (id > 50) break
    }
    if (id > 50) break
  }
  return filiais
}

const filialBase = buildFilialBase()

function makeFiliais(seed) {
  return filialBase.map(f => {
    const disp = f.status === 'inativo' ? 0 : Math.max(0, ((seed * f.id * 7) % 120))
    return {
      ...f,
      totalDisponivel:    disp,
      reservado:          f.status === 'inativo' ? 0 : ((seed * f.id) % 8),
      emTransito:         f.status === 'inativo' ? 0 : ((seed + f.id) % 12),
      // campos editáveis
      estoqueDisponivel:  disp,
      tipoEstoque:        'automatico',
      estoqueSguranca:    0,
      tempoAdicionalDias: 0,
      restricoes: MARKETPLACES.map(mp => ({
        marketplaceId:   mp.id,
        marketplaceName: mp.name,
        restrito:        false,
      })),
    }
  })
}

export const mockProductGroup = {
  skuGrupo:     'CAFI',
  estoqueTotal:  1240,
  estoqueMinimo: 50,
}

export const mockVariacoes = [
  {
    sku: '1', codigoReferencia: '8000100084-504',
    caracteristicaPrincipal: 'Cor: Off White/Frajo', caracteristicaSecundaria: '',
    codigoBarras: '7898630575718', totalDisponivel: 480, estoqueMinimoSku: null, status: 'Ativo',
    filiais: makeFiliais(3),
  },
  {
    sku: '2', codigoReferencia: '8000100084-505',
    caracteristicaPrincipal: 'Cor: Preto/Cinza', caracteristicaSecundaria: 'Tam: M',
    codigoBarras: '7898630575719', totalDisponivel: 320, estoqueMinimoSku: 5, status: 'Ativo',
    filiais: makeFiliais(5),
  },
  {
    sku: '3', codigoReferencia: '8000100084-506',
    caracteristicaPrincipal: 'Cor: Azul Marinho', caracteristicaSecundaria: 'Tam: G',
    codigoBarras: '7898630575720', totalDisponivel: 240, estoqueMinimoSku: 3, status: 'Ativo',
    filiais: makeFiliais(7),
  },
  {
    sku: '4', codigoReferencia: '8000100084-507',
    caracteristicaPrincipal: 'Cor: Verde Musgo', caracteristicaSecundaria: 'Tam: P',
    codigoBarras: '7898630575721', totalDisponivel: 120, estoqueMinimoSku: 2, status: 'Ativo',
    filiais: makeFiliais(11),
  },
  {
    sku: '5', codigoReferencia: '8000100084-508',
    caracteristicaPrincipal: 'Cor: Vermelho', caracteristicaSecundaria: '',
    codigoBarras: '7898630575722', totalDisponivel: 0, estoqueMinimoSku: 5, status: 'Inativo',
    filiais: makeFiliais(2),
  },
]

export async function fetchProductStock() {
  await new Promise(r => setTimeout(r, 700))
  return {
    group:    { ...mockProductGroup },
    variacoes: mockVariacoes.map(v => ({
      ...v,
      filiais: v.filiais.map(f => ({
        ...f,
        restricoes: f.restricoes.map(r => ({ ...r })),
      })),
    })),
  }
}
