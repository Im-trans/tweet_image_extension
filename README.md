# Extensão Chromium Texto-Imagem

Extensão para navegadores baseados em Chromium que transforma um texto selecionado em uma imagem PNG e a copia automaticamente para a área de transferência.

O principal caso de uso é compartilhar trechos de texto no X (antigo Twitter). A imagem segue um visual inspirado em um card de tweet, contendo apenas o texto selecionado, sem nome, identificador de usuário, foto ou data.

## Recursos

- Conversão de texto selecionado em uma página para PNG.
- Acionamento pelo menu de contexto ou pelo botão da extensão na barra do navegador.
- Renderização do card com Canvas e resolução em escala 2x.
- Cópia da imagem para a área de transferência para posterior colagem.
- Estrutura de extensão baseada em Manifest V3.

## Instalação

1. Baixe o código-fonte e extraia o ZIP, caso esteja compactado.
2. No Chrome, digite `chrome://extensions` na barra de endereços.
3. Ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta `tweet_image_extension`, que contém o arquivo `manifest.json`.
6. Se desejar, fixe o ícone da extensão na barra do navegador.
7. Recarregue as páginas abertas antes da instalação para garantir o carregamento dos scripts da extensão.

Em outros navegadores baseados em Chromium, use a página equivalente de gerenciamento de extensões. A compatibilidade deve ser validada no navegador utilizado.

Não selecione a subpasta `nextjs_space`: ela não é a pasta da extensão.

## Como usar

### Pelo menu de contexto

1. Abra uma página e selecione o texto desejado.
2. Clique com o botão direito sobre a seleção.
3. Escolha **Converter para imagem**.
4. Após a confirmação de cópia, vá ao editor de destino e cole com **Ctrl+V** ou **Cmd+V**, conforme o sistema.

### Pelo botão da extensão

1. Selecione o texto na página.
2. Clique no ícone da extensão na barra do navegador.
3. No popup, clique em **Converter para imagem**.
4. Cole a imagem no destino desejado.

O aplicativo de destino precisa aceitar a colagem de imagens. A saída principal é a cópia para a área de transferência; isso não equivale a salvar automaticamente um arquivo PNG em disco.

## Como funciona

1. **Acionamento:** o usuário solicita a conversão pelo menu de contexto ou pelo popup.
2. **Captura:** a extensão obtém o texto selecionado na página.
3. **Renderização:** o renderizador compartilhado desenha o texto e o card em um Canvas.
4. **Conversão:** o conteúdo do Canvas é convertido em uma imagem PNG.
5. **Cópia:** a extensão tenta gravar a imagem na área de transferência e informa o resultado ao usuário.

A configuração visual documentada na implementação utiliza fundo escuro, card com bordas arredondadas, texto claro em fonte Georgia/serif e largura de referência de 600 px, com renderização em escala 2x. A altura acompanha o conteúdo renderizado.

A imagem contém apenas o texto, não uma captura de tela da página nem os dados de perfil do modelo visual de referência.

## Organização do código

- `manifest.json`: configuração Manifest V3, permissões e registro dos componentes.
- `background.js`: service worker responsável pelo menu de contexto.
- `content.js`: integração com a página, captura da seleção e fluxo de conversão/cópia.
- `popup.html`: interface exibida pelo botão da extensão.
- `popup.js`: lógica de acionamento pelo popup.
- `icons/`: ícones da extensão.
- **Renderizador compartilhado:** componente utilizado pelos scripts de conteúdo e pelo popup para gerar o card.

## Atualização e solução de problemas

Após substituir os arquivos por uma versão atualizada:

1. Abra `chrome://extensions`.
2. Clique no botão de recarregar da extensão.
3. Recarregue também a página em que fará o teste.
4. Selecione novamente o texto e teste os dois métodos de acionamento.

Se a imagem não for copiada:

- Confirme que existe texto selecionado antes de acionar a extensão.
- Teste em uma página web comum. Páginas internas do navegador, como `chrome://extensions`, possuem restrições à execução de extensões.
- Mantenha a página ou o popup em foco durante a operação; o acesso à área de transferência pode depender de foco, interação do usuário e permissões do navegador.
- Verifique se o destino aceita colar imagens.
- Consulte os erros exibidos no gerenciador de extensões. O console da página, isoladamente, pode não mostrar erros do service worker ou do popup.
- Ao relatar uma falha, inclua a mensagem completa do erro, o navegador utilizado e o método de acionamento.

### Estado de validação

Foi relatada uma falha na conversão/cópia. Uma correção com renderizador compartilhado e ajustes no fluxo de acionamento foi aplicada, mas a confirmação de funcionamento após essa correção ainda depende de novo teste do usuário.

## Licença

Este projeto adota a **licença BSD de 3 cláusulas (BSD-3-Clause)**, reproduzida abaixo. Ela permite uso, modificação e redistribuição, inclusive comercial, desde que suas condições sejam respeitadas.

**Antes de distribuir o projeto, substitua `[ANO]` e `[TITULAR DOS DIREITOS AUTORAIS]` pelos dados corretos.** Esses campos foram mantidos como placeholders porque a titularidade e o ano do aviso de copyright não foram informados.

### BSD 3-Clause License

Copyright (c) [ANO], [TITULAR DOS DIREITOS AUTORAIS]

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
