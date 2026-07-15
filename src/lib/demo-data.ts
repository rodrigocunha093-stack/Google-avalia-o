import type {
  ActionPlanItem,
  DemoWeeklyMetric,
  PublicStore,
  RatingTrendPeriod,
  RatingTrendPoint,
  WeeklyFeedback,
} from "./types";

export const TARGET_QUERIES = [
  "Supermercado Menor Preco Bairro dos Estados Joao Pessoa",
  "Supermercado Menor Preco Manaira Joao Pessoa",
  "Supermercado Menor Preco Intermares Cabedelo Joao Pessoa",
  "Supermercado Menor Preco Cristo Joao Pessoa",
  "Supermercado Menor Preco Torre Joao Pessoa",
  "Supermercado Menor Preco Altiplano Joao Pessoa",
  "Mega Atacarejo Joao Pessoa",
];

export const demoStores: PublicStore[] = [
  store("bairro-dos-estados", "Supermercado Rede Menor Preco - Bairro dos Estados", "Bairro dos Estados", 4.3, 5112, -7.1011, -34.8479, [
    review("bairro-dos-estados", "francisco nilton sousa", 2, "Atendimento muito demorado no caixa, segurando a clientela e atrasando o atendimento mesmo apos comunicacao ao fiscal de caixa."),
    review("bairro-dos-estados", "Sabrina Araujo", 1, "Cliente relata falta de seguranca no estacionamento, furto de capacete preso na moto e ausencia de cameras externas."),
    review("bairro-dos-estados", "Iranilson Buriti de Oliveira", 2, "Quase todas as compras tem algum produto com valor maior que o da etiqueta. Cliente precisa enfrentar fila para receber diferenca de volta."),
    review("bairro-dos-estados", "Mickaela Luiza", 2, "Faltam funcionarios na area de frios. Sempre congestiona e forma fila, deixando a equipe sobrecarregada."),
    review("bairro-dos-estados", "SS Avila", 1, "Experiencia pessima com cortes de carne errados, frango assado cru por dentro e salgado da padaria com gosto de estragado."),
    review("bairro-dos-estados", "Mayra Paula", 1, "Cliente relata problema grave de higiene no restaurante, com inseto no prato apos pesar a refeicao."),
    review("bairro-dos-estados", "Filipe Falcao", 1, "Cliente relata ovos estragados com frequencia, mesmo dentro da validade, e deixou de comprar ovos no local."),
    review("bairro-dos-estados", "aeciio matheuslucas", 2, "Pessimo atendimento, filas enormes no acougue e nos lacticinios, alem de falta de seguranca no estacionamento."),
  ]),
  store("manaira", "Rede Menor Preco - Manaira", "Manaira", 4.5, 2888, -7.0974, -34.8342, [
    review("manaira", "Beatriz Sa", 2, "Cliente nao ve vantagem em ir a loja e relata que os precos, no geral, sao mais elevados que os do concorrente proximo."),
    review("manaira", "Miguel Stalyt", 1, "Reclamacao sobre atendimento na portaria da unidade Manaira, com ocorrencia registrada em horario noturno."),
    review("manaira", "Sabrina Araujo", 1, "Cliente relata falta de preparo e capacitacao dos segurancas, com constrangimentos durante as compras."),
    review("manaira", "Bruna Loureiro", 1, "Cliente comprou bacon e, ao abrir a embalagem em casa, percebeu produto completamente estragado, com mau cheiro e aparencia ruim."),
    review("manaira", "Lucia Jordao", 2, "Cliente antiga relata mau atendimento, diferenca de precos no caixa e supermercado sujo com pombos e baratas no interior."),
    review("manaira", "Bruno Souto", 1, "Cliente relata compra recorrente de carne vencida ou estragada, mesmo em embalagem a vacuo."),
    review("manaira", "Filipi Nascimento", 2, "Cliente relata precos caros e promocoes confusas, com preco anunciado diferente do valor informado no caixa."),
    review("manaira", "Alexandre Oliveira", 2, "Cliente relata loja cheia, poucos caixas funcionando e autoatendimento indisponivel em periodo de alto movimento."),
    review("manaira", "Mateus Osorio", 2, "Cliente relata atendimento pessimo nos caixas, com mau humor e rispidez em visitas repetidas."),
  ]),
  store("intermares", "Supermercado Menor Preco - Intermares", "Intermares", 4.7, 1652, -7.0431, -34.8424),
  store("cristo", "Supermercado Menor Preco - Cristo", "Cristo", 4.4, 1218, -7.1458, -34.8756),
  store("torre", "Supermercado Menor Preco - Torre", "Torre", 4.6, 1432, -7.1195, -34.8611),
  store("altiplano", "Supermercado Menor Preco - Altiplano", "Altiplano", 4.4, 92, -7.1342, -34.8214, [
    review("altiplano", "Wagner M Souza", 2, "Pequeno. Com muitas promocoes no encarte, mas com limitacao de quantidades por cliente. Atrai pelo preco, mas nao permite comprar livremente."),
    review("altiplano", "Mateus Leite Arnaud", 1, "Pior sistema de autoatendimento que voce vai encontrar. Nao funciona nem com o proprio funcionario treinado para usa-lo."),
    review("altiplano", "Uly Diniz", 1, "Comprei carne e notei moscas dentro da embalagem. Ao devolver, o gerente nao foi agradavel. Outros funcionarios foram educados, mas o setor de carnes tinha moscas voando."),
    review("altiplano", "O Halley Motos", 2, "Propaganda informa horario 24 horas, mas a loja nao atende nesse horario. Seguranca tambem nao soube dar informacao."),
    review("altiplano", "Andre Fernandes", 3, "Estacionamento com pouca sombra. Foi dificil encontrar uma vaga protegida do sol."),
    review("altiplano", "Barreto", 3, "Loja organizada, limpa e bem sinalizada, mas alguns produtos estavam mais caros que na regiao e faltavam itens basicos."),
  ]),
  store("mega-atacarejo", "Mega Atacarejo - Joao Pessoa", "Joao Pessoa", 4.3, 909, -7.1582, -34.8428),
];

