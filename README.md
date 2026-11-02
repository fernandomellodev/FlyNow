# FlyNow · Minha Lista de Viagem & Painel de Desejos
> **Laboratório de Programação Front-End** · Engenharia de Software · 2026.2  
> **Universidade de Vassouras (FUSVE)** — Campus Saquarema  
> **Docente:** Laís Cristine Bordallo Pinheiro  
> **Atualização:** Aula 10 — CRUD · Erros · Layout Responsivo (27/10/2026)

---

## ✈️ Sobre o Projeto
Aplicação web corporativa desenvolvida para a **FlyNow** (empresa de aviação comercial e turismo).
O sistema integra autenticação com token JWT, rotas protegidas com React Router, catálogo de destinos sincronizado com APIs abertas e o módulo **Meus Desejos** (`/desejos`), cobrindo o ciclo completo de **CRUD** com tratamento de erros por status HTTP, interceptors e design responsivo *mobile-first*.

---

## 📑 Implementação da Aula 10 (27/10/2026) — Para Casa Concluído

### 1. Bloco 1 · CRUD: Ler (R) e Criar (C)
- **Recurso Utilizado:** `/todos` da DummyJSON (`todo`, `completed`, `userId`).
- **Padrão dos 4 Estados Visuais de Tela:**
  1. *Carregando* (`loading === true`): Spinner e mensagem amigável.
  2. *Erro* (`erro !== null`): Mensagem traduzida com botão *"🔁 Tentar de novo"*.
  3. *Lista Vazia* (`desejos.length === 0`): Mensagem convidativa sem estilização de erro.
  4. *Lista com Itens*: Renderização via `.map()` e `key={d.id}`.
- **Formulário Controlado e Validação:**
  - Validação no cliente: mínimo de 3 e máximo de 80 caracteres.
  - `e.preventDefault()` para evitar recarregamento indevido da página.
  - Botão desabilitado durante o envio (`disabled={enviando}`) com texto alternando para `"Salvando…"`.
  - Acessibilidade: `htmlFor`/`id`, `aria-invalid` e `role="alert"`.
- **A API que só simula ("O Ensaio Geral"):**
  - O DummyJSON devolve 201 no `POST`, mas não persiste dados no servidor real.
  - Portanto, o app atualiza o **estado local imutavelmente**: `setDesejos((lista) => [...lista, novo])`.

### 2. Bloco 2 · CRUD: Editar (U) e Excluir (D)
- **Editar (`PATCH /todos/{id}`):**
  - Uso de `PATCH` para transmitir exclusivamente o campo modificado: `{ completed: !d.completed }`.
  - Atualização com imutabilidade: `lista.map((x) => x.id === d.id ? { ...x, completed: !x.completed } : x)`.
  - Estado `ocupado`: desabilita unicamente o item que está aguardando a resposta da rede.
- **Excluir (`DELETE /todos/{id}`):**
  - Confirmação prévia obrigatória: `window.confirm("Excluir...")`.
  - Primeiro dispara o `DELETE` na API; apenas após sucesso remove do estado local com `lista.filter((x) => x.id !== d.id)`.
- **Tratamento de 404 em Itens Recém-Criados:**
  - Uso de `useRef(new Set<number>())` para rastrear IDs criados na sessão simulada, evitando que chamadas de edição/exclusão quebrem a tela.

### 3. Bloco 3 · Tratamento de Erro & Interceptors do Axios
- **Função Centralizadora (`src/utils/erros.ts`):**
  - Tradução de erros técnicos para mensagens amigáveis em português:
    - `400`: *"Os dados enviados não foram aceitos. Confere o que digitou."*
    - `401`: *"Tua sessão expirou. Entra de novo."*
    - `404`: *"Não encontramos o que tu pediu. Pode ter sido removido."*
    - `5xx`: *"O servidor está com problema. Tenta de novo daqui a pouco."*
    - `ECONNABORTED` / Timeout (10s): *"A resposta demorou demais. Tenta de novo."*
    - Sem rede (`!err.response`): *"Sem conexão com o servidor. Confere a internet e tenta de novo."*
- **Interceptors no Axios (`src/services/http.ts`):**
  - **Request Interceptor:** Injeta automaticamente `Authorization: Bearer <token>` em toda chamada da instância `api`.
  - **Response Interceptor:** Escuta status `401` (exceto `/auth/login`), dispara `logout()` automaticamente para redirecionar ao login e devolve `Promise.reject(err)`.
- **Componente de Testes `LabErros.tsx`:**
  - Botões para simular ao vivo erros 400, 401, 404 e 500 usando o endpoint `/http/{codigo}/teste` do DummyJSON.

