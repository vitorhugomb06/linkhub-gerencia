# Requirements Document

## Introduction

Este documento descreve os requisitos funcionais e não-funcionais do módulo **Configurações Logísticas por Marketplace** da plataforma LinkHub. O módulo permite que o usuário visualize e configure quais modalidades logísticas estão habilitadas para cada marketplace integrado. Segue o padrão visual e estrutural da tela de Gestão de Etiquetas, utilizando layout split (lista à esquerda + painel à direita), design system PrimeVue/Aura e os componentes CSS já definidos no projeto.

---

## Glossary

- **Sistema**: O módulo de Configurações Logísticas por Marketplace da plataforma LinkHub.
- **LogisticSettingsPage**: Componente de página raiz do módulo que coordena o estado global.
- **MarketplaceList**: Componente do painel esquerdo que exibe a lista de marketplaces disponíveis.
- **LogisticPanel**: Componente do painel direito que exibe as logísticas do marketplace selecionado.
- **LogisticItem**: Componente accordion que representa uma logística individual.
- **Marketplace**: Plataforma de e-commerce integrada (ex.: Mercado Livre, Shopee, Amazon).
- **Logistica**: Modalidade logística disponível para um marketplace específico.
- **Switch**: Componente `InputSwitch` do PrimeVue que representa o estado ativo/inativo de uma logística.
- **Mock**: Camada de simulação de dados (`logisticsMock.js`) utilizada enquanto não há backend real integrado.
- **Toast**: Componente de notificação temporária exibida no canto superior direito da tela.
- **Skeleton**: Componente de placeholder visual exibido durante o carregamento de dados.
- **Status_Ativo**: Valor `'Ativo'` do campo `status` de uma logística — indica que a logística está operacional no marketplace.
- **Status_Inativo**: Valor `'Inativo'` do campo `status` de uma logística — indica que a logística não está operacional no marketplace.

---

## Requirements

### Requisito 1: Navegação e Acesso ao Módulo

**User Story:** Como usuário da plataforma, quero acessar o módulo de Configurações Logísticas pelo menu lateral, para que eu possa gerenciar as logísticas dos marketplaces integrados.

#### Critérios de Aceite

1. THE Sistema SHALL disponibilizar uma rota `/configuracoes-logisticas` acessível via item de menu na sidebar com o ícone `pi pi-truck` e o rótulo "Config. Logísticas".
2. WHEN o usuário acessa `/configuracoes-logisticas`, THE LogisticSettingsPage SHALL renderizar o layout split com o painel esquerdo de marketplaces e o painel direito de logísticas.
3. THE Sistema SHALL exibir breadcrumb com o caminho "Home > Configurações Logísticas" na parte superior da página.

---

### Requisito 2: Carregamento e Exibição de Marketplaces

**User Story:** Como usuário, quero visualizar todos os marketplaces integrados, para que eu possa selecionar em qual deles desejo configurar as logísticas.

#### Critérios de Aceite

1. WHEN a LogisticSettingsPage é montada, THE Sistema SHALL chamar `fetchMarketplaces()` e exibir o resultado na MarketplaceList.
2. WHILE `fetchMarketplaces()` está em andamento, THE MarketplaceList SHALL exibir um Skeleton com 5 linhas de placeholder no painel esquerdo.
3. WHEN `fetchMarketplaces()` é concluído com sucesso e a lista contém ao menos um marketplace, THE MarketplaceList SHALL exibir cada marketplace com sua logo, nome e contagem de logísticas disponíveis.
4. WHEN `fetchMarketplaces()` é concluído e retorna lista vazia, THE MarketplaceList SHALL exibir um estado vazio com ícone, título "Nenhum marketplace" e descrição informativa.
5. IF `fetchMarketplaces()` falhar, THEN THE Sistema SHALL exibir um Toast de erro informando a falha e manter a lista de marketplaces vazia.

---

### Requisito 3: Seleção de Marketplace e Carregamento de Logísticas