export const simulatedConnectedMetrics: DemoWeeklyMetric[] = [
  { label: "Novas avaliacoes da semana", value: "42", dataSource: "DEMO_SIMULATED" },
  { label: "Nota da semana", value: "4,7", dataSource: "DEMO_SIMULATED" },
  { label: "Comparacao com semana anterior", value: "+0,2 ponto", dataSource: "DEMO_SIMULATED" },
  { label: "Avaliacoes negativas", value: "5", dataSource: "DEMO_SIMULATED" },
  { label: "Taxa de resposta", value: "86%", dataSource: "DEMO_SIMULATED" },
  { label: "Reclamacoes recorrentes", value: "filas, estacionamento", dataSource: "DEMO_SIMULATED" },
  { label: "Elogios recorrentes", value: "preco, variedade", dataSource: "DEMO_SIMULATED" },
  { label: "Avaliacoes ainda nao respondidas", value: "6", dataSource: "DEMO_SIMULATED" },
];

export const simulatedWeeklyFeedbacks: WeeklyFeedback[] = [
  feedback("bairro-dos-estados", "Supermercado Menor Preco - Bairro dos Estados", "Filas", "Reclamacao", 2, "Clientes relatam demora no caixa e filas na area de frios, acougue e lacticinios.", "Reforcar escala por setor e acionar abertura rapida de atendimento em horarios de pico."),
  feedback("bairro-dos-estados", "Supermercado Menor Preco - Bairro dos Estados", "Seguranca", "Reclamacao", 1, "Avaliacoes relatam furtos e percepcao de baixa seguranca no estacionamento.", "Revisar cameras externas, ronda e protocolo de atendimento a ocorrencias."),
  feedback("bairro-dos-estados", "Supermercado Menor Preco - Bairro dos Estados", "Preco", "Reclamacao", 2, "Clientes relatam divergencia entre preco de etiqueta e valor cobrado no caixa.", "Auditar etiquetas, leitores e rotina de conferencia de ofertas por corredor."),
  feedback("bairro-dos-estados", "Supermercado Menor Preco - Bairro dos Estados", "Higiene", "Reclamacao", 1, "Comentarios citam produtos estragados e ocorrencia grave no restaurante.", "Abrir verificacao de higiene, validade, armazenamento e limpeza do restaurante e pereciveis."),
  feedback("manaira", "Supermercado Menor Preco - Manaira", "Preco", "Reclamacao", 2, "Clientes relatam precos acima da concorrencia e divergencia entre promocao anunciada e valor no caixa.", "Auditar precificacao, comunicacao de ofertas e regras de desconto por aplicativo."),
  feedback("manaira", "Supermercado Menor Preco - Manaira", "Seguranca", "Reclamacao", 1, "Avaliacoes relatam abordagem inadequada de segurancas e problema de atendimento na portaria.", "Reforcar treinamento de abordagem, postura e protocolo de portaria."),
  feedback("manaira", "Supermercado Menor Preco - Manaira", "Carnes", "Reclamacao", 1, "Clientes relatam carnes e bacon estragados ou vencidos.", "Auditar temperatura, validade, lote, devolucoes e rotina do setor de carnes e pereciveis."),
  feedback("manaira", "Supermercado Menor Preco - Manaira", "Higiene", "Reclamacao", 2, "Comentario cita sujeira, pombos e baratas no interior da loja.", "Executar plano de limpeza, dedetizacao e controle de pragas com evidencia fotografica."),
  feedback("manaira", "Supermercado Menor Preco - Manaira", "Caixas", "Reclamacao", 2, "Clientes relatam poucos caixas, demora, mau humor e autoatendimento indisponivel.", "Rever escala de caixas, abertura de autoatendimento e comportamento de atendimento."),
  feedback("intermares", "Supermercado Menor Preco - Intermares", "Preco", "Elogio", 5, "Encontrei boas ofertas e preco melhor que outros mercados da regiao.", "Destacar ofertas em comunicacao local."),
  feedback("cristo", "Supermercado Menor Preco - Cristo", "Estacionamento", "Reclamacao", 3, "Estacionamento cheio no sabado, precisei esperar vaga.", "Avaliar orientacao de fluxo nos horarios de pico."),
  feedback("torre", "Supermercado Menor Preco - Torre", "Limpeza", "Elogio", 5, "Loja limpa, corredores organizados e reposicao boa.", "Manter rotina e reconhecer equipe operacional."),
  feedback("altiplano", "Supermercado Menor Preco - Altiplano", "Autoatendimento", "Reclamacao", 1, "Cliente relata falha no sistema de autoatendimento e dificuldade de uso ate para funcionario.", "Revisar funcionamento do autoatendimento e criar plano de apoio no horario de pico."),
  feedback("altiplano", "Supermercado Menor Preco - Altiplano", "Carnes", "Reclamacao", 1, "Cliente relata problema grave na embalagem de carne e atendimento gerencial insatisfatorio.", "Abrir verificacao imediata no setor de carnes, higiene, armazenamento e protocolo de atendimento a devolucoes."),
  feedback("altiplano", "Supermercado Menor Preco - Altiplano", "Horario", "Reclamacao", 2, "Cliente reclama de divergencia entre horario anunciado e atendimento real.", "Auditar horario exibido publicamente e alinhar equipe de seguranca para informacao ao cliente."),
  feedback("mega-atacarejo", "Mega Atacarejo - Joao Pessoa", "Reposicao", "Reclamacao", 2, "Alguns itens de promocao estavam sem estoque no domingo.", "Conferir ruptura de itens promocionais antes do fim de semana."),
];

