// Mock data for "Produtos Mais Vendidos" report

export const MARCAS = [
  { label: 'Caemmun', value: 'caemmun' },
  { label: 'Madesa', value: 'madesa' },
  { label: 'Móveis Leão', value: 'moveis-leao' },
  { label: 'Patrimar', value: 'patrimar' },
  { label: 'Bertolini', value: 'bertolini' },
]

export const CATEGORIAS_PRODUTO = [
  { label: 'Painel', value: 'painel' },
  { label: 'Escrivaninha', value: 'escrivaninha' },
  { label: 'Rack', value: 'rack' },
  { label: 'Estante', value: 'estante' },
  { label: 'Guarda-Roupa', value: 'guarda-roupa' },
  { label: 'Cômoda', value: 'comoda' },
  { label: 'Mesa', value: 'mesa' },
]

export const MODELOS = [
  'Jace', 'Job', 'Mondrian', 'Zeus', 'Thor', 'Iris', 'Luma', 'Davi', 'Lyon', 'Nara'
]

function generateProdutos() {
  const canais = ['banco-inter', 'mercado-livre', 'shopee', 'amazon', 'magalu']
  const categorias = ['painel', 'escrivaninha', 'rack', 'estante', 'guarda-roupa', 'comoda', 'mesa']
  const marcas = ['caemmun', 'madesa', 'moveis-leao', 'patrimar', 'bertolini']

  const produtos = [
    {
      id: 1,
      grupoSku: 'CAFI26',
      sku: '44',
      codigoRef: '8000100084-505',
      ean: '7899830076487',
      titulo: 'Painel Extensível para Tv até 65 Polegadas Mondrian',
      categoria: 'painel',
      marca: 'caemmun',
      modelo: 'Jace',
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp',
    },
    {
      id: 2,
      grupoSku: 'CAFI23',
      sku: '10',
      codigoRef: 'F.36064-015',
      ean: '7899830093125',
      titulo: 'Mesa de Canto Job Em L Escritório Computador Caemmun',
      categoria: 'escrivaninha',
      marca: 'caemmun',
      modelo: 'Job',
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp',
    },
    {
      id: 3,
      grupoSku: 'CAFI31',
      sku: '22',
      codigoRef: '8000100090-201',
      ean: '7899830081230',
      titulo: 'Rack para TV até 55 Polegadas Zeus Madesa',
      categoria: 'rack',
      marca: 'madesa',
      modelo: 'Zeus',
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp',
    },
    {
      id: 4,
      grupoSku: 'CAFI18',
      sku: '7',
      codigoRef: '8000100075-112',
      ean: '7899830069543',
      titulo: 'Estante Multiuso 5 Prateleiras Thor Móveis Leão',
      categoria: 'estante',
      marca: 'moveis-leao',
      modelo: 'Thor',
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp',
    },
    {
      id: 5,
      grupoSku: 'CAFI42',
      sku: '55',
      codigoRef: '8000100098-330',
      ean: '7899830098765',
      titulo: 'Guarda-Roupa Casal 6 Portas Iris Patrimar',
      categoria: 'guarda-roupa',
      marca: 'patrimar',
      modelo: 'Iris',
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp',
    },
    {
      id: 6,
      grupoSku: 'CAFI15',
      sku: '3',
      codigoRef: 'F.42010-008',
      ean: '7899830054321',
      titulo: 'Cômoda 4 Gavetas Luma Bertolini',
      categoria: 'comoda',
      marca: 'bertolini',
      modelo: 'Luma',
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp',
    },
    {
      id: 7,
      grupoSku: 'CAFI38',
      sku: '48',
      codigoRef: '8000100095-220',
      ean: '7899830091234',
      titulo: 'Mesa de Jantar Extensível Davi Madesa',
      categoria: 'mesa',
      marca: 'madesa',
      modelo: 'Davi',
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp',
    },
    {
      id: 8,
      grupoSku: 'CAFI29',
      sku: '19',
      codigoRef: '8000100088-145',
      ean: '7899830085678',
      titulo: 'Painel para TV 50 Polegadas Lyon Caemmun',
      categoria: 'painel',
      marca: 'caemmun',
      modelo: 'Lyon',
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp',
    },
    {
      id: 9,
      grupoSku: 'CAFI45',
      sku: '60',
      codigoRef: '8000100101-410',
      ean: '7899830102345',
      titulo: 'Escrivaninha com Gavetas Nara Patrimar',
      categoria: 'escrivaninha',
      marca: 'patrimar',
      modelo: 'Nara',
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp',
    },
    {
      id: 10,
      grupoSku: 'CAFI50',
      sku: '72',
      codigoRef: '8000100110-520',
      ean: '7899830115678',
      titulo: 'Rack Suspenso para TV 60 Polegadas Iris Bertolini',
      categoria: 'rack',
      marca: 'bertolini',
      modelo: 'Iris',
      imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp',
    },
  ]

  // Generate sales data for each product
  return produtos.map((produto, idx) => {
    const qtdVendido = Math.max(1, Math.round(50 - idx * 4.5 + Math.sin(idx) * 5))
    const ticketMedio = 175 + Math.round(Math.cos(idx * 1.4) * 120 + 100)
    const totalVendido = qtdVendido * ticketMedio
    const estoqueAtual = Math.max(0, Math.round(80 - idx * 6 + Math.sin(idx * 2) * 15))
    const canalId = canais[idx % canais.length]

    return {
      ...produto,
      canalId,
      qtdVendido,
      totalVendido,
      ticketMedio,
      estoqueAtual,
      dataUltimaVenda: new Date(2026, 5 + Math.floor(idx / 5), 1 + idx * 2),
    }
  })
}

export const mockProdutosMaisVendidos = generateProdutos()

export async function fetchProdutosMaisVendidos() {
  await new Promise(r => setTimeout(r, 600))
  return [...mockProdutosMaisVendidos]
}
