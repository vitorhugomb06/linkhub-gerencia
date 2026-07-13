import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import Tooltip from 'primevue/tooltip'

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './assets/main.css'

import App from './App.vue'
import LabelManagementPage from './pages/LabelManagementPage.vue'
import ProductsPage from './pages/ProductsPage.vue'
import OrderDetailPage from './pages/OrderDetailPage.vue'
import LogisticSettingsPage from './pages/LogisticSettingsPage.vue'
import ProductStockPage from './pages/ProductStockPage.vue'
import VendasPorCanalPage from './pages/VendasPorCanalPage.vue'
import RelatoriosPage from './pages/RelatoriosPage.vue'
import ProdutosMaisVendidosPage from './pages/ProdutosMaisVendidosPage.vue'
import VendasAnuaisPage from './pages/VendasAnuaisPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/etiquetas' },
    { path: '/etiquetas', component: LabelManagementPage },
    { path: '/produtos', component: ProductsPage },
    { path: '/produtos/estoque', component: ProductStockPage },
    { path: '/pedidos', component: ProductsPage },
    { path: '/pedidos/:id', component: OrderDetailPage },
    { path: '/pedido-detalhe', component: OrderDetailPage },
    { path: '/configuracoes-logisticas', component: LogisticSettingsPage },
    { path: '/relatorios', component: RelatoriosPage },
    { path: '/relatorios/vendas-por-canal', component: VendasPorCanalPage },
    { path: '/relatorios/produtos-mais-vendidos', component: ProdutosMaisVendidosPage },
    { path: '/relatorios/vendas-anuais', component: VendasAnuaisPage },
  ]
})

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode',
      cssLayer: false
    }
  }
})
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)
app.directive('tooltip', Tooltip)

app.mount('#app')