export const simulatedActionPlan: ActionPlanItem[] = [
  {
    id: "acao-filas",
    priority: "Alta",
    theme: "Filas",
    action: "Revisar escala de caixas e acionar abertura rapida em horario de pico.",
    owner: "Gerente de loja",
    dueIn: "7 dias",
    evidence: "Feedbacks simulados citam demora no fim da tarde.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-estados-preco",
    priority: "Alta",
    theme: "Preco",
    action: "Auditar divergencias entre etiqueta, leitor e caixa na unidade Bairro dos Estados.",
    owner: "Gerente de loja e precificacao",
    dueIn: "72 horas",
    evidence: "Avaliacoes de baixa classificacao relatam cobranca acima do preco da etiqueta.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-estados-seguranca",
    priority: "Alta",
    theme: "Seguranca",
    action: "Mapear pontos cegos do estacionamento, revisar cameras externas e definir resposta padrao para ocorrencias.",
    owner: "Gerente regional e seguranca patrimonial",
    dueIn: "7 dias",
    evidence: "Avaliacoes relatam furto e percepcao de falta de seguranca no estacionamento.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-estados-higiene",
    priority: "Alta",
    theme: "Higiene",
    action: "Executar auditoria imediata em restaurante, padaria, acougue, ovos e controle de validade.",
    owner: "Qualidade e gerente de loja",
    dueIn: "48 horas",
    evidence: "Avaliacoes citam produto estragado, higiene e alimento improprio.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-manaira-pereciveis",
    priority: "Alta",
    theme: "Carnes",
    action: "Auditar imediatamente carnes, bacon, validade, temperatura e protocolo de retirada de produto improprio na unidade Manaira.",
    owner: "Qualidade e gerente de pereciveis",
    dueIn: "48 horas",
    evidence: "Avaliacoes de baixa classificacao relatam produto estragado e carne vencida.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-manaira-seguranca",
    priority: "Alta",
    theme: "Seguranca",
    action: "Revisar conduta de segurancas e portaria, com treinamento de abordagem e registro de ocorrencias.",
    owner: "Seguranca patrimonial e gerente de loja",
    dueIn: "7 dias",
    evidence: "Avaliacoes citam constrangimento e falta de preparo da equipe de seguranca.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-manaira-caixas",
    priority: "Media",
    theme: "Caixas",
    action: "Ajustar escala de caixas, revisar autoatendimento e monitorar tempo de fila por turno.",
    owner: "Operacao de loja",
    dueIn: "7 dias",
    evidence: "Avaliacoes citam poucos caixas, demora e atendimento rispido.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-ruptura",
    priority: "Alta",
    theme: "Reposicao",
    action: "Criar checklist de ruptura para itens de oferta antes de sabado e domingo.",
    owner: "Operacao e compras",
    dueIn: "5 dias",
    evidence: "Feedback semanal simulado aponta falta de item promocional.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-estacionamento",
    priority: "Media",
    theme: "Estacionamento",
    action: "Testar orientacao de fluxo e sinalizacao em dias de maior movimento.",
    owner: "Gerente regional",
    dueIn: "14 dias",
    evidence: "Comentarios publicos limitados e feedbacks simulados mencionam dificuldade de vaga.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-altiplano-carnes",
    priority: "Alta",
    theme: "Carnes",
    action: "Auditar higiene, embalagem, temperatura e resposta da lideranca no setor de carnes da unidade Altiplano.",
    owner: "Gerente regional e qualidade",
    dueIn: "48 horas",
    evidence: "Avaliacoes negativas fornecidas para a demo citam problema no setor de carnes.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-altiplano-autoatendimento",
    priority: "Alta",
    theme: "Autoatendimento",
    action: "Testar todos os terminais, treinar operador de apoio e registrar incidentes por turno.",
    owner: "Operacao de loja",
    dueIn: "5 dias",
    evidence: "Avaliacao negativa aponta falha no autoatendimento.",
    dataSource: "DEMO_SIMULATED",
  },
  {
    id: "acao-elogios",
    priority: "Baixa",
    theme: "Atendimento",
    action: "Transformar elogios de atendimento em exemplos para reuniao semanal.",
    owner: "RH/treinamento",
    dueIn: "10 dias",
    evidence: "Feedbacks simulados valorizam padaria e equipe prestativa.",
    dataSource: "DEMO_SIMULATED",
  },
];

