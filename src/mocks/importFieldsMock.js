// Mock data for Import Fields (De-Para de Campos) module

// ─── Normalização ────────────────────────────────────────────────────────────

/**
 * Normaliza um texto para comparação:
 * - remove acentos
 * - converte para minúsculo
 * - remove espaços duplicados
 * - trim
 */
export function normalizeText(text) {
  if (!text) return ''
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// ─── Campos internos padrão ──────────────────────────────────────────────────

const importFields = [
  // Gerais
  { id: 1, key: 'title', name: 'Título', type: 'text', group: 'Gerais', required: true },
  { id: 2, key: 'description', name: 'Descrição', type: 'text_long', group: 'Gerais' },
  { id: 3, key: 'sku', name: 'SKU', type: 'text', group: 'Gerais', required: true },
  { id: 4, key: 'reference', name: 'Referência', type: 'text', group: 'Gerais' },
  { id: 5, key: 'brand', name: 'Marca', type: 'text', group: 'Gerais' },
  { id: 6, key: 'manufacturer', name: 'Fabricante', type: 'text', group: 'Gerais' },
  { id: 7, key: 'model', name: 'Modelo', type: 'text', group: 'Gerais' },
  { id: 8, key: 'gtin', name: 'GTIN', type: 'text', group: 'Gerais' },
  { id: 9, key: 'ean', name: 'EAN', type: 'text', group: 'Gerais', required: true },
  { id: 10, key: 'ncm', name: 'NCM', type: 'text', group: 'Gerais', required: true },
  { id: 11, key: 'origin', name: 'Origem', type: 'text', group: 'Gerais' },
  { id: 12, key: 'warranty', name: 'Garantia', type: 'text', group: 'Gerais' },

  // Preços
  { id: 13, key: 'price', name: 'Preço', type: 'decimal', group: 'Preços', required: true },
  { id: 14, key: 'sale_price', name: 'Preço Promocional', type: 'decimal', group: 'Preços' },
  { id: 15, key: 'cost', name: 'Custo', type: 'decimal', group: 'Preços' },

  // Estoque
  { id: 16, key: 'stock', name: 'Estoque', type: 'integer', group: 'Estoque', required: true },
  { id: 17, key: 'min_stock', name: 'Estoque Mínimo', type: 'integer', group: 'Estoque' },

  // Dimensões
  { id: 18, key: 'weight', name: 'Peso', type: 'decimal', group: 'Dimensões' },
  { id: 19, key: 'net_weight', name: 'Peso Líquido', type: 'decimal', group: 'Dimensões' },
  { id: 20, key: 'gross_weight', name: 'Peso Bruto', type: 'decimal', group: 'Dimensões' },
  { id: 21, key: 'height', name: 'Altura', type: 'decimal', group: 'Dimensões' },
  { id: 22, key: 'width', name: 'Largura', type: 'decimal', group: 'Dimensões' },
  { id: 23, key: 'length', name: 'Comprimento', type: 'decimal', group: 'Dimensões' },

  // Embalagem
  { id: 24, key: 'package_weight', name: 'Peso Embalagem', type: 'decimal', group: 'Embalagem' },
  { id: 25, key: 'package_height', name: 'Altura Embalagem', type: 'decimal', group: 'Embalagem' },
  { id: 26, key: 'package_width', name: 'Largura Embalagem', type: 'decimal', group: 'Embalagem' },
  { id: 27, key: 'package_length', name: 'Comprimento Embalagem', type: 'decimal', group: 'Embalagem' },

  // SEO
  { id: 28, key: 'meta_title', name: 'Meta Title', type: 'text', group: 'SEO' },
  { id: 29, key: 'meta_description', name: 'Meta Description', type: 'text_long', group: 'SEO' },
  { id: 30, key: 'slug', name: 'Slug', type: 'text', group: 'SEO' },
  { id: 31, key: 'keywords', name: 'Keywords', type: 'text', group: 'SEO' },

  // Categoria
  { id: 32, key: 'category', name: 'Categoria', type: 'relationship', group: 'Categoria', required: true },
  { id: 33, key: 'collection', name: 'Coleção', type: 'relationship', group: 'Categoria' },
  { id: 34, key: 'department', name: 'Departamento', type: 'relationship', group: 'Categoria' },

  // Imagens
  { id: 35, key: 'image_main', name: 'Imagem Principal', type: 'url', group: 'Imagens' },
  { id: 36, key: 'image_2', name: 'Imagem 2', type: 'url', group: 'Imagens' },
  { id: 37, key: 'image_3', name: 'Imagem 3', type: 'url', group: 'Imagens' },
  { id: 38, key: 'image_4', name: 'Imagem 4', type: 'url', group: 'Imagens' },
  { id: 39, key: 'image_5', name: 'Imagem 5', type: 'url', group: 'Imagens' },

  // Variações
  { id: 40, key: 'color', name: 'Cor', type: 'text', group: 'Variações' },
  { id: 41, key: 'size', name: 'Tamanho', type: 'text', group: 'Variações' },
  { id: 42, key: 'grid', name: 'Grade', type: 'text', group: 'Variações' },
  { id: 43, key: 'attribute_1', name: 'Atributo 1', type: 'text', group: 'Variações' },
  { id: 44, key: 'attribute_2', name: 'Atributo 2', type: 'text', group: 'Variações' },
]

// ─── Aliases padrão ──────────────────────────────────────────────────────────

let aliasIdCounter = 200

const defaultAliasesMap = {
  title: ['titulo', 'título', 'name', 'product name', 'item', 'nome', 'nome produto', 'titulo produto', 'nome do produto', 'product title'],
  description: ['descricao', 'descrição', 'desc', 'detalhes', 'product description', 'descricao produto', 'descricao completa'],
  sku: ['sku', 'codigo sku', 'cod sku', 'sku code', 'codigo produto'],
  reference: ['referencia', 'referência', 'ref', 'codigo referencia', 'cod ref', 'reference code'],
  brand: ['marca', 'brand', 'fabricante marca', 'brand name'],
  manufacturer: ['fabricante', 'manufacturer', 'fornecedor', 'supplier'],
  model: ['modelo', 'model', 'model number', 'numero modelo'],
  gtin: ['gtin', 'codigo gtin', 'gtin code', 'global trade item number'],
  ean: ['ean', 'codigo barras', 'código de barras', 'barcode', 'ean code', 'cod barras'],
  ncm: ['ncm', 'codigo ncm', 'ncm code', 'classificacao fiscal'],
  origin: ['origem', 'origin', 'procedencia', 'procedência', 'pais origem'],
  warranty: ['garantia', 'warranty', 'tempo garantia', 'warranty period'],
  price: ['preco', 'preço', 'price', 'valor', 'preco venda', 'preço de venda', 'valor venda', 'selling price'],
  sale_price: ['preco promocional', 'preço promocional', 'sale price', 'promo price', 'preco promo', 'preço oferta', 'desconto'],
  cost: ['custo', 'cost', 'preco custo', 'preço de custo', 'valor custo', 'cost price'],
  stock: ['estoque', 'stock', 'quantidade', 'qty', 'quantity', 'qtd', 'estoque disponivel'],
  min_stock: ['estoque minimo', 'estoque mínimo', 'min stock', 'minimum stock', 'qtd minima'],
  weight: ['peso', 'weight', 'peso kg', 'peso produto'],
  net_weight: ['peso liquido', 'peso líquido', 'net weight', 'peso liq'],
  gross_weight: ['peso bruto', 'gross weight', 'peso total'],
  height: ['altura', 'height', 'alt', 'altura cm'],
  width: ['largura', 'width', 'larg', 'largura cm'],
  length: ['comprimento', 'length', 'comp', 'profundidade', 'depth', 'comprimento cm'],
  package_weight: ['peso embalagem', 'package weight', 'peso pacote', 'peso caixa'],
  package_height: ['altura embalagem', 'package height', 'altura pacote', 'altura caixa'],
  package_width: ['largura embalagem', 'package width', 'largura pacote', 'largura caixa'],
  package_length: ['comprimento embalagem', 'package length', 'comprimento pacote', 'comprimento caixa'],
  meta_title: ['meta title', 'seo title', 'titulo seo', 'título seo', 'meta titulo'],
  meta_description: ['meta description', 'seo description', 'descricao seo', 'meta descricao'],
  slug: ['slug', 'url slug', 'url amigavel', 'friendly url', 'permalink'],
  keywords: ['keywords', 'palavras chave', 'palavras-chave', 'tags', 'seo keywords'],
  category: ['categoria', 'category', 'cat', 'categorias', 'categoria produto', 'product category', 'tipo produto', 'classificacao', 'classificação'],
  collection: ['colecao', 'coleção', 'collection', 'linha', 'linha produto'],
  department: ['departamento', 'department', 'dept', 'setor', 'secao', 'seção'],
  image_main: ['imagem principal', 'main image', 'imagem 1', 'image 1', 'foto principal', 'foto 1', 'img principal'],
  image_2: ['imagem 2', 'image 2', 'foto 2', 'img 2'],
  image_3: ['imagem 3', 'image 3', 'foto 3', 'img 3'],
  image_4: ['imagem 4', 'image 4', 'foto 4', 'img 4'],
  image_5: ['imagem 5', 'image 5', 'foto 5', 'img 5'],
  color: ['cor', 'color', 'colour', 'cor produto'],
  size: ['tamanho', 'size', 'tam', 'medida', 'numeracao', 'numeração'],
  grid: ['grade', 'grid', 'variacao', 'variação', 'grade produto'],
  attribute_1: ['atributo 1', 'attribute 1', 'attr 1', 'caracteristica 1'],
  attribute_2: ['atributo 2', 'attribute 2', 'attr 2', 'caracteristica 2'],
}

// Build aliases data structure
const importFieldAliases = []

// First, create default (system) aliases — one per field using its key
for (const field of importFields) {
  aliasIdCounter++
  importFieldAliases.push({
    id: aliasIdCounter,
    importFieldId: field.id,
    alias: field.key,
    normalizedAlias: normalizeText(field.key),
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  })
}

// Then, create user-defined aliases
for (const [fieldKey, aliases] of Object.entries(defaultAliasesMap)) {
  const field = importFields.find(f => f.key === fieldKey)
  if (!field) continue
  for (const alias of aliases) {
    // Skip if alias matches the field key (already added as default)
    if (normalizeText(alias) === normalizeText(field.key)) continue
    aliasIdCounter++
    importFieldAliases.push({
      id: aliasIdCounter,
      importFieldId: field.id,
      alias,
      normalizedAlias: normalizeText(alias),
      isDefault: false,
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    })
  }
}

// ─── In-memory store ─────────────────────────────────────────────────────────

let fieldsStore = JSON.parse(JSON.stringify(importFields))
let aliasesStore = JSON.parse(JSON.stringify(importFieldAliases))

// ─── Field type labels ───────────────────────────────────────────────────────

export const FIELD_TYPES = {
  text: 'Texto',
  text_long: 'Texto Longo',
  integer: 'Inteiro',
  decimal: 'Decimal',
  url: 'URL',
  relationship: 'Relacionamento',
  boolean: 'Booleano',
  list: 'Lista',
  date: 'Data'
}

// ─── API simulation ──────────────────────────────────────────────────────────

export async function fetchImportFields({ search = '', group = '', type = '', required = '', page = 1, perPage = 15, sortField = 'name', sortOrder = 1 } = {}) {
  await new Promise(r => setTimeout(r, 600))

  let filtered = [...fieldsStore]

  // Filter by search
  if (search) {
    const normalizedSearch = normalizeText(search)
    filtered = filtered.filter(f => {
      // Match by name, key, or group
      if (normalizeText(f.name).includes(normalizedSearch)) return true
      if (normalizeText(f.key).includes(normalizedSearch)) return true
      if (normalizeText(f.group).includes(normalizedSearch)) return true
      // Match by type label
      const typeLabel = FIELD_TYPES[f.type] || f.type
      if (normalizeText(typeLabel).includes(normalizedSearch)) return true
      // Match by aliases
      const fieldAliases = aliasesStore.filter(a => a.importFieldId === f.id)
      if (fieldAliases.some(a => a.normalizedAlias.includes(normalizedSearch))) return true
      return false
    })
  }

  // Filter by group
  if (group) {
    filtered = filtered.filter(f => f.group === group)
  }

  // Filter by type
  if (type) {
    filtered = filtered.filter(f => f.type === type)
  }

  // Filter by required
  if (required === 'yes') {
    filtered = filtered.filter(f => f.required === true)
  } else if (required === 'no') {
    filtered = filtered.filter(f => !f.required)
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[sortField] || ''
    const bVal = b[sortField] || ''
    if (aVal < bVal) return -1 * sortOrder
    if (aVal > bVal) return 1 * sortOrder
    return 0
  })

  // Count aliases for each field and include alias names
  const result = filtered.map(f => {
    const fieldAliases = aliasesStore.filter(a => a.importFieldId === f.id)
    return {
      ...f,
      aliasCount: fieldAliases.length,
      aliasNames: fieldAliases.map(a => a.alias)
    }
  })

  // Paginate
  const total = result.length
  const start = (page - 1) * perPage
  const data = result.slice(start, start + perPage)

  return { data, total, page, perPage }
}

