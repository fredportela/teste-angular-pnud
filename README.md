# Sistema de Listagem e Gestão de Usuários - Angular 16

Este projeto é uma aplicação Single Page Application (SPA) desenvolvida em Angular 16 com Angular Material, responsiva e otimizada para dispositivos móveis. O objetivo é listar, cadastrar e editar usuários consumindo uma API REST externa ou um mock local.

## Funcionalidades

- Listagem de usuários
- Cadastro de novos usuários
- Edição de usuários existentes
- Interface responsiva e acessível
- Uso de Angular Material para UI
- Consumo de APIs de forma reativa
- Código modular e escalável

## Tecnologias Utilizadas

- [Angular 16](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [RxJS](https://rxjs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/)

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Angular CLI](https://angular.io/cli)

## Instalação

Clone o repositório:
```bash
git clone https://github.com/fredportela/teste-angular-pnud.git
cd teste-angular-pnud
```

Instale as dependências:
```bash
npm install
```

## Executando o projeto com API Mock

Para rodar o projeto utilizando uma API mockada:
```bash
npm run start:all
```
ou
```bash
npm run mock:server
npm start
```
 
O comando `mock:server` iniciará o servidor fake para simular a API.

## Executando o projeto com API Externa

Configure a URL da API no arquivo `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

Inicie a aplicação:
```bash
npm start
```

## Scripts Disponíveis

- `npm start` - Inicia a aplicação em modo de desenvolvimento
- `npm run start:all` - Inicia a aplicação em modo de desenvolvimento com o servidor de API mockada
- `npm run build` - Cria o build de produção
- `npm run mock:server` - Inicia o servidor de API mockada

## Estrutura de Pastas

```plaintext
src/
├── app/
│   ├── core/             # Services, models e utilidades
│   ├── shared/           # Componentes compartilhados
│   ├── features/         # Modulos de funcionalidades
│   ├── app-routing.module.ts
│   └── app.module.ts
├── assets/               # Recursos estáticos
└── environments/         # Configurações de ambiente
```

## Autor

Desenvolvido por [FredPortela](https://github.com/fredportela)