const ratingTrends: Record<RatingTrendPeriod, RatingTrendPoint[]> = {
  semanal: [
    trend("6 sem atras", 4.4, 31),
    trend("5 sem atras", 4.5, 38),
    trend("4 sem atras", 4.6, 42),
    trend("3 sem atras", 4.7, 45),
    trend("2 sem atras", 4.6, 39),
    trend("Semana atual", 4.8, 47),
  ],
  mensal: [
    trend("6 meses atras", 4.3, 146),
    trend("5 meses atras", 4.4, 158),
    trend("4 meses atras", 4.5, 171),
    trend("3 meses atras", 4.6, 182),
    trend("2 meses atras", 4.5, 176),
    trend("Mes atual", 4.7, 194),
  ],
  anual: [
    trend("2021", 4.1, 1230),
    trend("2022", 4.2, 1380),
    trend("2023", 4.4, 1510),
    trend("2024", 4.5, 1680),
    trend("2025", 4.6, 1810),
    trend("2026", 4.7, 920),
  ],
};

export function getSimulatedRatingTrend(
  period: RatingTrendPeriod,
  storeId?: string,
): RatingTrendPoint[] {
  const store = demoStores.find((item) => item.id === storeId);
  const adjustment = store ? Math.max(-0.25, Math.min(0.25, store.rating - 4.55)) : 0;

  return ratingTrends[period].map((point) => ({
    ...point,
    rating: clampRating(Number((point.rating + adjustment).toFixed(1))),
  }));
}

