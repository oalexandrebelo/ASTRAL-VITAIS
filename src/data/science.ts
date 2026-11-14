/** Conteúdo educativo revisado em 14/11/2026. Dados do jogo são sintéticos. */
export type Risk = {
  id: string;
  title: string;
  tag: string;
  mechanism: string;
  preflight: string;
  practice: string;
  limitation: string;
  sourceUrl: string;
  sourceLabel: string;
};

export const RISKS: Risk[] = [
  {
    id: 'muscle-bone',
    title: 'Músculos e ossos',
    tag: 'Gravidade alterada',
    mechanism: 'Sem a carga habitual da gravidade, músculos e ossos de sustentação perdem estímulo. Força e capacidade funcional podem diminuir.',
    preflight: 'Estabelecer referências de força, capacidade aeróbica e saúde óssea; treinar o uso dos equipamentos com a equipe.',
    practice: 'Conferir fixação e equipamento, cumprir a sessão definida no plano simulado e registrar execução ou interrupção.',
    limitation: 'Uma ação não recupera massa óssea ou muscular. Tempo, carga e frequência reais são individualizados.',
    sourceUrl: 'https://www.nasa.gov/general/astronaut-exercise/',
    sourceLabel: 'NASA · Astronaut Exercise',
  },
  {
    id: 'cardio-vestibular',
    title: 'Circulação e equilíbrio',
    tag: 'Adaptação do corpo',
    mechanism: 'Redistribuição de fluidos e transições gravitacionais desafiam o sistema cardiovascular, a orientação e a locomoção.',
    preflight: 'Registrar capacidade funcional e referência cardiovascular; ensaiar tarefas e procedimentos para o retorno à gravidade.',
    practice: 'Registrar tontura ou desorientação, conferir contexto e solicitar apoio antes de uma tarefa crítica no cenário.',
    limitation: 'Frequência cardíaca isolada não confirma aptidão. A simulação não diagnostica alterações cardiovasculares.',
    sourceUrl: 'https://humanresearchroadmap.nasa.gov/Risks/',
    sourceLabel: 'NASA · Human Research Roadmap',
  },
  {
    id: 'sans',
    title: 'Visão e SANS',
    tag: 'Saúde neuro-ocular',
    mechanism: 'O voo espacial pode alterar a visão e estruturas oculares. A redistribuição de fluidos é uma hipótese importante em estudo.',
    preflight: 'Obter avaliação ocular de referência e conhecer como relatar mudanças de visão durante a missão.',
    practice: 'Reportar alteração visual e abrir a avaliação programada do cenário, mantendo o histórico para comparação.',
    limitation: 'SANS não é cegueira inevitável. Não há botão de cura nem diagnóstico válido por um wearable comum.',
    sourceUrl: 'https://www.nasa.gov/reference/risk-of-spaceflight-associated-neuro-ocular-syndrome-sans/',
    sourceLabel: 'NASA · Risco de SANS',
  },
  {
    id: 'radiation',
    title: 'Radiação espacial',
    tag: 'Exposição acumulada',
    mechanism: 'Partículas energéticas podem causar danos biológicos. Ambiente, trajetória, blindagem e atividade solar influenciam a exposição.',
    preflight: 'Planejar dosimetria, proteção e rota de abrigo; ensaiar a resposta a eventos com a equipe da missão.',
    practice: 'Conferir o aviso e o dosímetro, interromper a atividade indicada e ocupar o abrigo designado no cenário.',
    limitation: 'Abrigo reduz exposição futura. A dose já acumulada não diminui com descanso, exercício ou hidratação.',
    sourceUrl: 'https://www.nasa.gov/reference/risk-of-radiation-induced-cancers/',
    sourceLabel: 'NASA · Risco de radiação',
  },
  {
    id: 'sleep',
    title: 'Sono e atenção',
    tag: 'Ritmo circadiano',
    mechanism: 'Luz, horários irregulares e carga de trabalho podem reduzir o sono e comprometer atenção e desempenho.',
    preflight: 'Conhecer a rotina de sono e preparar a adaptação de horários com a equipe responsável pela missão.',
    practice: 'Proteger a oportunidade de descanso, ajustar luz no ambiente virtual e registrar fadiga antes de tarefas críticas.',
    limitation: 'Tempo reservado para dormir não é sono obtido. As 8,5 h citadas no padrão são recomendação no rationale, não regra universal.',
    sourceUrl: 'https://standards.nasa.gov/sites/default/files/standards/NASA/C/nasa-std-3001-vol-1-rev-c-signature.pdf',
    sourceLabel: 'NASA-STD-3001 Vol. 1 C · §6.1, p.51',
  },
  {
    id: 'isolation',
    title: 'Isolamento e equipe',
    tag: 'Saúde comportamental',
    mechanism: 'Confinamento, distância da Terra e convivência prolongada podem afetar humor, comunicação, decisões e bem-estar.',
    preflight: 'Ensaiar comunicação e resolução de conflitos; definir canais de apoio e espaço para privacidade.',
    practice: 'Fazer check-in privado, pedir apoio quando necessário e preparar uma passagem de turno clara.',
    limitation: 'Um sensor não diagnostica ansiedade. O jogo avalia ações de cuidado, sem pontuar emoções ou exigir felicidade.',
    sourceUrl: 'https://www.nasa.gov/reference/risk-of-behavioral-changes-and-psychiatric-disorders/',
    sourceLabel: 'NASA · Saúde comportamental',
  },
  {
    id: 'cabin',
    title: 'Cabine e CO₂',
    tag: 'Suporte de vida',
    mechanism: 'Ambientes fechados dependem de ventilação e remoção ativa de CO₂. Pressão, composição do ar e oxigenação são medidas diferentes.',
    preflight: 'Treinar a leitura dos indicadores, a conferência dos sensores e os procedimentos de contingência ambiental.',
    practice: 'Conferir qualidade e janela da leitura, inspecionar o sistema simulado e verificar novamente após a ação.',
    limitation: 'Respirar fundo não corrige CO₂ da cabine. O limite nominal de média horária não é corte diagnóstico instantâneo nem limite de traje.',
    sourceUrl: 'https://www.nasa.gov/directorates/esdmd/hhp/carbon-dioxide-risk/',
    sourceLabel: 'NASA · Carbon Dioxide Risk',
  },
  {
    id: 'immune-nutrition',
    title: 'Imunidade e nutrição',
    tag: 'Rotina de prevenção',
    mechanism: 'Estressores da missão podem alterar respostas imunes. Alimentação, higiene e disponibilidade de suprimentos exigem acompanhamento.',
    preflight: 'Revisar saúde, alimentação e medidas de prevenção com a equipe; organizar suprimentos e referências individuais.',
    practice: 'Conferir higiene e validade, registrar ingestão do plano simulado e comunicar sintomas ou dificuldade para se alimentar.',
    limitation: 'Não existe “percentual de imunidade” medido pelo jogo. Metas de ingestão e tratamentos reais dependem de avaliação profissional.',
    sourceUrl: 'https://humanresearchroadmap.nasa.gov/Risks/',
    sourceLabel: 'NASA · Riscos imunes e nutricionais',
  },
];