**User Story:** Como usuário, quero selecionar um marketplace para visualizar as logísticas configuradas nele, para que eu possa gerenciar cada uma individualmente.

#### Critérios de Aceite

1. WHEN o usuário clica em um marketplace na MarketplaceList, THE Sistema SHALL marcar o item como selecionado com destaque visual e chamar `fetchLogisticsForMarketplace(marketplace.id)`.
2. WHILE `fetchLogisticsForMarketplace()` está em andamento, THE LogisticPanel SHALL exibir um Skeleton de placeholder no painel direito.
3. WHEN `fetchLogisticsForMarketplace()` é concluído com sucesso e a lista contém ao menos uma logística, THE LogisticPanel SHALL exibir cada logística como um item accordion no painel direito.
4. WHEN `fetchLogisticsForMarketplace()` retorna lista vazia, THE LogisticPanel SHALL exibir um estado vazio com mensagem amigável informando a ausência de logísticas para o marketplace selecionado.
5. IF `fetchLogisticsForMarketplace()` falhar, THEN THE Sistema SHALL exibir um Toast de erro e manter o painel direito em estado vazio.
6. WHEN nenhum marketplace está selecionado, THE LogisticPanel SHALL exibir uma mensagem orientando o usuário a selecionar um marketplace no painel esquerdo.

---

### Requisito 4: Exibição dos Dados de Logística (Header do Accordion)

**User Story:** Como usuário, quero visualizar as informações resumidas de cada logística no cabeçalho do accordion, para que eu possa identificar e controlar cada modalidade sem precisar expandi-la.

#### Critérios de Aceite

1. THE LogisticItem SHALL exibir no cabeçalho (estado recolhido) o nome da logística, o ID da logística, uma Tag de status (com severidade diferenciada para `Status_Ativo` e `Status_Inativo`) e o Switch de ativação.
2. THE LogisticItem SHALL renderizar a Tag de status com severidade `'success'` quando `logistica.status === 'Ativo'` e severidade `'secondary'` quando `logistica.status === 'Inativo'`.

---

### Requisito 5: Expansão e Visualização de Detalhes da Logística

**User Story:** Como usuário, quero expandir um item de logística para visualizar todos os seus dados técnicos, para que eu possa tomar decisões informadas sobre sua ativação.

#### Critérios de Aceite

1. WHEN o usuário clica no cabeçalho de um LogisticItem, THE LogisticItem SHALL alternar entre os estados expandido e recolhido de forma independente dos demais itens.
2. WHEN um LogisticItem está expandido, THE LogisticItem SHALL exibir os campos: Peso Mínimo, Peso Máximo, Altura, Largura, Profundidade, Cubagem Máxima, Volume Mínimo, Volume Máximo e Descrição.
3. WHEN uma logística com `Status_Inativo` é expandida pelo usuário, THE LogisticItem SHALL exibir todos os campos de detalhe normalmente, sem qualquer restrição de visualização.

---

### Requisito 6: Ativação e Desativação de Logísticas

**User Story:** Como usuário, quero ativar ou desativar logísticas individualmente para um marketplace, para que eu possa controlar quais modalidades estão habilitadas na operação.

#### Critérios de Aceite

1. WHEN o usuário aciona o Switch de uma logística com `Status_Ativo`, THE Sistema SHALL chamar `saveLogisticEnabled(marketplaceId, logisticaId, novoValor)` e atualizar o estado local otimisticamente de imediato.
2. WHEN `saveLogisticEnabled()` é concluído com sucesso, THE Sistema SHALL exibir um Toast de sucesso com a mensagem "Configuração salva com sucesso".
3. IF `saveLogisticEnabled()` falhar, THEN THE Sistema SHALL exibir um Toast de erro e reverter o Switch ao valor anterior ao toggle (rollback otimístico).
4. WHILE `saveLogisticEnabled()` está em andamento, THE LogisticItem SHALL exibir o Switch em estado de salvamento (desabilitado durante a operação de persistência).

---

