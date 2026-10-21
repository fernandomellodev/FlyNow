# FlyNow · Minha Lista de Viagem & Painel de Destinos
> **Laboratório de Programação Front-End** · Engenharia de Software · 2026.2  
> **Universidade de Vassouras (FUSVE)** — Campus Saquarema  
> **Docente:** Laís Cristine Bordallo Pinheiro  
> **Atualização:** Aula 8 — DOM · HOF · Axios · useEffect (13/10/2026)

---

## ✈️ Sobre o Projeto
Aplicação web desenvolvida para a **FlyNow** (empresa de passagens aéreas e turismo). O projeto une o ecossistema React (Vite + TypeScript) à integração com APIs externas, aplicando boas práticas de imutabilidade, estados derivados via Higher-Order Functions (HOF), consumo via instâncias Axios e sincronização com o DOM via `useEffect`.

---

## 📑 Implementação da Aula 8 (13/10/2026)

### 1. Bloco 1 · DOM (O Bastidor vs Declarativo)
- **Manipulação direta testada no console do DevTools**:
  ```javascript
  const titulo = document.querySelector('h1')
  titulo.textContent = 'FlyNow — bastidor'
  titulo.classList.add('destaque')
  titulo.addEventListener('click', () => { console.log('clicou!') })
  ```
- **Por que o F5 desfaz?** A manipulação direta via console altera apenas o DOM em memória na sessão atual do navegador. O React é **declarativo**: sua fonte da verdade reside no código e no estado (`useState`). Ao recarregar a página (F5), o React reconstrói o DOM a partir dessa fonte da verdade.

### 2. Bloco 2 · HOF (Higher-Order Functions & Estado Derivado)
- **Estado Derivado**: Não guardamos no estado o que pode ser calculado a partir dos dados existentes. O `soBaratos` é um interruptor booleano; a lista `visiveis` e o `total` são derivados no render:
  ```typescript
  const [soBaratos, setSoBaratos] = useState(false)
  const visiveis = soBaratos ? destinos.filter((d) => d.preco <= 650) : destinos
  const total = visiveis.reduce((soma, d) => soma + d.preco, 0)
  ```
- **Desafio A (Slide 22) — Ordenar por preço sem mutação**:
  ```typescript
  const listaOrdenada = [...visiveis].sort((a, b) => a.preco - b.preco)
  ```
- **Desafio B (Slide 22) — Busca por nome com `includes`**:
  ```typescript
  destinos.filter((d) => d.nome.toLowerCase().includes(busca.toLowerCase().trim()))
  ```
- **Imutabilidade**: Nenhum método mutador (`push`, `splice`, `sort`) é executado sobre o estado original. Sempre geramos referências novas (`[...lista, novo]`, `filter`, `map`).

### 3. Bloco 3 · Axios (GET, POST e Tratamento de Erros)
- **Configuração de Ambiente**: Arquivo `.env` na raiz:
  ```env
  VITE_WIKI_URL=https://en.wikipedia.org/api/rest_v1
  VITE_API_URL=https://dummyjson.com
  ```
- **Instâncias Centrais (`src/services/http.ts`)**:
  ```typescript
  import axios from 'axios'
  export const wiki = axios.create({ baseURL: import.meta.env.VITE_WIKI_URL })
  export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
  ```
- **GET com Axios (`src/services/destinos.ts`)**: Chamadas paralelas via `Promise.all` para `/page/summary/{titulo}`.
- **POST com Axios (`criarTarefa`)**: Envio para a DummyJSON (`/todos/add`) com payload `{ todo, completed: false, userId: 1 }` (retorno status **201 Created** no Network).
- **Tratamento de Erros HTTP**: Diferença crucial com o `fetch`:
  - No `fetch`, respostas 404 e 500 **não** caem no `.catch()` (precisam de checagem manual com `res.ok`).
  - No `axios`, qualquer status fora do range 2xx cai diretamente no bloco `catch`, sendo capturado via:
    ```typescript
    if (axios.isAxiosError(err)) {
      console.log(err.response?.status, err.response?.data)
    }
    ```

