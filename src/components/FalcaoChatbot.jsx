import React, { useState, useEffect, useRef } from 'react';
import './FalcaoChatbot.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { enviarMensagemAoAgente, transcreverAudio, verificarBackend } from '../services/agentClient';
import { useAuth } from '../context/AuthContext';
import { useProcessos } from '../context/ProcessosContext';

const FalcaoChatbot = () => {
  const { user } = useAuth();
  const { processos } = useProcessos();
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    verificarBackend().then((r) => setBackendOnline(r.online));
  }, []);

  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [waitingForDestination, setWaitingForDestination] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  // Base de dados de pontos turísticos
  const touristAttractions = {
    'estados unidos': {
      country: 'Estados Unidos',
      cities: {
        'nova york': [
          { name: 'Estátua da Liberdade', type: 'Monumento', description: 'Símbolo icônico da liberdade americana' },
          { name: 'Central Park', type: 'Parque', description: 'Enorme parque urbano no coração de Manhattan' },
          { name: 'Empire State Building', type: 'Arranha-céu', description: 'Vista panorâmica de 360° da cidade' },
          { name: 'Times Square', type: 'Distrito', description: 'Centro vibrante de entretenimento e luzes' },
          { name: 'Museu Metropolitano de Arte (MET)', type: 'Museu', description: 'Uma das maiores coleções de arte do mundo' }
        ],
        'miami': [
          { name: 'South Beach', type: 'Praia', description: 'Praia famosa com águas cristalinas' },
          { name: 'Distrito Art Déco', type: 'Arquitetura', description: 'Edifícios históricos coloridos dos anos 1930' },
          { name: 'Everglades', type: 'Parque Nacional', description: 'Maior área selvagem subtropical dos EUA' },
          { name: 'Wynwood Walls', type: 'Arte', description: 'Museu ao ar livre de arte de rua' }
        ],
        'orlando': [
          { name: 'Walt Disney World', type: 'Parque Temático', description: 'O mais famoso parque temático do mundo' },
          { name: 'Universal Studios', type: 'Parque Temático', description: 'Aventuras cinematográficas e Harry Potter' },
          { name: 'SeaWorld', type: 'Parque Aquático', description: 'Vida marinha e shows incríveis' }
        ]
      }
    },
    'frança': {
      country: 'França',
      cities: {
        'paris': [
          { name: 'Torre Eiffel', type: 'Monumento', description: 'Símbolo da França e de Paris' },
          { name: 'Museu do Louvre', type: 'Museu', description: 'Maior museu de arte do mundo, lar da Mona Lisa' },
          { name: 'Catedral de Notre-Dame', type: 'Igreja', description: 'Obra-prima da arquitetura gótica' },
          { name: 'Arco do Triunfo', type: 'Monumento', description: 'Monumento histórico em homenagem aos soldados franceses' },
          { name: 'Montmartre', type: 'Bairro', description: 'Bairro boêmio com a Basílica de Sacré-Cœur' }
        ]
      }
    },
    'itália': {
      country: 'Itália',
      cities: {
        'roma': [
          { name: 'Coliseu', type: 'Monumento', description: 'Anfiteatro romano de 2000 anos' },
          { name: 'Vaticano', type: 'Estado/Religioso', description: 'Capela Sistina e Basílica de São Pedro' },
          { name: 'Fontana di Trevi', type: 'Fonte', description: 'Famosa fonte barroca, jogue uma moeda!' },
          { name: 'Panteão', type: 'Templo', description: 'Templo romano dedicado aos deuses' }
        ],
        'veneza': [
          { name: 'Praça de São Marcos', type: 'Praça', description: 'Coração de Veneza com a Basílica' },
          { name: 'Canal Grande', type: 'Canal', description: 'Principal canal de Veneza, passeio de gôndola' },
          { name: 'Ponte de Rialto', type: 'Ponte', description: 'Ponte mais antiga sobre o Canal Grande' }
        ]
      }
    },
    'espanha': {
      country: 'Espanha',
      cities: {
        'barcelona': [
          { name: 'Sagrada Família', type: 'Basílica', description: 'Obra-prima inacabada de Gaudí' },
          { name: 'Park Güell', type: 'Parque', description: 'Parque colorido projetado por Gaudí' },
          { name: 'La Rambla', type: 'Avenida', description: 'Famosa avenida para caminhadas' },
          { name: 'Casa Batlló', type: 'Arquitetura', description: 'Edifício modernista de Gaudí' }
        ],
        'madrid': [
          { name: 'Museu do Prado', type: 'Museu', description: 'Uma das maiores coleções de arte europeia' },
          { name: 'Palácio Real', type: 'Palácio', description: 'Residência oficial da família real espanhola' },
          { name: 'Plaza Mayor', type: 'Praça', description: 'Praça histórica do século XVII' }
        ]
      }
    },
    'portugal': {
      country: 'Portugal',
      cities: {
        'lisboa': [
          { name: 'Torre de Belém', type: 'Torre', description: 'Torre fortificada símbolo da Era dos Descobrimentos' },
          { name: 'Mosteiro dos Jerónimos', type: 'Mosteiro', description: 'Obra-prima da arquitetura manuelina' },
          { name: 'Bairro de Alfama', type: 'Bairro', description: 'Bairro mais antigo com casas de fado' },
          { name: 'Elevador de Santa Justa', type: 'Elevador', description: 'Elevador neogótico com vista panorâmica' }
        ]
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simula resposta do Inho
  const sendInhoMessage = (text, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { text, sender: 'inho', timestamp: new Date() }]);
      setIsTyping(false);
    }, delay);
  };

  // Opções rápidas do menu
  const quickOptions = [
    { id: 'status', label: 'Ver status do meu visto', icon: '📋' },
    { id: 'pontos-turisticos', label: 'Pontos turísticos do destino', icon: '🗺️' },
    { id: 'documentos', label: 'Documentos necessários', icon: '📄' },
    { id: 'agendamento', label: 'Agendar atendimento', icon: '📅' }
  ];

  // Mapa de ícones por tipo de atração
  const getIconForType = (type) => {
    const icons = {
      'Monumento': '🗿',
      'Museu': '🏛️',
      'Parque': '🌳',
      'Praia': '🏖️',
      'Torre': '🗼',
      'Igreja': '⛪',
      'Basílica': '⛪',
      'Arranha-céu': '🏢',
      'Distrito': '🏘️',
      'Arquitetura': '🏛️',
      'Parque Temático': '🎢',
      'Parque Aquático': '🐬',
      'Parque Nacional': '🏞️',
      'Arte': '🎨',
      'Fonte': '⛲',
      'Templo': '🛕',
      'Praça': '🏛️',
      'Canal': '⛵',
      'Ponte': '🌉',
      'Avenida': '🛣️',
      'Palácio': '🏰',
      'Bairro': '🏘️',
      'Elevador': '🚡',
      'Mosteiro': '⛪'
    };
    return icons[type] || '📍';
  };

  // Função para gerar PDF com pontos turísticos - VERSÃO PREMIUM V2
  const generateTouristPDF = (country, city, attractions) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // ========== CAPA ESTILO REVISTA ==========

    // Background gradiente suave
    doc.setFillColor(245, 252, 250);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header bar com gradiente
    doc.setFillColor(0, 168, 132);
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Pattern decorativo no header
    for (let i = 0; i < 15; i++) {
      doc.setFillColor(255, 255, 255, 0.1);
      doc.circle(10 + (i * 15), 10, 3, 'F');
    }

    // Logo YOUVISA
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.setFont(undefined, 'bold');
    doc.text('YOUVISA', pageWidth / 2, 28, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('GUIA DE VIAGEM EXCLUSIVO', pageWidth / 2, 38, { align: 'center' });

    // Linha decorativa
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(margin, 50, pageWidth - margin, 50);

    // Card principal com destino
    const cardY = 75;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, cardY, pageWidth - (margin * 2), 45, 5, 5, 'F');

    // Sombra do card
    doc.setDrawColor(0, 168, 132, 0.1);
    doc.setLineWidth(0);
    doc.setFillColor(0, 168, 132, 0.05);
    doc.roundedRect(margin + 1, cardY + 1, pageWidth - (margin * 2), 45, 5, 5, 'F');

    // Conteúdo do card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, cardY, pageWidth - (margin * 2), 45, 5, 5, 'F');

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('DESTINO', pageWidth / 2, cardY + 12, { align: 'center' });

    doc.setTextColor(0, 168, 132);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text(city.toUpperCase(), pageWidth / 2, cardY + 25, { align: 'center' });

    doc.setTextColor(120, 120, 120);
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(country, pageWidth / 2, cardY + 35, { align: 'center' });

    // Info badges
    let yPos = 135;

    const infoBoxWidth = (pageWidth - (margin * 2) - 10) / 2;

    // Badge 1 - Data
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, yPos, infoBoxWidth, 20, 3, 3, 'F');

    doc.setTextColor(0, 168, 132);
    doc.setFontSize(18);
    doc.text('📅', margin + 8, yPos + 13);

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('GERADO EM', margin + 20, yPos + 8);

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(new Date().toLocaleDateString('pt-BR'), margin + 20, yPos + 15);

    // Badge 2 - Atrações
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + infoBoxWidth + 10, yPos, infoBoxWidth, 20, 3, 3, 'F');

    doc.setTextColor(0, 168, 132);
    doc.setFontSize(18);
    doc.text('🎯', margin + infoBoxWidth + 18, yPos + 13);

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('ATRAÇÕES', margin + infoBoxWidth + 30, yPos + 8);

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`${attractions.length} lugares`, margin + infoBoxWidth + 30, yPos + 15);

    // Nova página para conteúdo
    doc.addPage();
    doc.setFillColor(245, 252, 250);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    yPos = margin + 10;

    // ========== TÍTULO DA SEÇÃO ==========
    doc.setTextColor(0, 168, 132);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('Pontos Turísticos', margin, yPos);

    doc.setTextColor(120, 120, 120);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Descubra os melhores lugares para visitar', margin, yPos + 8);

    // Linha decorativa
    doc.setDrawColor(0, 168, 132);
    doc.setLineWidth(2);
    doc.line(margin, yPos + 12, margin + 50, yPos + 12);

    yPos += 25;

    // ========== ATRAÇÕES COM CARDS REDESENHADOS ==========
    attractions.forEach((attraction, index) => {
      const cardHeight = 55;

      // Verificar espaço na página
      if (yPos > pageHeight - 70) {
        doc.addPage();
        doc.setFillColor(245, 252, 250);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        yPos = margin + 10;
      }

      // Card principal
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, yPos, pageWidth - (margin * 2), cardHeight, 4, 4, 'F');

      // Accent bar lateral
      doc.setFillColor(0, 168, 132);
      doc.roundedRect(margin, yPos, 5, cardHeight, 4, 4, 'F');

      // Ícone do tipo de atração
      const icon = getIconForType(attraction.type);
      doc.setFontSize(24);
      doc.text(icon, margin + 15, yPos + 20);

      // Número
      doc.setFillColor(0, 168, 132);
      doc.circle(margin + 15, yPos + 42, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}`, margin + 15, yPos + 45, { align: 'center' });

      // Nome da atração
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      const nameLines = doc.splitTextToSize(attraction.name, pageWidth - margin * 2 - 50);
      doc.text(nameLines, margin + 35, yPos + 12);

      // Badge tipo
      const nameHeight = nameLines.length * 6;
      doc.setFillColor(240, 250, 248);
      const badgeY = yPos + 12 + nameHeight + 3;
      const badgeWidth = doc.getTextWidth(attraction.type) + 10;
      doc.roundedRect(margin + 35, badgeY, badgeWidth, 8, 3, 3, 'F');

      doc.setTextColor(0, 168, 132);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text(attraction.type, margin + 40, badgeY + 6);

      // Descrição
      doc.setTextColor(90, 90, 90);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const descY = badgeY + 11;
      const descLines = doc.splitTextToSize(attraction.description, pageWidth - margin * 2 - 50);
      doc.text(descLines, margin + 35, descY);

      // Link Google Maps com botão
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.name + ' ' + city + ' ' + country)}`;

      const linkY = yPos + cardHeight - 12;

      doc.setFillColor(0, 120, 215, 0.1);
      doc.roundedRect(margin + 35, linkY - 5, 55, 10, 2, 2, 'F');

      doc.setTextColor(0, 120, 215);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.textWithLink('📍 ABRIR NO MAPA', margin + 38, linkY, { url: mapsUrl });

      // Linha divisória sutil
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.line(margin + 10, yPos + cardHeight, pageWidth - margin - 10, yPos + cardHeight);

      yPos += cardHeight + 8;
    });

    // ========== DICAS DE VIAGEM REDESENHADAS ==========
    yPos += 10;

    if (yPos > pageHeight - 100) {
      doc.addPage();
      doc.setFillColor(245, 252, 250);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      yPos = margin + 10;
    }

    // Card de dicas
    doc.setFillColor(255, 250, 235);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 70, 4, 4, 'F');

    // Accent bar
    doc.setFillColor(255, 193, 7);
    doc.roundedRect(margin, yPos, 5, 70, 4, 4, 'F');

    // Título
    doc.setTextColor(200, 120, 0);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('💡 Dicas Importantes', margin + 15, yPos + 12);

    // Dicas com ícones
    const tips = [
      { icon: '⏰', text: 'Verifique horários de funcionamento antes de visitar' },
      { icon: '🎫', text: 'Compre ingressos online com antecedência' },
      { icon: '🚇', text: 'Use transporte público para economizar' },
      { icon: '🤝', text: 'Respeite costumes e regras locais' }
    ];

    doc.setTextColor(80, 60, 0);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    tips.forEach((tip, index) => {
      const tipY = yPos + 24 + (index * 10);

      doc.setFontSize(11);
      doc.text(tip.icon, margin + 15, tipY);

      doc.setFontSize(9);
      const tipLines = doc.splitTextToSize(tip.text, pageWidth - margin * 2 - 35);
      doc.text(tipLines, margin + 25, tipY);
    });

    // ========== FOOTER ELEGANTE ==========
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      const footerY = pageHeight - 12;

      // Linha decorativa
      doc.setDrawColor(0, 168, 132);
      doc.setLineWidth(1);
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

      // Logo pequeno
      doc.setTextColor(0, 168, 132);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text('YOUVISA', margin, footerY);

      // Informações de contato
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(7);
      doc.setFont(undefined, 'normal');
      doc.text('www.youvisa.com.br | contato@youvisa.com.br | (11) 3456-7890', pageWidth / 2, footerY, { align: 'center' });

      // Número da página
      doc.setTextColor(0, 168, 132);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text(`${i}`, pageWidth - margin, footerY, { align: 'right' });
    }

    // Salvar PDF
    doc.save(`guia-turistico-${city.toLowerCase().replace(/\s/g, '-')}.pdf`);
  };

  const handleStartChat = () => {
    setIsChatOpen(true);
    setMessages([
      { text: 'Olá! Sou o Inho, seu assistente virtual da YouVisa! Como posso ajudar você hoje?', sender: 'inho', timestamp: new Date() }
    ]);
  };

  const handleQuickOption = (optionId) => {
    // Adiciona mensagem do usuário
    const userMessage = quickOptions.find(opt => opt.id === optionId)?.label;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user', timestamp: new Date() }]);

    // Responde baseado na opção
    switch(optionId) {
      case 'status':
        sendInhoMessage('Vou verificar o status do seu visto... Um momento!', 800);
        setTimeout(() => {
          sendInhoMessage(
            '✅ Encontrei seu processo!\n\n' +
            '📋 Protocolo: #2024-0158\n' +
            '👤 Cliente: João Silva\n' +
            '🌎 Visto: Estados Unidos - Turismo\n' +
            '📊 Status: Em análise consular\n' +
            '📅 Última atualização: 20/10/2025\n\n' +
            'Seu processo está na fase final! Previsão de conclusão em 5-7 dias úteis.',
            2000
          );
        }, 1500);
        break;

      case 'documentos':
        sendInhoMessage(
          '📄 Documentos necessários para visto de turismo (EUA):\n\n' +
          '✓ Passaporte válido (mín. 6 meses)\n' +
          '✓ Foto 5x5cm fundo branco\n' +
          '✓ Comprovante de renda\n' +
          '✓ Extrato bancário (3 meses)\n' +
          '✓ Carta do empregador\n' +
          '✓ Reserva de hotel\n' +
          '✓ Passagem aérea\n\n' +
          'Posso ajudar com mais alguma coisa?',
          1500
        );
        break;

      case 'pontos-turisticos':
        setWaitingForDestination(true);
        sendInhoMessage(
          '🗺️ Que legal! Vou te ajudar a conhecer os melhores pontos turísticos!\n\n' +
          'Para qual país/cidade você está indo? Alguns destinos disponíveis:\n\n' +
          '🇺🇸 Estados Unidos (Nova York, Miami, Orlando)\n' +
          '🇫🇷 França (Paris)\n' +
          '🇮🇹 Itália (Roma, Veneza)\n' +
          '🇪🇸 Espanha (Barcelona, Madrid)\n' +
          '🇵🇹 Portugal (Lisboa)\n\n' +
          'Digite o país ou cidade:',
          1000
        );
        break;

      case 'agendamento':
        sendInhoMessage(
          '📅 Horários disponíveis para atendimento:\n\n' +
          '🗓️ Quinta, 24/10 - 14:00\n' +
          '🗓️ Sexta, 25/10 - 10:00 ou 15:30\n' +
          '🗓️ Segunda, 28/10 - 09:00 ou 16:00\n\n' +
          'Digite o horário desejado ou ligue (11) 3456-7890',
          1200
        );
        break;
    }
  };

  // Gravação de voz com MediaRecorder + transcrição via Groq Whisper
  const iniciarGravacao = async () => {
    if (!backendOnline) {
      alert('Transcrição por voz requer o backend rodando.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (blob.size === 0) return;
        setIsTranscribing(true);
        const r = await transcreverAudio(blob, user?.id);
        setIsTranscribing(false);
        if (r.ok && r.texto) {
          setInputValue((prev) => (prev ? prev + ' ' + r.texto : r.texto));
        } else if (!r.ok) {
          alert('Falha ao transcrever áudio. Tente digitar.');
        }
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
    } catch (e) {
      alert('Não foi possível acessar o microfone. Verifique permissões do navegador.');
    }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const textoOriginal = inputValue;
    const userInput = inputValue.trim().toLowerCase();

    // Adiciona mensagem do usuário
    setMessages(prev => [...prev, { text: textoOriginal, sender: 'user', timestamp: new Date() }]);
    setInputValue('');

    // Se backend está online, delega ao agente Inho (Gemini + RAG + tools)
    if (backendOnline && !waitingForDestination && !selectedDestination) {
      setIsTyping(true);
      const historico = messages
        .filter((m) => m.sender === 'user' || m.sender === 'inho')
        .slice(-6)
        .map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

      const resp = await enviarMensagemAoAgente({
        mensagem: textoOriginal,
        historico,
        userId: user?.id,
        processosUsuario: processos,
      });

      if (resp.ok) {
        setMessages((prev) => [
          ...prev,
          { text: resp.resposta, sender: 'inho', timestamp: new Date() },
        ]);
        setIsTyping(false);
        return;
      }
      // Falhou — cai no fluxo legado abaixo
      setIsTyping(false);
    }

    // Se está esperando destino
    if (waitingForDestination) {
      setWaitingForDestination(false);

      // Procurar país/cidade
      let foundCountry = null;
      let foundCity = null;
      let attractions = [];

      // Buscar no banco de dados
      Object.keys(touristAttractions).forEach(countryKey => {
        if (userInput.includes(countryKey)) {
          foundCountry = touristAttractions[countryKey];

          // Se mencionou país, pegar primeira cidade
          if (!foundCity) {
            const firstCity = Object.keys(foundCountry.cities)[0];
            foundCity = firstCity;
            attractions = foundCountry.cities[firstCity];
          }
        }

        // Procurar cidade específica
        Object.keys(touristAttractions[countryKey].cities).forEach(cityKey => {
          if (userInput.includes(cityKey)) {
            foundCountry = touristAttractions[countryKey];
            foundCity = cityKey;
            attractions = foundCountry.cities[cityKey];
          }
        });
      });

      if (foundCountry && attractions.length > 0) {
        sendInhoMessage('Encontrei! Preparando suas recomendações... 🔍', 800);

        setTimeout(() => {
          let message = `🎯 Pontos turísticos imperdíveis em ${foundCity.charAt(0).toUpperCase() + foundCity.slice(1)}:\n\n`;

          attractions.forEach((attr, index) => {
            message += `${index + 1}. ${attr.name}\n`;
            message += `   ${attr.type} - ${attr.description}\n\n`;
          });

          message += '📥 Quer baixar esse guia em PDF? Digite "sim" para gerar o PDF!';

          setMessages(prev => [...prev, { text: message, sender: 'inho', timestamp: new Date() }]);
          setSelectedDestination({ country: foundCountry.country, city: foundCity, attractions });
          setIsTyping(false);
        }, 1500);
      } else {
        sendInhoMessage(
          'Desculpe, ainda não tenho informações sobre esse destino. 😔\n\n' +
          'Tente: Nova York, Paris, Roma, Barcelona, Lisboa, Miami, Orlando, Veneza ou Madrid.',
          1000
        );
      }
      return;
    }

    // Se tem destino selecionado e usuário quer PDF
    if (selectedDestination && (userInput.includes('sim') || userInput.includes('pdf') || userInput.includes('baixar'))) {
      sendInhoMessage('Gerando seu guia turístico em PDF... 📄✨', 500);

      setTimeout(() => {
        generateTouristPDF(
          selectedDestination.country,
          selectedDestination.city.charAt(0).toUpperCase() + selectedDestination.city.slice(1),
          selectedDestination.attractions
        );

        sendInhoMessage(
          '✅ PDF gerado com sucesso!\n\n' +
          'O arquivo foi baixado para sua pasta de Downloads.\n\n' +
          'Posso ajudar com mais alguma coisa? 😊',
          1000
        );

        setSelectedDestination(null);
      }, 1000);
      return;
    }

    // Resposta genérica do Inho
    sendInhoMessage(
      'Entendi sua pergunta! Nossa equipe especializada pode ajudar melhor. ' +
      'Gostaria de falar com um atendente? Ou posso mostrar as opções rápidas novamente?',
      1500
    );
  };

  if (!isVisible) return null;

  return (
    <div className="falcao-chatbot-container">
      {/* Chat expandido */}
      {isChatOpen && !isMinimized ? (
        <div className="chat-window">
          {/* Header do chat */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="inho-avatar">
                <img src="/falcao-youvisa.png" alt="Inho" />
              </div>
              <div>
                <h3>Inho</h3>
                <span className="online-status">● Online</span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button onClick={() => setIsChatOpen(false)} className="minimize-btn">−</button>
              <button onClick={() => setIsMinimized(true)} className="close-btn">×</button>
            </div>
          </div>

          {/* Área de mensagens */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === 'inho' && (
                  <div className="message-avatar">
                    <img src="/falcao-youvisa.png" alt="Inho" />
                  </div>
                )}
                <div className="message-content">
                  <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message inho">
                <div className="message-avatar">
                  <img src="/falcao-youvisa.png" alt="Inho" />
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Opções rápidas */}
          {messages.length === 1 && (
            <div className="quick-options">
              {quickOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleQuickOption(option.id)}
                  className="quick-option-btn"
                >
                  <span className="option-icon">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input de mensagem */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isTranscribing
                  ? 'Transcrevendo áudio...'
                  : isRecording
                  ? 'Gravando... clique no microfone para parar'
                  : 'Digite ou use o microfone...'
              }
              className="chat-input"
              disabled={isTranscribing || isRecording}
            />
            {backendOnline && (
              <button
                type="button"
                onClick={isRecording ? pararGravacao : iniciarGravacao}
                className="send-btn"
                style={{
                  background: isRecording ? '#dc2626' : undefined,
                  marginRight: 4,
                }}
                title={isRecording ? 'Parar gravação' : 'Falar (Groq Whisper)'}
                aria-label={isRecording ? 'Parar gravação' : 'Iniciar gravação de voz'}
              >
                {isRecording ? '⏹' : '🎤'}
              </button>
            )}
            <button type="submit" className="send-btn" disabled={isTranscribing || isRecording}>
              ➤
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Balão de fala inicial */}
          {!isMinimized && (
            <div className="chat-bubble">
              <button
                className="close-bubble"
                onClick={() => setIsMinimized(true)}
                aria-label="Minimizar"
              >
                ×
              </button>
              <p className="chat-message">
                Olá! 👋 Sou o <strong>Inho</strong>. Posso ajudar você com seu visto hoje?
              </p>
              <button className="chat-button" onClick={handleStartChat}>
                Iniciar Conversa
              </button>
            </div>
          )}
        </>
      )}

      {/* Mascote 3D */}
      <div
        className="mascot-container"
        onClick={() => {
          if (isMinimized) setIsMinimized(false);
          else if (isChatOpen) setIsChatOpen(true);
        }}
        role="button"
        tabIndex={0}
        aria-label="Abrir chat do Inho"
      >
        <div className="mascot-image">
          <img
            src="/falcao-youvisa.png"
            alt="Inho - Assistente Virtual YouVisa"
            className="mascot"
          />
          <div className="mascot-shadow"></div>
        </div>

        {/* Badge de notificação */}
        {isMinimized && (
          <div className="notification-badge">
            <span>💬</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FalcaoChatbot;
