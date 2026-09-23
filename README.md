# Letia Quadras

Sistema web para operação de complexos esportivos, com foco em reservas de quadras, disponibilidade de horários e gestão de mensalistas.

## Funcionalidades

- **Visão geral:** resumo operacional e disponibilidade rápida.
- **Agenda:** visualizações diária e semanal, filtro por quadra e indicação do horário atual.
- **Reservas:** criação de reservas com nome, duração, recorrência e status manual de pagamento.
- **Disponibilidade:** horários livres, ocupados, passados e bloqueados por mensalistas.
- **Minhas quadras:** cadastro, edição, preço fixo por hora, horário de funcionamento e ativação.
- **Mensalistas:** cadastro rápido de recorrências semanais, visão macro dos horários e ativação/desativação.
- **Preços por quadra:** cada quadra possui seu próprio valor por hora; reservas de múltiplas horas calculam o total automaticamente.
- **Interface responsiva:** layout construído com Angular e Tailwind CSS.

## Stack

- Angular 19
- TypeScript
- Tailwind CSS 3
- PostCSS
- RxJS

## Requisitos

- Node.js 20+
- npm 10+

## Instalação

```bash
npm install
```

## Desenvolvimento

Inicie o servidor local:

```bash
npm start
```

Depois acesse [http://localhost:4200](http://localhost:4200).

O Angular recarrega a aplicação automaticamente após alterações nos arquivos.

## Build

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos compilados são gerados em `dist/quadrahub`.

## Testes

Execute os testes unitários com:

```bash
npm test
```

O projeto usa Karma e Jasmine, conforme a configuração padrão do Angular CLI.

## Estrutura principal

```text
src/
└── app/
    ├── agenda/              # Agenda diária e semanal
    ├── courts/              # Gestão de quadras
    ├── monthly/             # Gestão de mensalistas
    ├── overview/            # Visão geral e disponibilidade rápida
    ├── reservation-modal/   # Reservas, detalhes e formulários
    ├── sidebar/             # Navegação principal
    ├── app.component.*      # Estado e composição da aplicação
    └── models.ts            # Modelos de quadras, reservas e mensalistas
```

## Observações

Este MVP mantém os dados em memória no `AppComponent`. Ao recarregar a página, as alterações feitas durante a sessão são perdidas. A integração com API, autenticação e persistência em banco de dados ainda não faz parte deste escopo.