### 4. Bloco 4 · useEffect (Ciclo de Vida & Conexão com o DOM)
- **Padrão dos 3 estados (`loading`, `erro`, `dados`)**:
  ```typescript
  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        setErro(null)
        const dados = await listarDestinos()
        setDestinos(dados)
      } catch {
        setErro('Não deu pra carregar. Tenta de novo.')
      } finally {
        setLoading(false) // Garante que loading seja desligado mesmo em falha
      }
    }
    carregar()
  }, []) // Array vazio: dispara apenas ao montar o componente
  ```
- **Ponte com o DOM (Slide 39)**:
  ```typescript
  useEffect(() => {
    document.title = `${visiveis.length} destinos - FlyNow`
  }, [visiveis.length])
  ```

---

## 📝 Resolução das Atividades e "Caça ao Bug" dos Slides

### Aquecimento (Slide 7)
- **Palpite A**:
  - `console.log(nums)` exibe `[1, 2, 3]` (o `map` não altera o array original).
  - `console.log(dobro)` exibe `[2, 4, 6]`.
- **Palpite B**:
  - Exibe `'deu certo'`! O `fetch` nativo só rejeita a Promise (caindo no `catch`) em falhas de rede. Respostas HTTP 404 ou 500 resolvem a Promise normalmente no `.then()`.
- **Palpite C**:
  - Como o `useEffect` não possui array de dependências, ele executa após cada render. Dentro dele, `setContador` força uma nova renderização, gerando um loop infinito que trava a aba do navegador.

### Caça ao Bug — DOM (Slide 13)
- **Código com defeito**: `document.querySelector('.titulo-principal').textContent = 'oi'`
- **Diagnóstico**: `Uncaught TypeError: Cannot set properties of null`. O seletor `.titulo-principal` não existe na árvore do DOM, fazendo com que `querySelector` retorne `null`.
- **Conserto**: Inspecionar o elemento na aba Elements do DevTools para descobrir a classe ou tag real (ex: `h1` ou `.hero-title`).

### Caça ao Bug — HOF (Slide 23)
- **Bug A**: `lista.push(novo); setLista(lista)`
  - *Problema*: Muta a referência existente do array. O React compara a referência (`#A1 === #A1`) e conclui que o estado não mudou, não atualizando a tela.
  - *Conserto*: `setLista([...lista, novo])`.
- **Bug B**: `<li key={i}>{d.nome}</li>`
  - *Problema*: Usar o índice do array como `key` prejudica o algoritmo de reconciliação do React ao filtrar, ordenar ou deletar itens.
  - *Conserto*: Usar a chave única e estável do item: `<li key={d.id}>{d.nome}</li>`.
- **Bug C**: `const total = lista.reduce((soma, d) => soma + d.preco)`
  - *Problema*: Sem o segundo argumento (valor inicial `0`), o `reduce` usa o primeiro elemento (um objeto) como acumulador inicial, resultando em strings estranhas (`[object Object]...`) ou erro em listas vazias.
  - *Conserto*: `const total = lista.reduce((soma, d) => soma + d.preco, 0)`.

### Caça ao Bug — Axios (Slide 33)
- **Bug A**: `const data = wiki.get('/page/summary/Tokyo')`
  - *Problema*: `wiki.get` retorna uma `Promise`. Faltou o `await` para resolver a resposta.
  - *Conserto*: `const { data } = await wiki.get('/page/summary/Tokyo')`.
- **Bug B**: `baseURL: import.meta.env.API_URL`
  - *Problema*: No Vite, variáveis de ambiente acessíveis no front-end precisam obrigatoriamente do prefixo `VITE_`.
  - *Conserto*: `baseURL: import.meta.env.VITE_API_URL`.
- **Bug C**: "Criei o .env, mas continua undefined. O que esqueci?"
  - *Resposta*: O Vite carrega as variáveis de ambiente no startup do processo. É necessário parar e reiniciar o servidor de desenvolvimento (`npm run dev`).

### Caça ao Bug — useEffect (Slide 40)
- **Bug A**: `useEffect(() => { setLoading(true); listarDestinos().then(setDestinos) })`
  - *Problema*: Falta o array de dependências `[]`. O efeito dispara a cada render, atualiza o estado e causa loop infinito de requisições no Network.
  - *Conserto*: Adicionar o array `[]` como segundo argumento: `}, [])`.
