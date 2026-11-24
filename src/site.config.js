/**
 * ==============================================================================
 * Fernandes Pedroso Advocacia — Configuração Centralizada do Site
 * ==============================================================================
 * Todos os dados cadastrais, horários, textos institucionais, mensagens do WhatsApp
 * e parâmetros de animação do escritório estão centralizados neste arquivo.
 *
 * NOTA DE COMPLIANCE OAB:
 * - Não exibir número de OAB em nenhum lugar do site.
 * - Conteúdo meramente informativo, sem promessa de resultados ou autopromoção mercantil.
 * - Itens marcados com TODO necessitam de confirmação ou preenchimento pelo cliente.
 */

export const siteConfig = {
  // Controle de intensidade das animações ambientes e microinterações:
  // "padrao"    -> Efeitos normais com spotlight de cursor no desktop
  // "sutil"     -> Efeitos amortecidos
  // "leve"      -> Modo automático de alto desempenho (vídeo trocado por poster, sem spotlight)
  // "desligado" -> Sem animações ambientes, sem spotlight, transições instantâneas
  motion: "padrao",

  // Dados Institucionais
  escritorio: {
    nome: "Fernandes Pedroso Advocacia",
    slogan: "Orientação jurídica clara, com atendimento próximo em Matão",
    subtitulo:
      "Orientação jurídica em Direito Previdenciário, Auxílio-acidente, Família e Sucessões, Civil e Consumidor, com escuta atenta e linguagem simples.",
    advogado: {
      nome: "Dr. Renan Fernandes Pedroso",
      titulo: "Advogado",
      // TODO: [PREENCHER] Inserir a formação acadêmica, especializações e pós-graduações oficiais do Dr. Renan
      formacao: "[PREENCHER: Formação acadêmica e especializações do Dr. Renan Fernandes Pedroso]",
      bioCurta:
        "Atendimento pautado pela escuta atenta, linguagem direta sem juridiquês e acompanhamento próximo em cada etapa do seu caso.",
      bioCompleta:
        "Acreditamos que o Direito deve ser compreensível e acessível. Nosso trabalho prioriza a transparência absoluta, explicando cada passo do processo em linguagem clara, analisando documentos com rigor técnico e oferecendo um porto seguro para você tomar as melhores decisões."
    },
    // Endereço físico e localização
    endereco: {
      logradouro: "Rua Otone Corrêa, 2287",
      bairro: "Jardim do Bosque",
      cidade: "Matão",
      estado: "SP",
      cep: "15997-126",
      textoFormatado: "Rua Otone Corrêa, 2287, Jardim do Bosque, Matão - SP, CEP 15997-126",
      // Link direto para abertura no Google Maps
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Otone+Corr%C3%AAa%2C+2287%2C+Jardim+do+Bosque%2C+Mat%C3%A3o+-+SP%2C+15997-126"
    },
    // Canais de contato
    contato: {
      // TODO: [CONFIRMAR] Confirmar se (16) 3394-1043 é o número oficial do WhatsApp comercial ou se há outro número direto.
      telefoneExibicao: "(16) 3394-1043",
      telefoneTel: "+551633941043",
      // Apenas dígitos para o link wa.me
      whatsappNumero: "551633941043",
      email: "[PREENCHER: E-mail oficial de contato do escritório se desejar exibir]" // TODO: [PREENCHER] Opcional
    },
    // Horário de funcionamento oficial para cálculo do status em tempo real
    // Fuso horário: America/Sao_Paulo
    horario: {
      diasSemana: "Segunda a sexta",
      horarioTexto: "Segunda a sexta, das 9h às 17h30",
      horaAbertura: 9, // 9h00
      minutoAbertura: 0,
      horaFechamento: 17, // 17h30
      minutoFechamento: 30,
      fuso: "America/Sao_Paulo",
      diasUteis: [1, 2, 3, 4, 5] // 1 = Segunda, 5 = Sexta
    }
  },

  // Mensagens pré-configuradas para o WhatsApp (codificadas em URL)
  whatsapp: {
    // Mensagem padrão para o Hero e botão flutuante
    mensagemPadrao: "Olá! Gostaria de agendar um atendimento com o Dr. Renan na Fernandes Pedroso Advocacia.",
    // Mensagem para a faixa de contato rápido
    mensagemContato: "Olá! Estive no site da Fernandes Pedroso Advocacia e gostaria de tirar uma dúvida sobre atendimento.",
    // Mensagem especial para auxílio-acidente
    mensagemAuxilioAcidente: "Olá! Gostaria de uma orientação inicial sobre Auxílio-Acidente e análise de sequela decorrente de acidente."
  },

  // 5 Áreas de Atuação com textos sóbrios e situações práticas
  areas: [
    {
      id: "previdenciario",
      numero: "01",
      nome: "Direito Previdenciário",
      resumo: "Aposentadorias, pensões e concessão ou restabelecimento de benefícios do INSS.",
      descricao:
        "Auxiliamos segurados a obterem benefícios previdenciários com base no histórico correto de contribuições, corrigindo indeferimentos indevidos e orientando o melhor momento para requerer o benefício.",
      situacoes: [
        "Aposentadoria por idade, tempo de contribuição ou especial",
        "Benefício por incapacidade temporária (auxílio-doença) negado pelo INSS",
        "Pensão por morte e amparo aos dependentes",
        "Revisão de aposentadorias e contagem de tempo de serviço"
      ],
      whatsappMensagem: "Olá! Gostaria de orientação jurídica sobre Direito Previdenciário e benefícios do INSS."
    },
    {
      id: "auxilio-acidente",
      numero: "02",
      nome: "Auxílio-acidente",
      destaque: true,
      resumo: "Benefício indenizatório mensal para quem sofreu qualquer tipo de acidente e ficou com sequelas permanentes.",
      descricao:
        "O auxílio-acidente é pago pelo INSS como indenização após a consolidação de lesões decorrentes de acidentes de qualquer natureza (trabalho, trânsito ou doméstico) que tenham reduzido a capacidade de trabalho habitual, sem impedir que o trabalhador continue trabalhando.",
      situacoes: [
        "Acidentes de trânsito, trabalho ou domésticos com redução de mobilidade",
        "Fraturas, cirurgias ou sequelas que dificultam a atividade do dia a dia",
        "Trabalhador que recebia auxílio-doença que teve alta mas não recuperou 100%",
        "Recebimento cumulativo do benefício com o salário mensal"
      ],
      whatsappMensagem: "Olá! Gostaria de conversar sobre Auxílio-Acidente e avaliar se a minha sequela dá direito ao benefício."
    },
    {
      id: "familia-sucessoes",
      numero: "03",
      nome: "Direito de Família e Sucessões",
      resumo: "Divórcio, guarda de filhos, pensão alimentícia, inventário e partilha de bens.",
      descricao:
        "Tratamos das relações familiares com a sensibilidade e a discrição que o momento exige, buscando sempre soluções equilibradas e seguras para a preservação dos laços e do patrimônio.",
      situacoes: [
        "Divórcio consensual em cartório ou litigioso",
        "Definição ou revisão de pensão alimentícia e regime de convivência de filhos",
        "Inventário judicial ou extrajudicial e partilha de herança",
        "Reconhecimento e dissolução de união estável"
      ],
      whatsappMensagem: "Olá! Preciso de orientação sobre questões de Direito de Família ou Sucessões (inventário/divórcio)."
    },
    {
      id: "civil",
      numero: "04",
      nome: "Direito Civil",
      resumo: "Contratos, responsabilidade civil, indenizações e cumprimento de obrigações.",
      descricao:
        "Orientação técnica para prevenir litígios contratuais, redigir acordos seguros e resguardar seus direitos em cobranças, disputas de posse e reparações civis.",
      situacoes: [
        "Elaboração e análise detalhada de contratos de compra, venda ou locação",
        "Cobrança de dívidas, títulos de crédito e obrigações não cumpridas",
        "Ações de indenização por danos materiais ou morais",
        "Regularização imobiliária básica e disputas possessórias"
      ],
      whatsappMensagem: "Olá! Gostaria de orientações sobre uma demanda na área de Direito Civil ou contratos."
    },
    {
      id: "consumidor",
      numero: "05",
      nome: "Direito do Consumidor",
      resumo: "Descontos indevidos em folha ou benefício, cobranças abusivas e vícios de produtos ou serviços.",
      descricao:
        "Defesa de pessoas físicas diante de abusos cometidos por instituições bancárias, concessionárias de serviços públicos, operadoras de telefonia e comércio eletrônico.",
      situacoes: [
        "Descontos indevidos de empréstimos não contratados em benefício do INSS",
        "Inscrição indevida nos cadastros de inadimplentes (SPC/Serasa)",
        "Cobranças abusivas de tarifas bancárias e juros não pactuados",
        "Falhas graves na entrega de produtos adquiridos ou prestação de serviços"
      ],
      whatsappMensagem: "Olá! Estou enfrentando um problema de Direito do Consumidor e preciso de análise jurídica."
    }
  ],

  // Seletor interativo "Descubra por onde começar"
  seletorInterativo: {
    titulo: "Descubra por onde começar",
    subtitulo: "Selecione o tema correspondente à sua necessidade para entender como podemos ajudar:",
    opcoes: [
      {
        areaId: "previdenciario",
        rotulo: "Aposentadoria / INSS",
        resposta:
          "Analisamos suas guias de recolhimento, tempo de contribuição ou motivos de negativa do INSS para encontrar o caminho legal adequado para seu benefício.",
        cta: "Conversar sobre INSS no WhatsApp"
      },
      {
        areaId: "auxilio-acidente",
        rotulo: "Acidente com sequela",
        resposta:
          "Avaliamos seus laudos médicos, prontuários e histórico do acidente para verificar se há direito à indenização mensal do auxílio-acidente paga pelo INSS.",
        cta: "Conversar sobre auxílio-acidente no WhatsApp"
      },
      {
        areaId: "familia-sucessoes",
        rotulo: "Divórcio / Herança",
        resposta:
          "Esclarecemos suas dúvidas sobre divisão de bens, regulamentação de guarda e condução de inventários com sigilo profissional e foco em soluções pacíficas.",
        cta: "Conversar sobre família no WhatsApp"
      },
      {
        areaId: "civil",
        rotulo: "Contratos / Obrigações",
        resposta:
          "Revisamos cláusulas contratuais, analisamos pendências financeiras e prestamos consultoria preventiva para resguardar sua segurança jurídica.",
        cta: "Conversar sobre contratos no WhatsApp"
      },
      {
        areaId: "consumidor",
        rotulo: "Cobrança ou desconto indevido",
        resposta:
          "Identificamos se houve prática abusiva por bancos, empresas de telecomunicações ou fornecedores e orientamos as providências cabíveis para reparação.",
        cta: "Conversar sobre consumidor no WhatsApp"
      }
    ]
  },

  // 3 Etapas transparentes do atendimento
  etapasAtendimento: [
    {
      numero: "01",
      titulo: "Contato inicial pelo WhatsApp",
      descricao: "Você envia uma mensagem de forma rápida e segura, relatando resumidamente o que aconteceu ou qual é a sua dúvida."
    },
    {
      numero: "02",
      titulo: "Entendimento e análise documental",
      descricao: "Conversamos para compreender o contexto com atenção aos detalhes e examinar os laudos, extratos ou contratos necessários."
    },
    {
      numero: "03",
      titulo: "Orientação clara e próximos passos",
      descricao: "Apresentamos com total transparência as opções jurídicas cabíveis, prazos estimados e como o escritório pode atuar no seu caso."
    }
  ],

  // 6 Perguntas e Respostas Neutras do FAQ
  faq: [
    {
      pergunta: "Como posso agendar um atendimento no escritório?",
      resposta:
        "O agendamento é feito de forma simples e direta pelo WhatsApp informado neste site. Basta enviar uma mensagem informando o assunto de seu interesse para alinharmos o melhor dia e horário."
    },
    {
      pergunta: "Quais documentos costumam ser necessários para a primeira conversa?",
      resposta:
        "Recomenda-se ter em mãos documento de identidade (RG ou CNH), comprovante de endereço e os documentos específicos da sua dúvida (por exemplo: extrato do CNIS ou carta de indeferimento do INSS para previdenciário; laudos e exames médicos para auxílio-acidente; contratos ou certidões para causas cíveis e de família)."
    },
    {
      pergunta: "O atendimento é presencial ou pode ser feito de forma online?",
      resposta:
        "Atendemos presencialmente em nosso escritório em Matão-SP para quem prefere uma reunião pessoal. No entanto, para sua comodidade, também realizamos atendimentos e trocas de documentos de forma 100% digital e segura."
    },
    {
      pergunta: "Como funciona o primeiro contato com o Dr. Renan?",
      resposta:
        "No primeiro contato, dedicamos tempo para ouvir a sua narrativa com calma, sem termos técnicos complicados. O objetivo é compreender exatamente a sua realidade fática antes de definir qualquer estratégia jurídica."
    },
    {
      pergunta: "O escritório atende apenas moradores de Matão-SP?",
      resposta:
        "O escritório está sediado em Matão-SP, onde recebemos clientes de toda a cidade e região (como Araraquara, Dobrada, Taquaritinga e demais municípios vizinhos), além de demandas eletrônicas em todo o estado de São Paulo."
    },
    {
      pergunta: "Posso enviar documentos pelo WhatsApp?",
      resposta:
        "Sim. Para uma análise preliminar do seu caso, você pode encaminhar fotos ou arquivos digitais dos seus documentos (como extratos do CNIS do INSS, laudos médicos ou certidões). Todas as informações e documentos enviados são resguardados sob rigoroso sigilo profissional da advocacia."
    }
  ],

  // Texto oficial obrigatório do Alerta contra Golpes
  alertaGolpes: {
    titulo: "Alerta contra golpes",
    texto:
      "O escritório Fernandes Pedroso Advocacia não solicita pagamentos para liberação de valores judiciais e não envia links para recebimento de indenizações ou benefícios. Em caso de dúvida, confirme o contato diretamente pelos canais oficiais informados neste site."
  },

  // Aviso legal institucional no rodapé
  avisoLegal: "Este site tem caráter exclusivamente informativo e não constitui promessa de resultado."
};

/**
 * Função utilitária para gerar links do WhatsApp a partir de um texto personalizado
 * @param {string} mensagemTexto
 * @returns {string} URL completa wa.me
 */
export function buildWhatsAppLink(mensagemTexto) {
  const numero = siteConfig.escritorio.contato.whatsappNumero;
  const textoCodificado = encodeURIComponent(mensagemTexto.trim());
  return `https://wa.me/${numero}?text=${textoCodificado}`;
}
