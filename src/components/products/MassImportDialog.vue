<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="true"
    :draggable="false"
    :style="{ width: '800px', maxWidth: '95vw' }"
    :pt="{ header: { style: 'padding: 20px 24px 0 24px; border: none;' }, content: { style: 'padding: 0 24px 16px 24px;' }, footer: { style: 'padding: 0 24px 20px 24px; border: none;' } }"
  >
    <template #header>
      <div class="mass-import-header">
        <span class="mass-import-title">Importação em Massa</span>
      </div>
    </template>

    <!-- Tipo de Importação -->
    <div class="mass-import-body">
      <div class="mass-import-field">
        <label class="mass-import-label">Tipo de Importação</label>
        <Select
          v-model="tipoImportacao"
          :options="tiposImportacao"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecione..."
          class="mass-import-select"
        />
      </div>

      <!-- Método de Identificação do produto (apenas para Planilha de Preço) -->
      <div class="mass-import-field" v-if="tipoImportacao === 'preco'">
        <label class="mass-import-label">Método de Identificação do produto</label>
        <div class="mass-import-methods">
          <div
            class="mass-import-method"
            :class="{ 'mass-import-method--active': metodoIdentificacao === 'sku' }"
            @click="metodoIdentificacao = 'sku'"
          >
            <div class="mass-import-method__radio">
              <span class="mass-import-method__dot" v-if="metodoIdentificacao === 'sku'"></span>
            </div>
            <div class="mass-import-method__content">
              <span class="mass-import-method__title">SKU</span>
              <span class="mass-import-method__desc">Identificação por SKU (Padrão)</span>
            </div>
          </div>
          <div
            class="mass-import-method"
            :class="{ 'mass-import-method--active': metodoIdentificacao === 'ean' }"
            @click="metodoIdentificacao = 'ean'"
          >
            <div class="mass-import-method__radio">
              <span class="mass-import-method__dot" v-if="metodoIdentificacao === 'ean'"></span>
            </div>
            <div class="mass-import-method__content">
              <span class="mass-import-method__title">EAN</span>
              <span class="mass-import-method__desc">Identificação por EAN</span>
            </div>
          </div>
          <div
            class="mass-import-method"
            :class="{ 'mass-import-method--active': metodoIdentificacao === 'sku_erp' }"
            @click="metodoIdentificacao = 'sku_erp'"
          >
            <div class="mass-import-method__radio">
              <span class="mass-import-method__dot" v-if="metodoIdentificacao === 'sku_erp'"></span>
            </div>
            <div class="mass-import-method__content">
              <span class="mass-import-method__title">SKU ERP</span>
              <span class="mass-import-method__desc">Identificação por SKU ERP</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content varies by tipo de importação -->

      <!-- Planilha de Preço -->
      <template v-if="tipoImportacao === 'preco'">
        <div class="mass-import-preview">
          <div class="mass-import-preview__header">
            <span class="mass-import-preview__col mass-import-preview__col--id">PRODUCT_ID</span>
            <span class="mass-import-preview__col mass-import-preview__col--price">PRICE</span>
          </div>
          <div class="mass-import-preview__row">
            <span class="mass-import-preview__col mass-import-preview__col--id">Insira o SKU do seu produto</span>
            <span class="mass-import-preview__col mass-import-preview__col--price">73.22</span>
          </div>
        </div>

        <div class="mass-import-obs">
          <span class="mass-import-obs__title">Observações</span>
          <ul class="mass-import-obs__list">
            <li>É obrigatório o preenchimento do campos <strong>PRODUCT_ID</strong> para identificação do produto;</li>
            <li>Por padrão os valores deverão utilizar "." (ponto) como separador decimal <strong>no campo price</strong>;</li>
            <li>O arquivo deve possuir o formato <strong>.csv</strong> ou <strong>.xls</strong>;</li>
            <li>É obrigatório escolher qual tipo de importação irá realizar <strong>(SKU, EAN ou SKU_ERP)</strong></li>
          </ul>
        </div>
      </template>

      <!-- Cadastro de Produtos -->
      <template v-if="tipoImportacao === 'cadastro'">
        <div class="mass-import-mapping-notice">
          <i class="pi pi-info-circle mass-import-mapping-notice__icon"></i>
          <span>Caso utilize uma planilha que não seja o modelo padrão do sistema, realize o mapeamento dos campos na tela de <a href="/produtos/importacoes/de-para-campos" class="mass-import-mapping-notice__link" @click.prevent="goToMapping">mapeamentos</a>.</span>
        </div>

        <div class="mass-import-obs">
          <span class="mass-import-obs__title">Observações</span>
          <ul class="mass-import-obs__list">
            <li>O preenchimento dos campos obrigatórios é indispensável para a importação;</li>
            <li>Utilize o modelo de planilha disponibilizado pelo sistema;</li>
            <li>Os campos de imagem devem conter URLs públicas válidas;</li>
            <li>Os valores monetários devem utilizar "." como separador decimal;</li>
            <li>O arquivo deve possuir formato <strong>.csv .xls</strong>;</li>
            <li>Para planilhas fora do padrão, realize o <a href="/produtos/importacoes/de-para-campos" class="mass-import-obs__link" @click.prevent="goToMapping">mapeamento</a> dos campos previamente.</li>
          </ul>
        </div>
      </template>

      <!-- Action Buttons -->
      <div class="mass-import-actions">
        <button class="mass-import-btn mass-import-btn--example">
          <i class="pi pi-file"></i>
          <span>Exemplo de Preenchimento</span>
        </button>
        <button class="mass-import-btn mass-import-btn--upload">
          <i class="pi pi-upload"></i>
          <span>Carregar Arquivo</span>
        </button>
      </div>
    </div>

    <template #footer>
      <div class="mass-import-footer">
        <button class="mass-import-btn-footer mass-import-btn-footer--cancel" @click="visible = false">
          Cancelar
        </button>
        <button class="mass-import-btn-footer mass-import-btn-footer--simulate">
          Simular
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'