export async function fetchImportFieldById(fieldId) {
  await new Promise(r => setTimeout(r, 400))
  const field = fieldsStore.find(f => f.id === fieldId)
  if (!field) throw new Error('Campo não encontrado.')
  const aliases = aliasesStore.filter(a => a.importFieldId === fieldId)
  return { ...field, aliases }
}

export async function fetchAliasesForField(fieldId) {
  await new Promise(r => setTimeout(r, 400))
  return aliasesStore.filter(a => a.importFieldId === fieldId)
}

export async function addAlias(fieldId, aliasText) {
  await new Promise(r => setTimeout(r, 500))

  const normalized = normalizeText(aliasText)
  if (!normalized) throw new Error('O alias não pode estar vazio.')

  // Check duplicate
  const existing = aliasesStore.find(a => a.normalizedAlias === normalized)
  if (existing) {
    const ownerField = fieldsStore.find(f => f.id === existing.importFieldId)
    throw new Error(`Este alias já está vinculado ao campo "${ownerField?.name || 'desconhecido'}".`)
  }

  aliasIdCounter++
  const newAlias = {
    id: aliasIdCounter,
    importFieldId: fieldId,
    alias: aliasText.trim(),
    normalizedAlias: normalized,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  aliasesStore.push(newAlias)
  return newAlias
}

export async function updateAlias(aliasId, newAliasText) {
  await new Promise(r => setTimeout(r, 400))

  const alias = aliasesStore.find(a => a.id === aliasId)
  if (!alias) throw new Error('Alias não encontrado.')

  // Protect default aliases
  if (alias.isDefault) {
    throw new Error('O alias padrão do sistema não pode ser alterado.')
  }

  const normalized = normalizeText(newAliasText)
  if (!normalized) throw new Error('O alias não pode estar vazio.')

  // Check duplicate (excluding current)
  const existing = aliasesStore.find(a => a.normalizedAlias === normalized && a.id !== aliasId)
  if (existing) {
    const ownerField = fieldsStore.find(f => f.id === existing.importFieldId)
    throw new Error(`Este alias já está vinculado ao campo "${ownerField?.name || 'desconhecido'}".`)
  }

  alias.alias = newAliasText.trim()
  alias.normalizedAlias = normalized
  alias.updatedAt = new Date().toISOString()
  return { ...alias }
}

export async function deleteAlias(aliasId) {
  await new Promise(r => setTimeout(r, 400))
  const idx = aliasesStore.findIndex(a => a.id === aliasId)
  if (idx === -1) throw new Error('Alias não encontrado.')

  // Protect default aliases
  if (aliasesStore[idx].isDefault) {
    throw new Error('O alias padrão do sistema não pode ser excluído.')
  }

  aliasesStore.splice(idx, 1)
}

// ─── Import Field Resolver Service ───────────────────────────────────────────

/**
 * Serviço genérico de resolução de campos.
 * Pode ser utilizado para importação de produtos, clientes, pedidos, etc.
 */
export function resolveFieldFromHeader(headerName) {
  const normalized = normalizeText(headerName)
  if (!normalized) return null

  // Primeiro tenta match exato pela key do campo
  const directMatch = fieldsStore.find(f => normalizeText(f.key) === normalized || normalizeText(f.name) === normalized)
  if (directMatch) return { ...directMatch }

  // Depois busca nos aliases
  const aliasMatch = aliasesStore.find(a => a.normalizedAlias === normalized)
  if (aliasMatch) {
    const field = fieldsStore.find(f => f.id === aliasMatch.importFieldId)
    if (field) return { ...field, matchedAlias: aliasMatch.alias }
  }

  return null
}

/**
 * Resolve múltiplas colunas de uma vez.
 * Retorna um objeto com as colunas mapeadas e as não reconhecidas.
 */
export function resolveHeaders(headers) {
  const mapped = []
  const unresolved = []

  for (const header of headers) {
    const result = resolveFieldFromHeader(header)
    if (result) {
      mapped.push({ header, field: result })
    } else {
      unresolved.push(header)
    }
  }

  return { mapped, unresolved }
}

/**
 * Retorna todos os grupos disponíveis
 */
export function getFieldGroups() {
  const groups = [...new Set(fieldsStore.map(f => f.group))]
  return groups.sort()
}

/**
 * Retorna contagem de campos por grupo
 */
export function getFieldCountsByGroup() {
  const counts = {}
  for (const f of fieldsStore) {
    counts[f.group] = (counts[f.group] || 0) + 1
  }
  return counts
}

/**
 * Retorna indicadores (KPIs) do estado dos mapeamentos
 */
export async function fetchImportFieldsKpis() {
  await new Promise(r => setTimeout(r, 300))
  const totalFields = fieldsStore.length
  const totalAliases = aliasesStore.length
  const fieldsWithAlias = new Set(aliasesStore.map(a => a.importFieldId))
  const fieldsWithoutAlias = totalFields - fieldsWithAlias.size
  const totalGroups = new Set(fieldsStore.map(f => f.group)).size
  const coveragePercent = totalFields > 0 ? Math.round((fieldsWithAlias.size / totalFields) * 100) : 0

  return { totalFields, totalAliases, fieldsWithoutAlias, totalGroups, coveragePercent }
}
