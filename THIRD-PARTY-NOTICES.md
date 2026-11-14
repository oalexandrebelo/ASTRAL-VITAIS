# ASTRAL VITAIS - Licenças e avisos de terceiros

Inventário da beta 0.1.0-beta.1, revisado em 14/11/2026. As versões abaixo foram conferidas nos pacotes instalados. O `package-lock.json` registra a resolução completa das dependências.

## Código e assets originais

O código autoral, a identidade ASTRAL VITAIS, os ícones, as geometrias do astronauta, as texturas procedurais, as estrelas e o áudio sintetizado integram o projeto sob a [licença MIT](LICENSE). Essa licença não altera os direitos das dependências, publicações, marcas ou conteúdos referenciados.

A representação da Terra é artística e gerada pelo projeto. Não foram incorporados modelos, texturas, logotipos ou imagens oficiais da NASA. Não há arquivos de fontes tipográficas distribuídos; a interface usa a família disponível no sistema conforme a pilha CSS.

## Dependências de execução

| Pacote | Versão conferida | Licença | Origem |
|---|---|---|---|
| React | 19.3.1 | MIT | [facebook/react](https://github.com/facebook/react) |
| React DOM | 19.3.1 | MIT | [facebook/react](https://github.com/facebook/react) |
| Scheduler, dependência do React DOM | 0.28.0 | MIT | [facebook/react](https://github.com/facebook/react) |
| Three.js | 0.187.0 | MIT | [mrdoob/three.js](https://github.com/mrdoob/three.js) |

Os avisos completos abaixo devem acompanhar cópias ou partes substanciais desses componentes. Para servir ou redistribuir o build, mantenha este arquivo acessível junto à distribuição. Licença do aplicativo e licença de componente são camadas distintas.

### React, React DOM e Scheduler

Os três pacotes acima compartilham o seguinte aviso de licença, preservado dos arquivos distribuídos pelos pacotes:

```text
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Three.js

Aviso preservado de `three/LICENSE`:

```text
The MIT License

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## Ferramentas de desenvolvimento e build

| Pacote | Versão conferida | Licença do pacote principal | Origem |
|---|---|---|---|
| Vite | 7.3.8 | MIT | [vitejs/vite](https://github.com/vitejs/vite) |
| Vitest | 4.1.12 | MIT | [vitest-dev/vitest](https://github.com/vitest-dev/vitest) |
| TypeScript | 5.9.3 | Apache-2.0 | [microsoft/TypeScript](https://github.com/microsoft/TypeScript) |
| @vitejs/plugin-react | 5.2.0 | MIT | [vitejs/vite-plugin-react](https://github.com/vitejs/vite-plugin-react) |
| @types/react | 19.3.0 | MIT | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| @types/react-dom | 19.3.0 | MIT | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| @types/three | 0.187.0 | MIT | [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |

O repositório não redistribui `node_modules`. A instalação por `npm ci` obtém os pacotes com suas licenças originais. Dependências transitivas podem usar outras licenças; a licença do pacote principal não cobre automaticamente todo conteúdo de terceiros.

O compilador TypeScript está sob [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Os arquivos de licença e eventuais avisos distribuídos pelo próprio pacote são a referência para redistribuí-lo. Vite e Vitest também mantêm avisos para código de terceiros dentro de suas distribuições.

### Vite: núcleo e código de suporte do build

O aviso do núcleo é reproduzido abaixo porque o build pode incluir código de suporte gerado pelo Vite. Para redistribuir a ferramenta inteira, consulte também a lista de dependências agrupadas em `vite/LICENSE.md`.

```text
# Vite core license
Vite is released under the MIT license:

MIT License

Copyright (c) 2019-present, VoidZero Inc. and Vite contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Publicações científicas referenciadas

Os documentos abaixo foram analisados e citados. Seus PDFs e figuras não são redistribuídos neste repositório:

1. Overbey et al. *Collection of biospecimens from the inspiration4 mission establishes the standards for the space omics and medical atlas (SOMA)*. Nature Communications 15, 4964 (2024). [DOI: 10.1038/s41467-024-48806-z](https://doi.org/10.1038/s41467-024-48806-z).
2. Overbey et al. *The Space Omics and Medical Atlas (SOMA) and international astronaut biobank*. Nature 632, 1145-1154 (2024). [DOI: 10.1038/s41586-024-07639-y](https://doi.org/10.1038/s41586-024-07639-y).

O primeiro artigo informa uma condição específica CC BY-NC-ND 4.0 para determinadas figuras produzidas com BioRender. O segundo utiliza CC BY 4.0, com ressalvas para materiais de terceiros identificados nos créditos. A consulta e a citação de um artigo não autorizam presumir que todas as suas figuras tenham a mesma licença.

As sínteses do projeto são originais, com referências aos autores e às fontes. A documentação não altera a licença de publicação e não apresenta os resultados como validação clínica do ASTRAL VITAIS.

## NASA, ESA, CSA e outras fontes

NASA, ESA e Canadian Space Agency são citadas como fontes de informação. Seus nomes não indicam vínculo, parceria, patrocínio, aprovação ou certificação do projeto.

A aplicação contém links para normas, páginas técnicas, artigos e recursos dessas instituições. Os documentos oficiais, suas marcas e eventuais conteúdos de terceiros permanecem sujeitos aos termos da origem. Não foram incorporados vídeos da ESA, modelos do acervo NASA 3D Resources ou figuras científicas.

O material visual do desafio fornecido como referência não integra os assets distribuídos. O repositório usa identidade própria e mantém a atribuição factual das fontes na documentação e na interface.

## Recursos avaliados que não são dependências

React Three Fiber, drei, pmndrs/xr, Open MCT, NASA 3D Resources e OSDR Tutorials foram avaliados como possibilidades de evolução. Sua menção em [REPOSITORIOS.md](docs/REPOSITORIOS.md) não significa incorporação ao build nem relicenciamento de seus conteúdos.

Antes de importar um novo modelo, textura, dataset, exemplo ou pacote, registre a origem, a versão, a licença aplicável ao item, os avisos exigidos e as transformações realizadas. Esse registro deve acompanhar a integração correspondente.