export type ScienceSource = {
  id: string;
  title: string;
  organization: string;
  year: number;
  kind: 'Norma' | 'Pesquisa' | 'Referência';
  summary: string;
  url: string;
};

export const SOURCES: ScienceSource[] = [
  {
    id: 'nasa-3001-v1',
    title: 'NASA-STD-3001 · Volume 1 · Revisão C',
    organization: 'NASA',
    year: 2023,
    kind: 'Norma',
    summary: 'Saúde da tripulação. Revisão C aprovada em 15/09/2023; inclui radiação, planejamento e registros médicos.',
    url: 'https://standards.nasa.gov/sites/default/files/standards/NASA/C/nasa-std-3001-vol-1-rev-c-signature.pdf',
  },
  {
    id: 'nasa-3001-v2',
    title: 'NASA-STD-3001 · Volume 2 · Revisão F',
    organization: 'NASA',
    year: 2026,
    kind: 'Norma',
    summary: 'Fatores humanos, habitabilidade e ambiente. Revisão F aprovada em 14/07/2026; os limites exigem contexto e janela de medição.',
    url: 'https://standards.nasa.gov/system/files/tmp/NASA-STD-3001%20Vol%202%20Rev%20F.pdf',
  },
  {
    id: 'soma-biospecimens',
    title: 'Inspiration4: coleta e biobanco SOMA',
    organization: 'Nature Communications · Overbey et al.',
    year: 2024,
    kind: 'Pesquisa',
    summary: 'Quatro participantes, três dias de voo e 2.911 alíquotas. Fundamenta coleta longitudinal e qualidade dos dados, sem validar tratamentos.',
    url: 'https://www.nature.com/articles/s41467-024-48806-z',
  },
  {
    id: 'soma-atlas',
    title: 'Space Omics and Medical Atlas',
    organization: 'Nature · Overbey et al.',
    year: 2024,
    kind: 'Pesquisa',
    summary: 'Atlas de dados clínicos e multiômicos. Os autores classificam os resultados como preliminares, insuficientes para orientar intervenções médicas.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11357981/',
  },
  {
    id: 'nasa-hazards',
    title: 'Cinco perigos do voo espacial humano',
    organization: 'NASA · Human Research Program',
    year: 2026,
    kind: 'Referência',
    summary: 'Radiação, isolamento, distância da Terra, gravidade alterada e ambientes hostis. Referência consultada em novembro de 2026.',
    url: 'https://www.nasa.gov/hrp/hazards/',
  },
  {
    id: 'nasa-roadmap',
    title: 'Human Research Roadmap',
    organization: 'NASA',
    year: 2026,
    kind: 'Referência',
    summary: 'Portfólio de riscos e evidências por contexto de missão. Referência consultada em novembro de 2026; não é um ranking universal.',
    url: 'https://humanresearchroadmap.nasa.gov/Risks/',
  },
  {
    id: 'nasa-exercise',
    title: 'Exercício e contramedidas em órbita',
    organization: 'NASA',
    year: 2024,
    kind: 'Referência',
    summary: 'ARED, T2 e CEVIS ilustram como equipamentos e planos de exercício evoluem para preservar capacidade funcional.',
    url: 'https://www.nasa.gov/general/astronaut-exercise/',
  },
  {
    id: 'csa-bio-monitor',
    title: 'Bio-Monitor: sinais na rotina',
    organization: 'Agência Espacial Canadense',
    year: 2018,
    kind: 'Referência',
    summary: 'Enviado em dezembro de 2018. Camiseta, faixa e aplicativo integram medições fisiológicas ao sono, exercício e atividades diárias.',
    url: 'https://www.asc-csa.gc.ca/eng/sciences/bio-monitor.asp',
  },
  {
    id: 'artemis-radiation',
    title: 'Dosimetria na Artemis I',
    organization: 'NASA',
    year: 2024,
    kind: 'Referência',
    summary: 'Resultados do voo sem tripulação de 2022 mostram a importância da posição, blindagem e orientação da nave para a exposição.',
    url: 'https://www.nasa.gov/missions/artemis/artemis-1/artemis-i-radiation-measurements-validate-orion-safety-for-astronauts/',
  },
  {
    id: 'esa-e4d',
    title: 'E4D: demonstração na ISS',
    organization: 'ESA',
    year: 2026,
    kind: 'Referência',
    summary: 'Testes iniciados em julho de 2026. Integra resistência, bicicleta, remo e corda; a demonstração tecnológica é prevista por dois anos.',
    url: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/New_European_exercise_device_begins_testing_with_first_rope-pulling_workout_in_space',
  },
];

