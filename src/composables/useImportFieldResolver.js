/**
 * Composable para resolução de campos de importação.
 *
 * Serviço genérico e reutilizável para qualquer tipo de importação:
 * - Produtos
 * - Clientes
 * - Pedidos
 * - Categorias
 * - Fornecedores
 * - Transportadoras
 * - Anúncios
 *
 * Uso:
 *   const { resolveHeader, resolveAllHeaders, normalizeText } = useImportFieldResolver()
 *   const result = resolveHeader('Nome Produto')
 *   // => { field: { id, key, name, type, group }, matchedAlias: 'nome produto' }
 */

import { ref } from 'vue'
import {
  resolveFieldFromHeader,
  resolveHeaders,
  normalizeText,
  addAlias
} from '../mocks/importFieldsMock.js'

export function useImportFieldResolver() {
  const unresolvedColumns = ref([])
  const resolvedColumns = ref([])

  /**
   * Resolve uma única coluna do cabeçalho
   * @param {string} headerName - Nome da coluna no arquivo importado
   * @returns {object|null} Campo encontrado ou null
   */
  function resolveHeader(headerName) {
    return resolveFieldFromHeader(headerName)
  }

  /**
   * Resolve todas as colunas de uma vez.
   * Atualiza os refs internos de colunas resolvidas e não resolvidas.
   * @param {string[]} headers - Array de nomes de colunas do arquivo
   * @returns {{ mapped: Array, unresolved: Array }}
   */
  function resolveAllHeaders(headers) {
    const result = resolveHeaders(headers)
    resolvedColumns.value = result.mapped
    unresolvedColumns.value = result.unresolved
    return result
  }

  /**
   * Salva um novo alias para um campo (quando o usuário mapeia manualmente
   * uma coluna desconhecida e opta por salvar para futuras importações).
   * @param {number} fieldId - ID do campo interno
   * @param {string} aliasText - Texto do alias a salvar
   * @returns {Promise<object>} Alias criado
   */
  async function saveNewAlias(fieldId, aliasText) {
    return await addAlias(fieldId, aliasText)
  }

  /**
   * Limpa o estado
   */
  function reset() {
    unresolvedColumns.value = []
    resolvedColumns.value = []
  }

  return {
    // State
    unresolvedColumns,
    resolvedColumns,

    // Methods
    resolveHeader,
    resolveAllHeaders,
    saveNewAlias,
    normalizeText,
    reset
  }
}
