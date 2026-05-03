# YouVisa - Sistema de Acompanhamento de Vistos

Sistema web completo para gerenciamento e acompanhamento de processos de visto, desenvolvido com React e Tailwind CSS. Inclui chatbot inteligente com assistente virtual (Inho) e geração de guias turísticos em PDF.

## Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e dev server de alta performance
- **Tailwind CSS** - Framework CSS utility-first
- **PostCSS** - Processador de CSS
- **Autoprefixer** - Plugin PostCSS para adicionar vendor prefixes
- **jsPDF** - Biblioteca para geração de PDFs no cliente
- **jsPDF AutoTable** - Plugin para tabelas e layouts avançados em PDF

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
│   ├── components/           # Componentes React reutilizáveis
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Servicos.jsx
│   │   ├── Acompanhamento.jsx
│   │   ├── Footer.jsx
│   │   ├── FalcaoChatbot.jsx    # 🦅 Chatbot Inho (novo!)
│   │   └── FalcaoChatbot.css    # Estilos do chatbot
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Entry point da aplicação
│   └── index.css            # Estilos globais e Tailwind
├── public/
│   └── falcao-youvisa.png   # Imagem do mascote Inho
├── index.html               # HTML principal
├── package.json             # Dependências e scripts
├── vite.config.js           # Configuração do Vite
├── tailwind.config.js       # Configuração do Tailwind
└── postcss.config.js        # Configuração do PostCSS
```

## Funcionalidades

### 📋 Sistema de Acompanhamento de Vistos
- Interface responsiva e moderna
- Acompanhamento de processos de visto em tempo real
- Timeline de etapas do processo
- Sistema de status (concluído, em andamento, pendente)
- Barra de progresso dinâmica
- Listagem de documentos necessários

### 🦅 Chatbot Inteligente - Inho
O assistente virtual YouVisa com animações realistas de voo:

- **Animação de Batida de Asas Realista** - Movimentos naturais de falcão pairando
- **Sistema de Conversação Interativo** - Interface de chat completa com mensagens em tempo real
- **Indicador de Digitação** - Feedback visual enquanto o Inho está respondendo
- **Menu de Opções Rápidas:**
  - 📋 Ver status do visto
  - 🗺️ Pontos turísticos do destino
  - 📄 Documentos necessários
  - 📅 Agendar atendimento

### 🗺️ Guia Turístico Personalizado
- **Recomendações de Pontos Turísticos** baseadas no destino do visto
- **Base de dados com 5 países:**
  - 🇺🇸 Estados Unidos (Nova York, Miami, Orlando)
  - 🇫🇷 França (Paris)
  - 🇮🇹 Itália (Roma, Veneza)
  - 🇪🇸 Espanha (Barcelona, Madrid)
  - 🇵🇹 Portugal (Lisboa)

### 📄 Geração de PDF Premium
- **Design Profissional Tipo Revista** - Layout moderno e elegante
- **Capa Personalizada** - Com nome do destino e informações do guia
- **Cards de Atrações** - Cada ponto turístico com:
  - Ícone específico do tipo (🗿 🏛️ 🌳 🏖️ etc)
  - Nome, tipo e descrição detalhada
  - Link clicável para Google Maps
- **Seção de Dicas de Viagem** - Recomendações úteis com ícones
- **Footer Profissional** - Contatos, logo e numeração de páginas
- **Download Automático** - PDF gerado e baixado instantaneamente

## 🎯 Como Usar o Chatbot Inho

1. **Acesse a aplicação** em http://localhost:5173
2. **Veja o Inho** no canto inferior direito da tela com animações de voo
3. **Clique em "Iniciar Conversa"** para abrir o chat
4. **Escolha uma opção rápida** ou digite sua pergunta
5. **Para guia turístico:**
   - Clique em "🗺️ Pontos turísticos do destino"
   - Digite o nome do país ou cidade (ex: "nova york", "paris")
   - Veja as recomendações no chat
   - Digite "sim" ou "pdf" para baixar o guia em PDF

## 📸 Screenshots

### Chatbot Inho em Ação
O mascote falcão com animações realistas de batida de asas aparece no canto inferior direito da tela.

### Interface de Chat
Sistema completo de mensagens com:
- Mensagens do Inho (lado esquerdo, fundo branco)
- Mensagens do usuário (lado direito, fundo verde)
- Avatar do Inho em cada mensagem
- Indicador de digitação animado

### PDF Gerado
Guia turístico profissional com design tipo revista, incluindo capa personalizada, cards de atrações e links clicáveis.

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
