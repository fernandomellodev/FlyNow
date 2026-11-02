import { Destino, WikidataSparqlResponse } from '../types/destino';

/**
 * Consulta a API SPARQL da Wikidata para buscar destinos turísticos abertos.
 * Endpoint público sem chave (retorno 200 no Network F12).
 * Transforma a resposta no formato interno { id, cidade, resumo, imagem } (Opção B).
 */
export async function buscarDestinosWikidata(): Promise<Destino[]> {
  const query = `
    SELECT ?item ?itemLabel ?description ?image WHERE {
      VALUES ?item { 
        wd:Q8678  # Rio de Janeiro
        wd:Q90    # Paris
        wd:Q220   # Roma
        wd:Q1492  # Barcelona
        wd:Q84    # Londres
        wd:Q64    # Berlim
        wd:Q1490  # Tóquio
        wd:Q60    # Nova Iorque
        wd:Q597   # Lisboa
        wd:Q727   # Amsterdã
      }
      OPTIONAL { ?item wdt:P18 ?image. }
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "pt,en". 
        ?item rdfs:label ?itemLabel.
        ?item schema:description ?description.
      }
    }
  `;

  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/sparql-results+json'
    }
  });

  if (!response.ok) {
    throw new Error(`Erro ao consultar a API Wikidata SPARQL: status ${response.status}`);
  }

  const data: WikidataSparqlResponse = await response.json();

  // Opção B do PDF: mapeia os bindings da resposta para o formato da nossa aplicação
  const mapaUnico = new Map<string, Destino>();

  data.results.bindings.forEach((b) => {
    const id = b.item.value;
    if (!mapaUnico.has(id)) {
      mapaUnico.set(id, {
        id, // Key estável (URI oficial da entidade Wikidata)
        nome: b.itemLabel?.value || 'Destino',
        cidade: b.itemLabel?.value || 'Destino',
        preco: 1000,
        resumo: b.description?.value || 'Destino turístico internacional.',
        // Garante HTTPS para exibição de imagens seguras
        imagem: b.image?.value
          ? b.image.value.replace(/^http:\/\//i, 'https://')
          : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'
      });
    }
  });

  return Array.from(mapaUnico.values());
}