### 4. Bloco 4 · Layout Responsivo (Mobile-First)
- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` no `index.html`.
- **CSS Mobile-First (`src/index.css` e `src/App.css`):**
  - Base desenhada primeiro para 375 px (uma coluna), sem rolagem horizontal lateral.
  - `@media (min-width: 40rem)` para 2 colunas e `@media (min-width: 64rem)` para 3 colunas.
  - Alvos de toque acessíveis: botões e campos com altura mínima de 44 px (`min-height: 44px`).
  - Tipografia fluida com `clamp(1.5rem, 4vw + 0.5rem, 2.5rem)`.

---

## 💼 Receita Aplicada para o CRM (`/users`)

Conforme solicitado no slide 60 e 67 da Aula 10 (*"Aplicar a receita no CRM"*), o arquivo [`src/services/crmUsers.ts`](file:///c:/Users/ferna/Documents/1-Engenharia%20de%20software/3%C2%B0%20Per%C3%ADodo/Programa%C3%A7%C3%A3o%20Front%20End/Matheus_Fernando_Cardoso_Bezerra_202523339-Fernando_Da_Silva_Mello_202522786_v3%20%281%29/src/services/crmUsers.ts) foi criado fornecendo as funções do CRUD do recurso `/users`:
- `listarContatosCRM(limit, skip)`: `GET /users`
- `obterContatoCRM(id)`: `GET /users/{id}`
- `criarContatoCRM(contato)`: `POST /users/add`
- `atualizarContatoCRM(id, campos)`: `PATCH /users/{id}`
- `excluirContatoCRM(id)`: `DELETE /users/{id}`
- `buscarContatosCRM(termo)`: `GET /users/search?q={termo}`

---

## 📝 Resolução do Bilhete de Saída da Aula 10 (Slide 66)

1. **Por que o desejo criado desaparece no F5, e o que o app faz para a pessoa ver o que criou?**
   * *Resposta:* O DummyJSON é uma API de testes que apenas simula as operações (retornando status 201), mas não grava de verdade no servidor. No F5, a lista volta a ser carregada do servidor com os dados estáticos de fábrica. Para que a pessoa veja imediatamente o que criou, o app atualiza o seu **estado local** com imutabilidade (`setDesejos((lista) => [...lista, novo])`).

2. **Se a API responde 401, o que o interceptor faz e o que a pessoa vê?**
   * *Resposta:* O interceptor de response captura o status 401 (ignorando a rota `/auth/login`), dispara a função `logout()` do `AuthContext` (limpando o token do `localStorage` e o estado do usuário). Como o estado do usuário passa a ser `null`, o `ProtectedRoute` redireciona automaticamente para `/login`, onde o usuário visualiza o aviso de que sua sessão expirou.

3. **Por que o `setEnviando(false)` vai no `finally`?**
   * *Resposta:* Porque o bloco `finally` é executado obrigatoriamente em todos os cenários (tanto em caso de sucesso no `try` quanto em caso de erro no `catch`). Se ficasse apenas no `try`, qualquer erro de validação ou de rede deixaria o botão preso e desabilitado em *"Salvando…"*.

4. **Por que o CSS mobile-first usa `min-width` e começa pelo celular?**
   * *Resposta:* Telas de celular (375 px) possuem o layout mais restrito e desafiador (uma única coluna fluida). Definir o estilo base para mobile simplifica a arquitetura do CSS; as regras com `@media (min-width: ...)` apenas acrescentam colunas e aumentam espaçamentos à medida que a largura da tela cresce.

5. **Onde eu ainda estou perdido(a)?**
   * *Síntese conceitual:* O fluxo mais avançado é a coordenação entre o ciclo de vida dos interceptors fora do React com as funções de estado do React Context, e a estratégia de IDs locais (`useRef`) para contornar o 404 simulado da API.

---

## ✅ Checklist de Saída da Aula 10 (100% Concluído)
- [x] Console sem erros vermelhos (`npm run dev` e `npm run build` passando com código 0);
- [x] Página **Meus Desejos** (`/desejos`) protegida por autenticação;
- [x] Quatro estados de tela implementados (carregando, erro com botão tentar de novo, vazio, lista);
- [x] Criar com validação prévia e `enviando` ("Salvando…");
- [x] Marcar como feito via `PATCH` e excluir com confirmação via `DELETE`;
- [x] `src/services/desejos.ts` com as 4 funções do CRUD;
- [x] `src/utils/erros.ts` com `mensagemDeErro` sem jargões técnicos;
- [x] Interceptors no Axios: request adicionando `Bearer token` e response tratando `401 -> logout`;
- [x] Layout mobile-first testado em 375 px sem rolagem horizontal lateral;
- [x] Receita do CRM implementada em `src/services/crmUsers.ts`;
- [x] Repositório Git com commit da aula: `feat: aula10 desejos crud erros responsivo`.

---

## 🚀 Como Executar o Projeto

1. Instalar as dependências:
   ```bash
   npm install
   ```

2. Iniciar o servidor local:
   ```bash
   npm run dev
   ```
   Acesse: `http://localhost:5173`

3. Credenciais para teste no Login:
   * **Usuário:** `emilys`
   * **Senha:** `emilyspass`
   *(Há também um botão de 1 clique na tela de login para preencher automaticamente).*