const router = useRouter()

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)

watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))

const tipoImportacao = ref('preco')
const metodoIdentificacao = ref('sku')

const tiposImportacao = [
  { label: 'Planilha de Preço', value: 'preco' },
  { label: 'Cadastro de Produtos', value: 'cadastro' },
]

const categoriasCadastro = [
  {
    label: 'Informações Básicas',
    fields: ['SKU Grupo', 'Nome', 'Nome Curto', 'Descrição', 'Marca', 'Modelo', 'Status', 'Referência'],
  },
  {
    label: 'Classificação',
    fields: ['Categoria', 'Subcategoria', 'Categoria Final'],
  },
  {
    label: 'Comercial',
    fields: ['Preço', 'Preço de Lista'],
  },
  {
    label: 'Dimensões',
    fields: ['Peso', 'Altura', 'Largura', 'Comprimento', 'Volumes'],
  },
  {
    label: 'Fiscal',
    fields: ['NCM', 'EAN'],
  },
  {
    label: 'Características',
    fields: ['Característica Principal', 'Característica Secundária', 'Gênero', 'Garantia'],
  },
  {
    label: 'Imagens',
    fields: ['Imagens (1–9)'],
  },
]

function goToMapping() {
  visible.value = false
  router.push('/produtos/importacoes/de-para-campos')
}
</script>

<style scoped>
.mass-import-header {
  display: flex;
  align-items: center;
  width: 100%;
}

.mass-import-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'Poppins', sans-serif;
}

.mass-import-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mass-import-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mass-import-label {
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
  font-family: 'Poppins', sans-serif;
}

.mass-import-select {
  width: 100%;
}

/* PrimeVue Select overrides - usar azul do sistema */
:deep(.p-select:focus),
:deep(.p-select.p-focus),
:deep(.p-select:focus-within) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

:deep(.p-select-option.p-select-option-selected),
:deep(.p-select-option.p-focus),
:deep(.p-select-option:focus),
:deep(.p-select-option.p-highlight) {
  background: #eff6ff !important;
  color: #3b82f6 !important;
}

