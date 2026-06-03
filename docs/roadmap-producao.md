# Motiva ORION Mobile - Roadmap de Produção

Este documento descreve a execução para transformar a base atual em um aplicativo pronto para publicação na Google Play Store.

## Estado atual

Já implementado no repositório:

- Expo + TypeScript
- React Navigation com stack e tabs
- Context API com persistência local via AsyncStorage
- Dashboard operacional
- Lista e detalhe de trechos
- Fluxo de inspeção com câmera e localização
- Mocks de trechos, ocorrências e inspeções
- Motor local de priorização ORION
- UX corporativa base

## Fase 1 - Dados e sincronização

Objetivo: substituir a base mock por uma fonte real sem perder a experiência offline.

Entregas:

- Criar camada `services/api`
- Centralizar contratos em `types/api`
- Migrar consultas para TanStack Query
- Manter cache persistido em AsyncStorage
- Implementar mutações com fila offline
- Reprocessar estado local após sucesso na API
- Padronizar erros de rede, timeout e retry

Critério de pronto:

- Dados carregam da API quando online
- App continua funcional offline com cache persistido
- Falhas de rede não quebram a navegação principal

## Fase 2 - Autenticação e proteção

Objetivo: garantir acesso controlado e armazenamento seguro de credenciais.

Entregas:

- Tela de login
- Autenticação com JWT ou OAuth2
- Storage seguro para tokens
- Refresh token com expiração controlada
- Logout limpo com revogação local

Critério de pronto:

- Usuário autenticado acessa apenas conteúdo autorizado
- Tokens não ficam em AsyncStorage
- Sessão expira com tratamento previsível

## Fase 3 - UX e acessibilidade

Objetivo: elevar a experiência para padrão de uso em campo.

Entregas:

- Feedback unificado com toast/snackbar
- Validação de formulário com feedback inline
- Estados de loading, empty, error e retry em todas as telas
- Revisão de `accessibilityLabel`, `accessibilityHint` e `accessibilityRole`
- Consistência visual em botões, inputs, chips e cards

Critério de pronto:

- Fluxo sem `Alert.alert` para ações rotineiras
- Navegação e formulários utilizáveis com leitor de tela
- Componentes visuais padronizados

## Fase 4 - Performance

Objetivo: preparar listas, imagens e bundle para uso em produção.

Entregas:

- Ajustar `FlatList` com parâmetros de performance
- Compressão e otimização de imagens
- Revisão de dependências e remoção de módulos não utilizados
- Análise de bundle e assets

Critério de pronto:

- Lista fluida em datasets maiores
- Imagens não comprometem a experiência
- Build menor e mais previsível

## Fase 5 - Google Play Store

Objetivo: deixar o app apto para submissão.

Entregas:

- Configurar `eas.json` com profiles de development, preview e production
- Gerar `.aab` para release
- Revisar `app.json` com ícone, splash, permissões e package id
- Preparar assets da loja
- Publicar política de privacidade e termos de uso
- Definir Data Safety
- Validar target SDK exigido pela Play Store

Observação:

- Para novas apps e updates, a Google Play exige target Android 15 / API 35 ou superior desde 31 de agosto de 2025.

Critério de pronto:

- Build de produção gerada com sucesso
- Metadados de loja completos
- Conformidade mínima com políticas da Play Console

## Fase 6 - Monitoramento e testes

Objetivo: aumentar confiança operacional e reduzir regressões.

Entregas:

- Sentry para erros
- Analytics para eventos críticos
- Testes unitários de regras e contexto
- Testes de integração do fluxo principal
- Smoke tests de UI

Critério de pronto:

- Falhas rastreáveis
- Fluxo principal coberto
- Releases com menor risco de regressão

## Ordem recomendada de execução

1. API real e cache offline
2. autenticação segura
3. UX e acessibilidade
4. performance
5. Play Store readiness
6. monitoramento e testes

## Fora do escopo atual

- Backend FastAPI
- PostgreSQL
- IA ORION
- Planejamento operacional avançado

Esses itens entram depois que a base de produção estiver estável.