- **Bug B**: `useEffect(async () => { ... }, [])`
  - *Problema*: O callback do `useEffect` não pode ser uma função `async`, pois funções `async` retornam uma `Promise`, enquanto o React espera que o retorno seja síncrono (ou uma função de limpeza - cleanup).
  - *Conserto*: Declarar a função `async` internamente: `useEffect(() => { async function carregar() { ... } carregar() }, [])`.
- **Bug C**: `try { setDestinos(...); setLoading(false) } catch { setErro('falhou') }`
  - *Problema*: Se a chamada falhar, o fluxo salta diretamente para o `catch` e `setLoading(false)` nunca é executado, deixando a tela travada eternamente em "Carregando...".
  - *Conserto*: Mover `setLoading(false)` para o bloco `finally`.

---

## 🎟️ Bilhete de Saída (Slide 44)

1. **Por que `lista.push(x); setLista(lista)` não atualiza a tela?**
   - **Resposta:** O React utiliza comparação por referência (algoritmo de igualdade rasa / *Object.is*) para decidir se deve re-renderizar o componente. Ao fazer `lista.push(x)`, o conteúdo interno do array é alterado, mas o endereço de memória da referência continua exatamente o mesmo (`#A1 === #A1`). Como a referência não mudou, o React assume que não houve alteração no estado e não redesenha a tela. A forma correta é criar uma nova referência imutável via spread: `setLista([...lista, x])`.

2. **O que acontece num 404 com `fetch` e o que acontece com `axios`?**
   - **Resposta:** No `fetch`, respostas com status HTTP 404 ou 500 **não** provocam rejeição da Promise e entram normalmente no bloco `.then(res)`. Cabe ao desenvolvedor verificar manualmente `if (!res.ok)`. No `axios`, por padrão, qualquer código de status fora do intervalo 2xx (como 404 ou 500) lança automaticamente um erro, fazendo a requisição cair diretamente no bloco `catch(err)`, onde o status pode ser lido de forma segura via `err.response?.status`.

3. **O que muda se eu trocar `[]` por `[busca]` no `useEffect`?**
   - **Resposta:** Com o array vazio `[]`, o efeito é executado apenas **uma vez**, no momento da montagem inicial do componente na tela. Ao passar `[busca]`, o React monitora o valor da variável `busca`: o efeito roda na abertura da tela e é reexecutado **toda vez que o valor de `busca` for modificado** (por exemplo, a cada caractere digitado pelo usuário), disparando uma nova consulta à API automaticamente.

4. **Onde eu ainda estou perdido(a)? / Síntese conceitual:**
   - O ponto que mais exige atenção é diferenciar o que deve ser **estado** (`useState`) do que deve ser **estado derivado** (calculado no corpo do componente a partir de estados existentes via HOFs como `filter` e `reduce`). Manter filtros derivados no render previne dessincronização de telas e simplifica a manutenção da aplicação.

---

## ✅ Checklist de Saída da Aula 8 (100% Verde)
- [x] Console sem erros vermelhos;
- [x] `npm run build` compilando com zero erros de tipo;
- [x] `document.querySelector`, `textContent`, `classList` e sincronização do título via DOM testados;
- [x] Botão "Só até R$ 650" com `filter`, total derivado com `reduce` e `key={d.id}`;
- [x] Desafios A (ordenação sem mutação com `sort`) e B (busca por nome com `includes`) implementados;
- [x] `src/services/http.ts` com as URLs vindas do `.env` e instâncias Axios configuradas;
- [x] GET com Axios na Wikipedia REST API (`src/services/destinos.ts`);
- [x] POST no DummyJSON (`/todos/add`) e teste de erro 404 com leitura de `err.response?.status`;
- [x] `useEffect([])` com controle dos 3 estados (`loading`, `erro`, `destinos`) e `finally`.

---

## 🚀 Como Executar o Projeto

1. Instalar as dependências:
   ```bash
   npm install
   ```

2. Executar em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse: `http://localhost:5173`

3. Executar o build de produção:
   ```bash
   npm run build
   ```
