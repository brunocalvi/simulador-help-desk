# Simulador Help Desk

Este projeto é um simulador de sistema de help desk, projetado para gerenciar chamados e organizar atendimentos por uma fila. A aplicação foi desenvolvida em Node.js, utilizando uma arquitetura modular e boas práticas de desenvolvimento.

## Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do JavaScript no servidor.
- **Express**: Framework para criação de aplicações web.
- **Consign**: Gerenciamento automático de dependências e carregamento de módulos.
- **Sequelize**: ORM para manipulação de banco de dados relacional.
- **MySQL**: Banco de dados relacional.
- **Redis**: Para armazenamento dos jobs em memória durante o processamento.
- **Bull**: Sistema de filas baseado em Redis para Node
- **Supertest**: Biblioteca para testes de integração com APIs.
- **Jest**: Framework de testes para garantir a qualidade do código.

## Funcionalidades

- **Registro de Balcões de Atendimento**: Criação e organização dos pontos de atendimento.
- **Gestão de Usuários**: Registro de novos usuários e controle de acesso.
- **Abertura de Chamados**: Registra e acompanha chamados realizados pelos usuários.
- **Relatórios**: Gera relatórios básicos de atendimentos.

## Estrutura do Projeto

```plaintext
├── controllers   # Controladores para gerenciar a lógica de negócio.
├── jobs          # Processamento dos Jobs das filas para trabalho em backlog.
├── models        # Definições das entidades e manipulações no banco de dados.
├── routes        # Configuração de rotas da API.
├── tests         # Testes automatizados (unitários e de integração).
├── app.js        # Configuração principal do servidor.
└── README.md     # Documentação do projeto.
```

## Como Executar o Projeto

### Requisitos

- Node.js (v16 ou superior)
- NPM ou Yarn
- MySQL
- Serviço Redis

### Passos para Execução

1. Clone o repositório:
   ```bash
   git clone https://github.com/brunocalvi/simulador-help-desk.git
   cd simulador-help-desk
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Inicie o servidor:
   ```bash
   npm run start
   # ou
   yarn run start
   ```

4. Acesse a aplicação em [http://localhost:3001](http://localhost:3001).

### Executando os Testes

Para rodar os testes automatizados:
```bash
npm run test
# ou
yarn run test
```

## Autor

Desenvolvido por [Bruno Calvi](https://github.com/brunocalvi).

---

Aproveite e contribua para tornar este projeto ainda melhor!