export type Equipment = {
  year: string;
  title: string;
  category: string;
  status: string;
  description: string;
  change: string;
  url: string;
};

export const EQUIPMENT: Equipment[] = [
  {
    year: '1961–1963',
    title: 'Biotelemetria Mercury',
    category: 'Monitoramento',
    status: 'Uso histórico em voo',
    description: 'Sensores de ECG, respiração e temperatura permitiam acompanhar a fisiologia dos primeiros astronautas americanos.',
    change: 'O corpo passa a ser observado à distância durante o voo, com avaliação humana e sensores em evolução.',
    url: 'https://www.nasa.gov/wp-content/uploads/2023/03/sp-4213.pdf',
  },
  {
    year: '2001',
    title: 'CEVIS',
    category: 'Exercício aeróbico',
    status: 'Uso na ISS; atualizado em 2023',
    description: 'Ergômetro com resistência controlada e isolamento de vibração para exercício e avaliação de capacidade aeróbica.',
    change: 'A sessão passa a integrar carga, frequência cardíaca, tempo e detalhes do plano de exercício.',
    url: 'https://www.nasa.gov/general/astronaut-exercise/',
  },
  {
    year: '2008–2009',
    title: 'ARED + T2',
    category: 'Contramedidas físicas',
    status: 'Equipamentos da ISS',
    description: 'ARED oferece resistência em microgravidade. A esteira T2 complementa o conjunto de treino da estação.',
    change: 'Carga mecânica e exercício aeróbico ganham equipamentos próprios; o plano continua individualizado.',
    url: 'https://ntrs.nasa.gov/citations/20250008476',
  },
  {
    year: '2011',
    title: 'Ultrasound-2',
    category: 'Imagem médica',
    status: 'Lançado em 08/07/2011',
    description: 'Ultrassom comercial adaptado para voo, usado em investigações e acompanhamento médico na ISS.',
    change: 'Permite observar órgãos e músculos a bordo, além dos sinais externos de um monitor.',
    url: 'https://www.nasa.gov/ames/space-biosciences/ultrasound-2-sts-135/',
  },
  {
    year: '2016',
    title: 'MinION em órbita',
    category: 'Biologia molecular',
    status: 'Demonstração realizada na ISS',
    description: 'O primeiro sequenciamento de DNA no espaço abriu caminho para análises moleculares e identificação microbiana a bordo.',
    change: 'Parte da investigação molecular passa a ocorrer no local, sem depender apenas do retorno de amostras.',
    url: 'https://www.nasa.gov/missions/station/iss-research/dna-sequencing-in-space-timeline/',
  },
  {
    year: '2018',
    title: 'Bio-Monitor',
    category: 'Vestível fisiológico',
    status: 'Enviado à ISS em dezembro',
    description: 'Camiseta, faixa e aplicativo registram dados fisiológicos durante atividades, exercício e sono.',
    change: 'A medição se aproxima da rotina da tripulação, com menos interrupções para coleta de sinais.',
    url: 'https://www.asc-csa.gc.ca/eng/sciences/bio-monitor.asp',
  },
  {
    year: '2019',
    title: 'Bio-Analyzer',
    category: 'Análise a bordo',
    status: 'Enviado em abril; testado em maio',
    description: 'Plataforma compacta projetada para analisar pequenas amostras de fluidos e produzir dados biomédicos a bordo.',
    change: 'Investiga resultados mais próximos da coleta, reduzindo a necessidade de congelar e devolver amostras.',
    url: 'https://www.asc-csa.gc.ca/eng/iss/bio-analyzer.asp',
  },
  {
    year: '2022',
    title: 'Dosimetria Artemis I',
    category: 'Radiação',
    status: 'Voo sem tripulação; resultados em 2024',
    description: 'HERA, dosímetros e manequins MARE mediram exposição em diferentes locais e condições dentro da Orion.',
    change: 'A exposição é estudada com contexto de blindagem, orientação e posição, além do valor acumulado.',
    url: 'https://www.nasa.gov/missions/artemis/artemis-1/artemis-i-radiation-measurements-validate-orion-safety-for-astronauts/',
  },
  {
    year: '2026',
    title: 'E4D',
    category: 'Exercício integrado',
    status: 'Demonstração tecnológica iniciada em julho',
    description: 'Dispositivo compacto que reúne resistência, bicicleta, remo e puxada de corda na ISS.',
    change: 'Integra diferentes modalidades em menos espaço. Desempenho e eficácia seguem em avaliação por dois anos.',
    url: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/New_European_exercise_device_begins_testing_with_first_rope-pulling_workout_in_space',
  },
];

