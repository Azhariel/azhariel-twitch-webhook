# azhariel-twitch-webhook

> Ou como aprender os básicos de fullstack na prática.

Esse projeto nasceu como um desafio para aprender:

 - Javascript;
 - APIs em geral;
 - API da Twitch.tv;
 - HTML/CSS.

O objetivo é criar uma página estática que responda aos alertas da Twitch, quais sejam: novo seguidor, novo inscrito, nova doação, novo *cheer*, nova *raid*. Ainda, a página deve apresentar elementos na tela em resposta a comandos enviados no chat, definidos pelo operador `!nome_do_comando`

# Arquivos

O projeto é constituído de diversos arquivos que podem ser divididos entre *backend* e *frontend*. 
## Backend

Os principais arquivos "do lado do servidor" são `index.js`, `.env` e `package.json`. O servidor roda **Node.js.**

 - `index.js` é o motor base do projeto: uma implementação de servidor HTTP utilizando **Express** e **ws** para gerenciar as conexão WebSocket. Além da inicialização desse servidor, aqui também são definidas as rotas e os eventos que cada rota ativa.
 - `.env` contém as variáveis de ambiente.
 - `package.json` define as dependências e forma de rodar o servidor para o **npm** (parte do Node.js). 
 
**Itens faltantes:**
 - [ ] Reunir a implementação já pronta de autenticação com o servidor da Twitch no mesmo servidor. Atualmente, está rodando em separado, e a dificuldade de reunir as implementações é o fato daquela rodar como módulo. Aprender a unir e exportar o módulo deve resolver.

## Frontend
Os principais arquivos "do lado do cliente" estão dentro da pasta `Public` e são: `index.html`, `glitch.css`, `websocket_handler.js`.

- `index.html` é a página estática servida pelo servidor. Ela deve definir os objetos disponíveis para manipulação: área para alertas e área para efeitos de `!comandos`. Outra possibilidade é separar em duas páginas e deixar uma exclusiva para alertas e outra para comandos - talvez seja melhor para não causar conflitos na execução de um no outro.
- `glitch.css` é a *stylesheet* do `index.html`. Aqui ficam as definições de posicionamento e estilo dos elementos definidos em HTML.
- `websocket_handler.js` é o script responsável por realizar a conexão via WebSocket com o servidor e, ao receber eventos, manipular os elementos HTML de acordo com o evento recebido.

**Itens Faltantes:**
- [ ] Alertas de:
- - [ ] Inscrição
- - [ ] Doação
- - [ ] *Cheer*
- - [ ] *Raid*
- [ ] Implementar animação de *fade in* e *fade out* nos alertas
- [ ] Implementar um *timer* para que, caso dois eventos aconteçam em seguida, um não se sobreponha ao outro.
- [ ] Implementar resposta a `!comandos`.

# Implementação
Este repositório está sincronizado e pode ser visualizado rodando no [Heroku](https://azhariel-twitch-webhook.herokuapp.com/). Infelizmente, dada a natureza do projeto e a autenticação não estar implementada no servidor, o projeto não responde aos alertas. Ainda assim, pode ser testado utilizando qualquer ferramenta que permita enviar POST/GET. 
