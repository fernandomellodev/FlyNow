// Tipagens para os Destinos, Formulário e Tarefas da aplicação FlyNow (Aula 8)

export interface Destino {
  id: string;          // Identificador estável (ex: Rio_de_Janeiro, Salvador, Lisbon)
  nome: string;        // Nome da cidade (exigido no Bloco 2 e 3 da Aula 8)
  cidade: string;      // Alias para nome (compatibilidade com componentes)
  preco: number;       // Preço da passagem em R$ (exigido para HOF filter e reduce)
  resumo: string;      // Descrição oficial obtida via API Wikipedia REST
  imagem: string;      // URL da imagem
}

export interface ContatoForm {
  nome: string;
  email: string;
  destinoInteresse: string;
  mensagem: string;
}

export interface TarefaSimulada {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface WikidataSparqlResponse {
  head: {
    vars: string[];
  };
  results: {
    bindings: Array<{
      item: { type: string; value: string };
      itemLabel?: { type: string; value: string; 'xml:lang'?: string };
      description?: { type: string; value: string; 'xml:lang'?: string };
      image?: { type: string; value: string };
    }>;
  };
}