:deep(.p-select-option:hover) {
  background: #eff6ff !important;
}
/* Métodos de identificação */
.mass-import-methods {
  display: flex;
  gap: 8px;
}

.mass-import-method {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.mass-import-method:hover {
  border-color: #93c5fd;
}

.mass-import-method--active {
  background: #eff6ff;
  border-color: #3b82f6;
}

.mass-import-method__radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mass-import-method--active .mass-import-method__radio {
  border-color: #3b82f6;
}

.mass-import-method__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
}

.mass-import-method__content {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.mass-import-method__title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Poppins', sans-serif;
}

.mass-import-method__desc {
  font-size: 16px;
  color: #64748b;
  font-family: 'Poppins', sans-serif;
}

/* Preview Planilha de Preço */
.mass-import-preview {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.mass-import-preview__header {
  display: flex;
  background: #3b82f6;
  padding: 8px 14px;
}

.mass-import-preview__row {
  display: flex;
  padding: 8px 14px;
  background: #f0f9ff;
  border-top: 1px solid #e2e8f0;
}

.mass-import-preview__col {
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
}

.mass-import-preview__col--id {
  flex: 1;
  font-weight: 500;
}

.mass-import-preview__col--price {
  width: 80px;
  text-align: right;
  font-weight: 600;
}

.mass-import-preview__header .mass-import-preview__col {
  color: #ffffff;
  font-weight: 600;
}

.mass-import-preview__row .mass-import-preview__col--id {
  color: #64748b;
}

.mass-import-preview__row .mass-import-preview__col--price {
  color: #1e293b;
}

/* Chips */
.mass-import-chips-container {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.mass-import-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mass-import-chip {
  display: inline-flex;
  align-items: center;
  gap: 0;
  padding: 5px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #1e293b;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
}

.mass-import-chip__icon {
  display: none;
}

/* Observações */
.mass-import-obs {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mass-import-obs__title {
  font-size: 16px;
  font-weight: 700;
  color: #ef4444;
  font-family: 'Poppins', sans-serif;
}

.mass-import-obs__list {
  margin: 0;
  padding-left: 28px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  list-style-type: disc;
}

.mass-import-obs__list li {
  font-size: 16px;
  color: #1e293b;
  font-family: 'Poppins', sans-serif;
  line-height: 1.4;
  padding-left: 4px;
}

.mass-import-obs__link {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.mass-import-obs__link:hover {
  color: #2563eb;
}

/* Action Buttons */
.mass-import-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.mass-import-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
  border: none;
}

.mass-import-btn--example {
  background: #3b82f6;
  color: #ffffff;
}

.mass-import-btn--example:hover {
  background: #2563eb;
}

.mass-import-btn--upload {
  background: #3b82f6;
  color: #ffffff;
}

.mass-import-btn--upload:hover {
  background: #2563eb;
}

.mass-import-btn i {
  font-size: 12px;
}

/* Footer Buttons */
.mass-import-footer {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: center;
}

.mass-import-btn-footer {
  flex: none;
  width: 373.75px;
  height: 40.98px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  border: none;
  transition: background 0.15s;
  border-radius: 8px;
}

.mass-import-btn-footer--cancel {
  background: #f1f5f9;
  color: #64748b;
}

.mass-import-btn-footer--cancel:hover {
  background: #e2e8f0;
}

.mass-import-btn-footer--simulate {
  background: #3b82f6;
  color: #ffffff;
}

.mass-import-btn-footer--simulate:hover {
  background: #2563eb;
}

/* Mapping notice */
.mass-import-mapping-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
}

.mass-import-mapping-notice__icon {
  font-size: 16px;
  color: #3b82f6;
  margin-top: 2px;
  flex-shrink: 0;
}

.mass-import-mapping-notice span {
  font-size: 14px;
  color: #1e293b;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;
}

.mass-import-mapping-notice__link {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.mass-import-mapping-notice__link:hover {
  color: #2563eb;
}
</style>