### Requisito 7: Comportamento de Logísticas com Status Inativo

**User Story:** Como usuário, quero que logísticas inativas no marketplace sejam claramente diferenciadas visualmente e bloqueadas para interação, para que eu não tente configurar modalidades que não estão operacionais.

#### Critérios de Aceite

1. WHEN uma logística com `Status_Inativo` é renderizada, THE LogisticItem SHALL aplicar opacidade reduzida (`opacity: 0.5`) ao item inteiro para diferenciação visual.
2. WHEN uma logística com `Status_Inativo` é renderizada, THE LogisticItem SHALL manter o Switch com `disabled = true`, impedindo qualquer interação do usuário.
3. WHEN o usuário passa o cursor sobre o Switch desabilitado de uma logística com `Status_Inativo`, THE LogisticItem SHALL exibir um Tooltip com o texto "Esta logística está inativa no marketplace e não pode ser configurada."
4. WHEN o usuário clica sobre o Switch desabilitado de uma logística com `Status_Inativo`, THE Sistema SHALL não executar nenhuma ação e não chamar `saveLogisticEnabled()`.
5. WHILE `logistica.status === 'Inativo'`, THE Sistema SHALL manter o estado `logistica.enabled` ignorado para fins de interação na UI, independentemente do valor armazenado.

---

### Requisito 8: Persistência das Configurações Entre Sessões

**User Story:** Como usuário, quero que as configurações que salvei sejam mantidas ao retornar à tela, para que minhas preferências não se percam entre acessos.

#### Critérios de Aceite

1. WHEN o usuário acessa novamente `/configuracoes-logisticas` e seleciona um marketplace já configurado anteriormente, THE Sistema SHALL retornar os valores de `enabled` correspondentes ao último estado salvo com sucesso.
2. THE Mock SHALL simular a persistência retornando o valor de `enabled` previamente salvo via `saveLogisticEnabled()` nas chamadas subsequentes de `fetchLogisticsForMarketplace()`.

---

### Requisito 9: Feedback Visual Durante Carregamentos

**User Story:** Como usuário, quero ver indicadores visuais de carregamento em todas as operações assíncronas, para que eu saiba que o sistema está processando minha solicitação.

#### Critérios de Aceite

1. WHILE qualquer operação assíncrona de carregamento de dados (`fetchMarketplaces`, `fetchLogisticsForMarketplace`) está em andamento, THE Sistema SHALL exibir componentes Skeleton nos painéis correspondentes, prevenindo layout shift.
2. WHEN uma operação de toggle é iniciada e está aguardando resposta de `saveLogisticEnabled()`, THE LogisticItem SHALL desabilitar o Switch até a conclusão da operação.
3. WHEN qualquer operação assíncrona é concluída com sucesso ou falha, THE Sistema SHALL remover os indicadores de carregamento e exibir o estado final correspondente.

---

### Requisito 10: Extensibilidade e Reutilização

**User Story:** Como desenvolvedor, quero que o módulo seja estruturado de forma reutilizável e extensível, para que novos marketplaces e logísticas possam ser adicionados sem alterações estruturais no frontend.

#### Critérios de Aceite

1. THE Sistema SHALL implementar a interface `Marketplace` com os campos `id`, `name`, `logo`, `color` e `logisticsCount`, permitindo adição de novos marketplaces apenas via dados.
2. THE Sistema SHALL implementar a interface `Logistica` com os campos `id`, `name`, `status`, `enabled`, `minWeight`, `maxWeight`, `height`, `width`, `depth`, `maxCubicVolume`, `minVolume`, `maxVolume` e `description`, suportando novas modalidades sem alteração de componentes.
3. THE MarketplaceList SHALL aceitar um array genérico de `Marketplace[]` via prop, sem dependência de marketplaces específicos hardcodados no componente.
4. THE LogisticPanel SHALL aceitar um array genérico de `Logistic[]` via prop, sem dependência de modalidades logísticas específicas hardcodadas no componente.