export type Standard = {
  code: string;
  title: string;
  value: string;
  scope: string;
  url: string;
};

/** Seleção educativa; não constitui matriz completa de conformidade NASA. */
export const STANDARDS: Standard[] = [
  {
    code: 'V2 6004 · Rev. F · §6.2.1.3',
    title: 'CO₂ na cabine',
    value: 'Média de 1 h ≤ 3 mmHg',
    scope: 'Pressão parcial de CO₂ no volume habitável nominal. Não é limite instantâneo, diagnóstico individual ou regra para traje. Página 51.',
    url: 'https://standards.nasa.gov/system/files/tmp/NASA-STD-3001%20Vol%202%20Rev%20F.pdf',
  },
  {
    code: 'V1 4030 · Rev. C · §4.8.2',
    title: 'Radiação ao longo da carreira',
    value: 'Dose efetiva NASA < 600 mSv',
    scope: 'Limite acumulado de carreira para exposição em voo espacial. Não é meta por missão nem garantia de ausência de risco. Páginas 40–41.',
    url: 'https://standards.nasa.gov/sites/default/files/standards/NASA/C/nasa-std-3001-vol-1-rev-c-signature.pdf',
  },
  {
    code: 'V2 6006 · Rev. F · §6.2.2.1',
    title: 'Pressão atmosférica',
    value: '34,5 kPa < pressão ≤ 103 kPa',
    scope: 'Faixa para exposição indefinida, interpretada junto à composição da atmosfera e aos demais requisitos. Não basta verificar a pressão. Página 52.',
    url: 'https://standards.nasa.gov/system/files/tmp/NASA-STD-3001%20Vol%202%20Rev%20F.pdf',
  },
  {
    code: 'V1 4029 · Rev. C · §4.8.1',
    title: 'Minimização da exposição',
    value: 'Princípio ALARA',
    scope: 'Manter exposição à radiação tão baixa quanto razoavelmente possível. Estar abaixo de um limite não transforma exposição em objetivo. Página 40.',
    url: 'https://standards.nasa.gov/sites/default/files/standards/NASA/C/nasa-std-3001-vol-1-rev-c-signature.pdf',
  },
];
