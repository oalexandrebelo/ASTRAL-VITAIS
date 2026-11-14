# Repositórios e recursos para o ASTRAL VITAIS

Verificação em fontes primárias em 14 de novembro de 2026. A seleção considera a entrega atual em React + Three.js e as próximas etapas de telemetria, dados científicos e XR. Não foram incorporados modelos, personagens, texturas ou exemplos com licença incerta.

## Seleção e decisão de uso

| Recurso oficial | Licença ou regime verificado | Aplicação | Decisão para o MVP |
|---|---|---|---|
| [mrdoob/three.js](https://github.com/mrdoob/three.js) | [MIT](https://github.com/mrdoob/three.js/blob/dev/LICENSE) | Cena orbital, materiais, câmera, geometria, interação e WebGL | Utilizar diretamente; cena original com geometria e texturas procedurais |
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | [MIT](https://github.com/pmndrs/react-three-fiber/blob/master/LICENSE) | Renderer React para Three.js | Avaliar quando a cena tiver mais componentes e estados; não é dependência necessária da primeira entrega |
| [pmndrs/drei](https://github.com/pmndrs/drei) | [MIT](https://github.com/pmndrs/drei/blob/master/LICENSE) | Helpers para cenas em React Three Fiber | Considerar junto a R3F; evitar instalar helpers sem uso definido |
| [pmndrs/xr](https://github.com/pmndrs/xr) | [MIT](https://github.com/pmndrs/xr/blob/main/LICENSE), com avisos de autoria no arquivo | Interações VR/AR, controle e entrada em sessões XR | Versão posterior, depois de testes em aparelhos e adaptação de interação |
| [nasa/openmct](https://github.com/nasa/openmct) | [Apache-2.0](https://github.com/nasa/openmct/blob/master/LICENSE.md) | Visualização de telemetria e organização temporal de missão | Referência de arquitetura e possível console de instrutor; manter o game leve nesta entrega |
| [nasa/NASA-3D-Resources](https://github.com/nasa/NASA-3D-Resources) | O [README](https://github.com/nasa/NASA-3D-Resources/blob/master/README.md) descreve o acervo como livre e sem copyright, com remissão às diretrizes NASA | Modelos, imagens e texturas espaciais | Curar por ativo e registrar créditos antes de importar; o MVP usa recursos procedurais originais |
| [nasa/OSDR_Tutorials](https://github.com/nasa/OSDR_Tutorials) | Não foi identificado arquivo de licença na raiz consultada; documentação oficial, não uma autorização genérica de relicenciamento | Descoberta e leitura de estudos via portal e API | Usar como referência com links; não copiar o repositório inteiro para o produto |
| [NASA Open Science Data Repository](https://science.nasa.gov/biological-physical/data/osdr/) | [Termos do repositório](https://science.nasa.gov/reference/osdr-help-terms-and-conditions/) e condições específicas dos estudos | Camada de evidências e comparação de estudos | Evolução separada da telemetria sintética; curadoria por estudo e accession |

As licenças MIT dos pacotes e Apache-2.0 do Open MCT foram verificadas nos próprios arquivos oficiais, não por contagem de estrelas ou por descrições de terceiros. Os avisos exigidos pelos componentes efetivamente distribuídos devem acompanhar a versão entregue. As condições de um pacote não se estendem automaticamente a todo modelo ou textura usado em seus exemplos.

## Por que Three.js direto agora

A cena principal tem uma responsabilidade delimitada: apresentar o ambiente orbital e responder a controles de exploração, enquanto o fluxo de decisões fica em elementos React acessíveis. Um renderer imperativo isolado oferece controle direto do ciclo de vida, descarte de geometrias e materiais, limites de pixel ratio e redução de movimento.

Essa é uma decisão de escopo do projeto, não uma conclusão de que R3F seria inadequado. Quando surgirem muitas estações 3D, objetos com estado compartilhado e interações por cenário, o renderer declarativo poderá reduzir o trabalho de manutenção. Migrar deve ser uma escolha apoiada pela complexidade real e por testes de desempenho.

Na primeira versão, inserir R3F, drei, XR e uma engine de física simultaneamente aumentaria o número de integrações sem melhorar o objetivo educativo essencial. A separação já implementada no domínio permite trocar o renderer sem reescrever as regras do jogo.

## Como aproveitar o Open MCT

O [projeto oficial](https://github.com/nasa/openmct) apresenta uma plataforma web para visualização e análise de telemetria. Sua [API](https://github.com/nasa/openmct/blob/master/API.md) organiza objetos e provedores de dados com metadados, unidades e tempo. Para o ASTRAL VITAIS, a oportunidade é um console posterior para instrutor e reprodução de sessões.

O adaptador proposto teria um namespace da simulação, um identificador por métrica, metadados explícitos de unidade e origem sintética, consulta histórica e assinatura de novas amostras. O motor atual continuaria sendo a fonte das ações; o Open MCT apenas consumiria sua saída. Isso evita colocar um segundo sistema de controle dentro da interface do aluno antes que exista uma necessidade operacional.

## Como aproveitar OSDR sem inventar monitoramento ao vivo

OSDR reúne dados de pesquisa espacial de diferentes organismos, missões e modalidades. A [apresentação oficial](https://science.nasa.gov/biological-physical/data/osdr/) descreve esse escopo; a [FAQ](https://science.nasa.gov/reference/osdr-faq/) aponta acesso por portal, API pública e bucket público. Um estudo disponível não equivale a um fluxo contínuo de frequência cardíaca de astronautas.

O tutorial oficial da [Biological Data API](https://github.com/nasa/OSDR_Tutorials/blob/main/source/pages/guides/biological_data_api.md) mostra consultas de metadados e dados. A integração proposta começa por metadados: accession, organismo, tecido ou material, assay, missão, condição experimental e arquivos disponíveis. Só depois são selecionadas séries apropriadas para visualização.

Para cada dado incorporado, o manifesto do produto deve conter URL de origem, identificador do estudo, versão ou data da coleta, tipo de acesso, licença/termos, unidade, população, método e transformações realizadas. A interface precisa distinguir dados humanos de animais ou modelos e resultados de laboratório de sinais de voo. O [guia de acesso controlado](https://github.com/nasa/OSDR_Tutorials/blob/main/source/pages/guides/request_controlled_access_datasets.md) mostra que certos arquivos humanos exigem solicitação específica; não presumir que todo dado do portal seja aberto.

O MVP mantém todos os sinais sintéticos. Não baixou prontuários nem implementou inferência clínica com dados OSDR. A oportunidade imediata é usar estudos curados para explicar por que cada decisão educativa existe.

## Ativos visuais NASA

A [coleção NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) é uma fonte possível de modelos de nave, instrumentos e texturas. As [diretrizes de imagens e mídia](https://www.nasa.gov/nasa-brand-center/images-and-media/) permitem diversos usos educativos e informativos, pedem reconhecimento de origem e tratam separadamente material de terceiros, marcas e pessoas identificáveis. O produto não deve sugerir endosso da agência.

A coleção [Blue Marble com topografia](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/) lista imagens globais JPEG de 5400 × 2700 e resoluções maiores. Pode servir como fonte para uma textura futura: selecionar um arquivo identificado, registrar crédito, baixar no processo de build, gerar tamanho adequado ao dispositivo e servir junto ao app. Não depender de hotlink em runtime para a cena principal.

Nesta entrega, a escolha é uma Terra estilizada procedural. Ela é uma representação artística, não um mapa científico. Isso reduz o acoplamento da demonstração a rede, formatos externos e arquivos pesados.

## Plano técnico por incremento

| Incremento | O que construir | Critério concreto para avançar |
|---|---|---|
| Beta educativa | Cena procedural, decisões, feedback, validade do sinal e retomada local | Percurso completo no desktop e no celular, decisões acessíveis sem depender do canvas |
| Cenários práticos | Estações e procedimentos em vários passos | Usuário consegue explicar o motivo de cada ação após concluir o exercício |
| Evidências de pesquisa | Catálogo OSDR curado com accession e proveniência | Cada gráfico informa organismo, missão, unidade, método e limites |
| Console de instrutor | Exportação de sessão e adaptador de telemetria; avaliar Open MCT | Uma sessão pode ser reproduzida com o mesmo estado e semente |
| XR | Cena com interação espacial e alternativa DOM | Verificação em aparelhos definidos, conforto, legibilidade e controles acessíveis |
| Pesquisa operacional | Integração a hardware em ambiente controlado | Finalidade, protocolo, equipe responsável e validação definidos antes do uso em decisões de saúde |

## Fontes primárias consultadas

- [Three.js — licença](https://github.com/mrdoob/three.js/blob/dev/LICENSE).
- [React Three Fiber — licença](https://github.com/pmndrs/react-three-fiber/blob/master/LICENSE).
- [drei — licença](https://github.com/pmndrs/drei/blob/master/LICENSE).
- [XR — licença](https://github.com/pmndrs/xr/blob/main/LICENSE).
- [Open MCT — repositório](https://github.com/nasa/openmct), [licença](https://github.com/nasa/openmct/blob/master/LICENSE.md) e [API](https://github.com/nasa/openmct/blob/master/API.md).
- [NASA 3D Resources — README](https://github.com/nasa/NASA-3D-Resources/blob/master/README.md).
- [NASA — imagens e mídia](https://www.nasa.gov/nasa-brand-center/images-and-media/).
- [NASA — OSDR](https://science.nasa.gov/biological-physical/data/osdr/), [FAQ](https://science.nasa.gov/reference/osdr-faq/) e [tutoriais](https://github.com/nasa/OSDR_Tutorials).
- [NASA — Blue Marble com topografia](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/).
