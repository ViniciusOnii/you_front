# YouVisa - Sistema de Acompanhamento de Vistos

Sistema web para gerenciamento e acompanhamento de processos de visto, desenvolvido com React e Tailwind CSS.

## Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e dev server de alta performance
- **Tailwind CSS** - Framework CSS utility-first
- **PostCSS** - Processador de CSS
- **Autoprefixer** - Plugin PostCSS para adicionar vendor prefixes

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/ViniciusOnii/you_front.git
cd you_front
```

2. Instale as dependências:

```bash
npm install
```

## Como Rodar o Projeto

### Modo de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em [http://localhost:5173](http://localhost:5173)

### Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build

Para visualizar a versão de produção localmente:

```bash
npm run preview
```

## Estrutura do Projeto

```
youvisa-react/
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Servicos.jsx
│   │   ├── Acompanhamento.jsx
│   │   └── Footer.jsx
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Entry point da aplicação
│   └── index.css       # Estilos globais e Tailwind
├── public/             # Arquivos estáticos
├── index.html          # HTML principal
├── package.json        # Dependências e scripts
├── vite.config.js      # Configuração do Vite
├── tailwind.config.js  # Configuração do Tailwind
└── postcss.config.js   # Configuração do PostCSS
```

## Funcionalidades

- Interface responsiva e moderna
- Acompanhamento de processos de visto
- Timeline de etapas do processo
- Sistema de status (concluído, em andamento, pendente)
- Barra de progresso dinâmica
- Listagem de documentos necessários

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

## Contato

Para mais informações, entre em contato através do repositório no GitHub.
