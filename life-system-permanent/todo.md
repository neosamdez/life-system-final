# Life System - Todo List

## Fase 1: Arquitetura e Planejamento

- [x] Inicializar projeto com scaffold web-db-user
- [ ] Definir schema do banco de dados completo
- [ ] Criar modelos tRPC para todas as entidades

## Fase 2: Banco de Dados

- [ ] Criar tabela `users` com campos de perfil
- [ ] Criar tabela `playerStats` com atributos (strength, intelligence, charisma, vitality, wisdom, agility)
- [ ] Criar tabela `quests` com status e dificuldade
- [ ] Criar tabela `transactions` para movimentações financeiras
- [ ] Criar tabela `categories` para categorização de despesas/receitas
- [ ] Executar migrações com `pnpm db:push`

## Fase 3: API tRPC - Quests

- [ ] Implementar `quests.create` - criar nova quest
- [ ] Implementar `quests.list` - listar quests do usuário
- [ ] Implementar `quests.getActive` - listar quests ativas
- [ ] Implementar `quests.complete` - completar quest com cálculo de XP
- [ ] Implementar `quests.fail` - marcar quest como falha
- [ ] Implementar `quests.cancel` - cancelar quest
- [ ] Implementar `quests.delete` - deletar quest

## Fase 4: API tRPC - Gamificação

- [ ] Implementar `player.getStats` - retornar estatísticas do jogador
- [ ] Implementar `player.getAttributes` - retornar detalhes de atributos
- [ ] Implementar `player.getLeaderboard` - ranking de jogadores
- [ ] Implementar lógica de XP por dificuldade (Easy: 10, Medium: 25, Hard: 50, Epic: 100)
- [ ] Implementar lógica de Level Up automático
- [ ] Implementar sistema de Streaks (dias consecutivos)
- [ ] Implementar cálculo de XP necessário por nível

## Fase 5: API tRPC - Finanças

- [ ] Implementar `finance.createTransaction` - registrar transação
- [ ] Implementar `finance.listTransactions` - listar transações com filtros
- [ ] Implementar `finance.deleteTransaction` - deletar transação
- [ ] Implementar `finance.getCategories` - listar categorias
- [ ] Implementar `finance.createCategory` - criar categoria customizada
- [ ] Implementar `finance.getMonthlySummary` - resumo mensal
- [ ] Implementar `finance.getTrends` - tendências de gastos

## Fase 6: Frontend - Layout e Navegação

- [ ] Criar DashboardLayout com sidebar
- [ ] Implementar navegação principal (Dashboard, Quests, Finance, Profile)
- [ ] Criar tema Cyberpunk com cores neon
- [ ] Definir paleta de cores (primária, secundária, neon)
- [ ] Implementar tipografia e espaçamento

## Fase 7: Frontend - Dashboard

- [ ] Criar componente de estatísticas do jogador (level, XP, streak)
- [ ] Criar visualização de 6 atributos com barras de progresso
- [ ] Implementar card de quests ativas
- [ ] Implementar resumo financeiro rápido
- [ ] Adicionar animação de carregamento com tema neon

## Fase 8: Frontend - Sistema de Quests

- [ ] Criar modal de criação de quest
- [ ] Implementar seletor de dificuldade (Easy, Medium, Hard, Epic)
- [ ] Implementar seletor de atributo associado
- [ ] Criar lista de quests ativas com ações (complete, fail, cancel)
- [ ] Implementar animação ao completar quest
- [ ] Criar overlay de Level Up com efeitos neon

## Fase 9: Frontend - Animações de Level Up

- [ ] Criar componente LevelUpOverlay com animação em tela cheia
- [ ] Implementar efeitos neon (glow, pulse, particles)
- [ ] Adicionar som de Level Up (opcional)
- [ ] Implementar transição suave para o dashboard

## Fase 10: Frontend - Módulo Financeiro

- [ ] Criar página de transações com CRUD
- [ ] Implementar filtros por categoria e período
- [ ] Criar gráfico de despesas vs receitas
- [ ] Implementar gráfico de tendências mensais
- [ ] Adicionar resumo de categorias

## Fase 11: Frontend - Perfil e Configurações

- [ ] Criar página de perfil do jogador
- [ ] Implementar visualização de estatísticas completas
- [ ] Adicionar opção de logout
- [ ] Criar página de leaderboard

## Fase 12: Testes e Validação

- [ ] Testar fluxo completo de criação de quest
- [ ] Testar cálculo de XP e Level Up
- [ ] Testar sistema de streaks
- [ ] Testar CRUD de transações
- [ ] Testar responsividade do dashboard
- [ ] Validar animações de Level Up

## Fase 13: Entrega

- [ ] Criar checkpoint final
- [ ] Documentar instruções de uso
- [ ] Preparar para publicação