function store(
  slug: string,
  displayName: string,
  neighborhood: string,
  rating: number,
  userRatingCount: number,
  latitude: number,
  longitude: number,
  reviews?: PublicStore["reviews"],
): PublicStore {
  const id = slug;
  const query = TARGET_QUERIES.find((item) =>
    item.toLowerCase().includes(slug.split("-")[0]),
  ) ?? displayName;

  return {
    id,
    slug,
    query,
    internalName: displayName,
    displayName,
    placeId: `demo-place-${slug}`,
    formattedAddress: `${neighborhood}, Joao Pessoa - PB`,
    nationalPhoneNumber: "(83) 3000-0000",
    websiteUri: "https://www.google.com/maps",
    googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayName)}`,
    rating,
    userRatingCount,
    regularOpeningHours: ["segunda-feira a sabado: 07:00-21:00", "domingo: 07:00-13:00"],
    businessStatus: "OPERATIONAL",
    neighborhood,
    latitude,
    longitude,
    dataSource: "GOOGLE_PLACES_PUBLIC",
    reviews: reviews ?? [
      review(id, "Cliente Google", 5, "Boa variedade de produtos e atendimento rapido."),
      review(id, "Avaliador local", 4, "Precos competitivos, mas em alguns horarios a fila aumenta."),
      review(id, "Consumidora", 5, "Loja organizada, padaria boa e equipe prestativa."),
      review(id, "Morador da regiao", 4, "Estacionamento poderia ser mais facil nos fins de semana."),
      review(id, "Visitante", 5, "Gostei das ofertas e da limpeza dos corredores."),
    ],
  };
}

function review(storeId: string, authorName: string, rating: number, text: string) {
  return {
    id: `${storeId}-${authorName.toLowerCase().replaceAll(" ", "-")}-${rating}`,
    storeId,
    authorName,
    rating,
    relativePublishTimeDescription: "fonte publica limitada",
    text,
    dataSource: "GOOGLE_PLACES_PUBLIC" as const,
  };
}

function feedback(
  storeId: string,
  storeName: string,
  theme: string,
  sentiment: WeeklyFeedback["sentiment"],
  rating: number,
  text: string,
  recommendedAction: string,
): WeeklyFeedback {
  return {
    id: `${storeId}-${theme.toLowerCase()}`,
    storeId,
    storeName,
    theme,
    sentiment,
    rating,
    text,
    recommendedAction,
    period: "ultima-semana",
    dataSource: "DEMO_SIMULATED",
  };
}

function trend(label: string, rating: number, reviews: number): RatingTrendPoint {
  return {
    label,
    rating,
    reviews,
    dataSource: "DEMO_SIMULATED",
  };
}

function clampRating(value: number) {
  return Math.max(1, Math.min(5, value));
}
