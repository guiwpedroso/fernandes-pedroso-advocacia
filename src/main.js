/**
 * ==============================================================================
 * Fernandes Pedroso Advocacia — Script Principal (src/main.js)
 * ==============================================================================
 * Vanilla JavaScript otimizado com Vite e ES Modules.
 * 
 * Desempenho e Boas Práticas:
 * - Zero Layout Thrashing: nenhuma leitura de layout (offsetTop, getBoundingClientRect) no loop de scroll.
 * - Barra de progresso de leitura via transform: scaleX() com requestAnimationFrame.
 * - Scrollspy e visibilidade controlados via IntersectionObserver nativo.
 * - Spotlight de cards estritamente isolado a dispositivos com hover via rAF.
 * - Gerenciador responsivo de vídeos (matchMedia <= 768px) com reprodução única e lazy/pause offscreen.
 * - Modo leve automático (hardware <= 4 núcleos/GB, Save-Data ou FPS < 45 nos primeiros 2s).
 * - Cálculo de horário de atendimento em tempo real no fuso America/Sao_Paulo.
 * - Acessibilidade completa: teclado, ARIA Live, foco e contraste.
 */

import { siteConfig, buildWhatsAppLink } from './site.config.js';

// Inicialização imediata ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  initMotionAndPerformance();
  initOperatingHoursStatus();
  initHeaderAndScrollProgress();
  initScrollspy();
  initVideoManager();
  initSpotlightEffect();
  initAreasAccordion();
  initInteractiveSelector();
  initFaqAccordion();
  initScrollReveals();
  initClipboardActions();
  initWhatsAppFeedback();
  initFloatingWhatsApp();
  initCopyrightYear();
});

/**
 * 1. Configuração de Movimento e Detecção Automática de Modo Leve
 * - Respeita prefers-reduced-motion: reduce -> data-motion="desligado"
 * - Detecta hardware modesto (cores <= 4, memória <= 4GB) ou Save-Data -> data-motion="leve"
 * - Mede FPS durante os primeiros 2 segundos: se < 45 fps -> ativa data-motion="leve"
 */
function initMotionAndPerformance() {
  const htmlEl = document.documentElement;
  const configuredMotion = siteConfig.motion || 'padrao';

  // 1. Respeita preferência do sistema operacional
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    htmlEl.setAttribute('data-motion', 'desligado');
    return;
  }

  // Se o usuário configurou expressamente "desligado" no config
  if (configuredMotion === 'desligado') {
    htmlEl.setAttribute('data-motion', 'desligado');
    return;
  }

  // 2. Heurística de economia de dados e hardware realmente limitado
  // Nota: iOS Safari limita hardwareConcurrency a 4 e muitos Android reportam deviceMemory = 4,
  // por isso só ativamos modo leve automático em Save-Data, rede 2G ou hardware <= 2 núcleos/2GB.
  const conn = navigator.connection;
  const isSaveData = Boolean(conn && conn.saveData);
  const isSlowNet = Boolean(conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g'));
  const isLowConcurrency = Boolean(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  const isLowMemory = Boolean(navigator.deviceMemory && navigator.deviceMemory <= 2);

  if (isSaveData || isSlowNet || isLowConcurrency || isLowMemory) {
    htmlEl.setAttribute('data-motion', 'leve');
    return;
  }

  // Aplica a configuração inicial padrão/sutil
  htmlEl.setAttribute('data-motion', configuredMotion);

  // 3. Medição real de FPS após o carregamento completo e somente com a aba visível
  function startFpsCheck() {
    if (document.hidden) return;
    let frameCount = 0;
    let startTime = performance.now();
    let aborted = false;

    const onVisibility = () => {
      if (document.hidden) aborted = true;
    };
    document.addEventListener('visibilitychange', onVisibility, { passive: true });

    function measureFps(now) {
      if (aborted || document.hidden) {
        document.removeEventListener('visibilitychange', onVisibility);
        return;
      }

      frameCount++;
      const elapsed = now - startTime;

      if (elapsed < 2000) {
        requestAnimationFrame(measureFps);
      } else {
        document.removeEventListener('visibilitychange', onVisibility);
        const calculatedFps = (frameCount * 1000) / elapsed;
        if (calculatedFps < 45) {
          const currentMotion = htmlEl.getAttribute('data-motion');
          if (currentMotion !== 'desligado') {
            htmlEl.setAttribute('data-motion', 'leve');
            window.dispatchEvent(new CustomEvent('fp:motion-downgraded'));
          }
        }
      }
    }

    requestAnimationFrame(measureFps);
  }

  if (document.readyState === 'complete') {
    setTimeout(startFpsCheck, 800);
  } else {
    window.addEventListener('load', () => setTimeout(startFpsCheck, 800), { once: true });
  }
}

/**
 * 2. Cálculo do Status de Atendimento em Tempo Real (America/Sao_Paulo)
 * Horário: Segunda a sexta, das 9h às 17h30
 */
function initOperatingHoursStatus() {
  const heroDot = document.getElementById('status-dot');
  const heroText = document.getElementById('status-text');
  const contactTagText = document.getElementById('contact-status-text');
  const contactTag = document.getElementById('contact-status-tag');

  function calculateStatus() {
    try {
      const now = new Date();
      const partsFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo',
        hour12: false,
        weekday: 'short', // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
        hour: 'numeric',
        minute: 'numeric'
      });

      const parts = partsFormatter.formatToParts(now);
      let weekdayShort = 'Mon';
      let currentHour = 9;
      let currentMinute = 0;

      for (const p of parts) {
        if (p.type === 'weekday') weekdayShort = p.value;
        if (p.type === 'hour') currentHour = parseInt(p.value, 10);
        if (p.type === 'minute') currentMinute = parseInt(p.value, 10);
      }

      const weekdayMap = {
        'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
      };
      const dayOfWeek = weekdayMap[weekdayShort] !== undefined ? weekdayMap[weekdayShort] : 1;
      const currentTotalMinutes = currentHour * 60 + currentMinute;

      const openingTotalMinutes = 9 * 60; // 09:00 -> 540 min
      const closingTotalMinutes = 17 * 60 + 30; // 17:30 -> 1050 min

      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isOpenNow = isWeekday && (currentTotalMinutes >= openingTotalMinutes && currentTotalMinutes < closingTotalMinutes);

      let statusTextMsg = '';

      if (isOpenNow) {
        statusTextMsg = 'Atendendo agora';
        if (heroDot) heroDot.className = 'status-dot online';
        if (contactTag) contactTag.querySelector('.status-dot')?.classList.add('online');
      } else {
        if (heroDot) heroDot.className = 'status-dot offline';
        if (contactTag) contactTag.querySelector('.status-dot')?.classList.remove('online');

        if (isWeekday && currentTotalMinutes < openingTotalMinutes) {
          statusTextMsg = 'Fora do horário · voltamos hoje, 9h';
        } else if (dayOfWeek >= 1 && dayOfWeek <= 4 && currentTotalMinutes >= closingTotalMinutes) {
          statusTextMsg = 'Fora do horário · voltamos amanhã, 9h';
        } else {
          statusTextMsg = 'Fora do horário · voltamos segunda, 9h';
        }
      }

      if (heroText) heroText.textContent = statusTextMsg;
      if (contactTagText) contactTagText.textContent = statusTextMsg;
    } catch (err) {
      console.warn('Aviso: cálculo de horário utilizando fallback padrão', err);
    }
  }

  calculateStatus();
  setInterval(calculateStatus, 60000);
}

/**
 * 3. Cabeçalho Fixo e Barra de Progresso de Leitura
 * - Barra de progresso usa transform: scaleX() (zero reflows)
 * - Cache de altura do documento atualizado apenas no evento resize
 * - Scroll handler passive com throttle via requestAnimationFrame
 */
function initHeaderAndScrollProgress() {
  const header = document.getElementById('cabecalho');
  const progressBar = document.getElementById('reading-progress-bar');
  const menuToggle = document.getElementById('btn-menu-mobile');
  const mainNav = document.getElementById('navegacao-principal');

  // Cache das medidas de layout da página (atualizadas apenas em resize)
  let maxScrollableHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

  window.addEventListener('resize', () => {
    maxScrollableHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }, { passive: true });

  let isTicking = false;

  function updateScrollVisuals() {
    const scrollY = window.scrollY || window.pageYOffset || 0;

    // 1. Alterna classe do cabeçalho
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // 2. Atualiza a barra de progresso via transform scaleX (0 a 1)
    if (progressBar && maxScrollableHeight > 0) {
      const progress = Math.min(1, Math.max(0, scrollY / maxScrollableHeight));
      progressBar.style.transform = `scaleX(${progress})`;
    }

    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      requestAnimationFrame(updateScrollVisuals);
      isTicking = true;
    }
  }, { passive: true });

  updateScrollVisuals();

  // Menu Mobile Toggle acessível
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mainNav.classList.toggle('mobile-active');
      menuToggle.setAttribute('aria-label', !isExpanded ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });

    mainNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
        mainNav.classList.remove('mobile-active');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('mobile-active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
        mainNav.classList.remove('mobile-active');
        menuToggle.focus();
      }
    });
  }
}

/**
 * 4. Scrollspy 100% Livre de Layout Thrashing com IntersectionObserver
 * - Observa cada seção com rootMargin compensando o cabeçalho fixo
 * - Zero leituras de getBoundingClientRect ou offsetTop no scroll
 */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-spy]');
  if (!sections.length || !navLinks.length) return;

  const sectionVisibility = new Map();

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id');
      sectionVisibility.set(id, entry.isIntersecting);
    });

    // Encontra a primeira seção atualmente visível na ordem do DOM
    let activeId = '';
    for (const section of sections) {
      const id = section.getAttribute('id');
      if (sectionVisibility.get(id)) {
        activeId = id;
        break;
      }
    }

    if (activeId) {
      navLinks.forEach((link) => {
        if (link.getAttribute('data-spy') === activeId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, {
    rootMargin: '-20% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach((sec) => spyObserver.observe(sec));
}

/**
 * 5. Gerenciador Responsivo de Vídeos e Reprodução Única
 * - Seleciona hero-fundo.mp4 vs hero-fundo-mobile.mp4 via matchMedia ('(max-width: 768px)')
 * - Seleciona recepcao.mp4 vs recepcao-mobile.mp4 via matchMedia ('(max-width: 768px)')
 * - Pausa quando fora da tela (IntersectionObserver)
 * - Em modo leve ou desligado, exibe apenas o poster estático
 * - Apenas um vídeo toca por vez
 */
function initVideoManager() {
  const heroVideo = document.getElementById('hero-video');
  const officeVideo = document.getElementById('office-recepcao-video');
  const contactVideo = document.getElementById('contact-fachada-video');
  const mqlMobile = window.matchMedia('(max-width: 768px)');

  const videoConfig = {
    hero: {
      desktopSrc: '/assets/video/hero-escritorio-novo.mp4',
      desktopPoster: '/assets/video/hero-escritorio-novo-poster.webp',
      mobileSrc: '/assets/video/hero-escritorio-mobile-novo.mp4',
      mobilePoster: '/assets/video/hero-escritorio-novo-poster-mobile.webp'
    },
    office: {
      desktopSrc: '/assets/video/escritorio-recepcao.mp4',
      desktopPoster: '/assets/video/escritorio-recepcao-poster.webp',
      mobileSrc: '/assets/video/escritorio-recepcao-mobile.mp4',
      mobilePoster: '/assets/video/escritorio-recepcao-poster.webp'
    },
    contact: {
      desktopSrc: '/assets/video/fachada.mp4',
      desktopPoster: '/assets/video/fachada-poster.webp',
      mobileSrc: '/assets/video/fachada-mobile.mp4',
      mobilePoster: '/assets/video/fachada-poster.webp'
    }
  };

  const lazyState = { office: false, contact: false };
  const visibleVideos = new Set();

  function isMotionActive() {
    const motion = document.documentElement.getAttribute('data-motion');
    return motion !== 'desligado' && motion !== 'leve';
  }

  function safePlay(videoEl) {
    if (!videoEl || !isMotionActive() || document.hidden) return;
    videoEl.defaultMuted = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
    const playAttempt = videoEl.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(() => {
        // Caso o vídeo ainda esteja carregando, tenta novamente no canplay
        if (videoEl.readyState < 2) {
          videoEl.addEventListener('canplay', () => {
            if (visibleVideos.has(videoEl) && isMotionActive() && !document.hidden) {
              videoEl.play().catch(() => {});
            }
          }, { once: true });
        }
      });
    }
  }

  function applySources(videoEl, configKey, loadNow = true) {
    if (!videoEl) return;
    const cfg = videoConfig[configKey];
    const isMobile = mqlMobile.matches;
    const targetPoster = isMobile ? cfg.mobilePoster : cfg.desktopPoster;
    const targetSrc = isMobile ? cfg.mobileSrc : cfg.desktopSrc;

    videoEl.poster = targetPoster;

    if (!isMotionActive()) {
      videoEl.removeAttribute('src');
      videoEl.load();
      return;
    }

    if (!loadNow) {
      videoEl.setAttribute('data-pending-src', targetSrc);
      return;
    }

    if (videoEl.getAttribute('data-current-src') !== targetSrc) {
      videoEl.setAttribute('data-current-src', targetSrc);
      videoEl.preload = 'auto';
      videoEl.src = targetSrc;
      videoEl.load();
      videoEl.addEventListener('canplay', () => {
        if (visibleVideos.has(videoEl)) safePlay(videoEl);
      }, { once: true });
    }
  }

  // Hero carrega imediatamente; vídeos abaixo da dobra aguardam proximidade (preload="none")
  applySources(heroVideo, 'hero', true);
  applySources(officeVideo, 'office', false);
  applySources(contactVideo, 'contact', false);

  mqlMobile.addEventListener('change', () => {
    applySources(heroVideo, 'hero', true);
    applySources(officeVideo, 'office', lazyState.office);
    applySources(contactVideo, 'contact', lazyState.contact);
    visibleVideos.forEach((vid) => safePlay(vid));
  });

  window.addEventListener('fp:motion-downgraded', () => {
    [heroVideo, officeVideo, contactVideo].forEach((vid) => {
      if (vid) {
        vid.pause();
        vid.removeAttribute('src');
      }
    });
  });

  // Pausa ao sair da aba e retoma automaticamente os vídeos visíveis ao voltar
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      [heroVideo, officeVideo, contactVideo].forEach((vid) => vid?.pause());
    } else {
      visibleVideos.forEach((vid) => safePlay(vid));
    }
  });

  // Fallback mobile: se o navegador bloqueou autoplay inicial, desbloqueia no primeiro toque
  const unlockPlayback = () => {
    visibleVideos.forEach((vid) => {
      if (vid.paused) safePlay(vid);
    });
  };
  window.addEventListener('touchstart', unlockPlayback, { once: true, passive: true });
  window.addEventListener('click', unlockPlayback, { once: true, passive: true });

  // Hero: toca visível e pausa fora da tela
  if (heroVideo) {
    visibleVideos.add(heroVideo);
    safePlay(heroVideo);

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleVideos.add(heroVideo);
          safePlay(heroVideo);
        } else {
          visibleVideos.delete(heroVideo);
          heroVideo.pause();
        }
      });
    }, { threshold: 0.2 });

    heroObserver.observe(heroVideo);
  }

  // Helper para vídeos lazy (carrega a 1 tela de distância, toca visível e pausa fora da tela)
  function setupLazyVideo(videoEl, key) {
    if (!videoEl) return;

    const preloadObserver = new IntersectionObserver((entries, obs) => {
      if (!isMotionActive()) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting && !lazyState[key]) {
          lazyState[key] = true;
          applySources(videoEl, key, true);
          obs.unobserve(videoEl);
        }
      });
    }, { rootMargin: '100% 0px 100% 0px', threshold: 0 });

    preloadObserver.observe(videoEl);

    const playObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleVideos.add(videoEl);
          if (!lazyState[key] && isMotionActive()) {
            lazyState[key] = true;
            applySources(videoEl, key, true);
          }
          safePlay(videoEl);
        } else {
          visibleVideos.delete(videoEl);
          videoEl.pause();
        }
      });
    }, { threshold: 0.1 });

    playObserver.observe(videoEl);
  }

  setupLazyVideo(officeVideo, 'office');
  setupLazyVideo(contactVideo, 'contact');
}

/**
 * 6. Efeito Spotlight nos Cards (Otimizado)
 * - Restrito a desktops com hover (@media (hover: hover) and (pointer: fine))
 * - Throttled estritamente via requestAnimationFrame
 * - Executa apenas no card que está sob o ponteiro
 * - Desativado em data-motion="leve" ou "desligado"
 */
function initSpotlightEffect() {
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsHover) return;

  const spotlightCards = document.querySelectorAll('.spotlight-target');
  if (!spotlightCards.length) return;

  function canRunSpotlight() {
    const motion = document.documentElement.getAttribute('data-motion');
    return motion !== 'desligado' && motion !== 'leve';
  }

  spotlightCards.forEach((card) => {
    let rafId = null;

    card.addEventListener('mouseenter', () => {
      if (!canRunSpotlight()) return;
      card.classList.add('is-hovered');
    });

    card.addEventListener('mousemove', (e) => {
      if (!canRunSpotlight()) return;
      if (rafId) return; // Não enfileira eventos adicionais

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        rafId = null;
      });
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-hovered');
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  });
}

/**
 * 7. Acordeão Editorial das Áreas de Atuação
 */
function initAreasAccordion() {
  const areaItems = document.querySelectorAll('.area-editorial-item');

  areaItems.forEach((item) => {
    const trigger = item.querySelector('.area-item-header');
    const body = item.querySelector('.area-item-body');

    if (!trigger || !body) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Fecha os demais itens para manter a sobriedade editorial
      areaItems.forEach((otherItem) => {
        if (otherItem !== item) {
          const otherTrigger = otherItem.querySelector('.area-item-header');
          const otherBody = otherItem.querySelector('.area-item-body');
          if (otherTrigger && otherBody) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherBody.hidden = true;
            otherItem.classList.remove('is-open');
          }
        }
      });

      // Alterna o item atual
      trigger.setAttribute('aria-expanded', String(!isExpanded));
      body.hidden = isExpanded;
      item.classList.toggle('is-open', !isExpanded);
    });
  });
}

/**
 * 8. Seletor Interativo: "Descubra por onde começar"
 */
function initInteractiveSelector() {
  const chips = document.querySelectorAll('.chip-btn');
  const panel = document.getElementById('panel-situacao');
  const panelTitle = document.getElementById('feedback-panel-title');
  const panelText = document.getElementById('feedback-panel-text');
  const panelCta = document.getElementById('feedback-panel-cta');
  const panelCtaText = document.getElementById('feedback-panel-cta-text');

  if (!chips.length || !panel || !panelTitle || !panelText || !panelCta) return;

  const configMap = {};
  siteConfig.seletorInterativo.opcoes.forEach((opcao) => {
    configMap[opcao.areaId] = opcao;
  });

  const areaMap = {};
  siteConfig.areas.forEach((area) => {
    areaMap[area.id] = area;
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const topicId = chip.getAttribute('data-topic');
      const selectorData = configMap[topicId];
      const areaData = areaMap[topicId];

      if (!selectorData || !areaData) return;

      chips.forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');

      // Transição sutil de opacidade
      panel.style.opacity = '0.4';

      setTimeout(() => {
        panelTitle.textContent = areaData.nome;
        panelText.textContent = selectorData.resposta;
        if (panelCtaText) panelCtaText.textContent = selectorData.cta;

        panelCta.setAttribute('href', buildWhatsAppLink(areaData.whatsappMensagem));
        panel.style.opacity = '1';
      }, 140);
    });
  });
}

/**
 * 9. Acordeão Acessível de Perguntas Frequentes (FAQ)
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-answer-panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherPanel = otherItem.querySelector('.faq-answer-panel');
          if (otherTrigger && otherPanel) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherPanel.hidden = true;
            otherItem.classList.remove('is-open');
          }
        }
      });

      trigger.setAttribute('aria-expanded', String(!isExpanded));
      panel.hidden = isExpanded;
      item.classList.toggle('is-open', !isExpanded);
    });
  });
}

/**
 * 10. Sistema de Revelação ao Rolar com IntersectionObserver
 */
function initScrollReveals() {
  const isReduced = document.documentElement.getAttribute('data-motion') === 'desligado';
  const revealElements = document.querySelectorAll('.reveal-item');
  const stepsContainer = document.querySelector('.steps-container');

  if (isReduced) {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
    stepsContainer?.classList.add('is-revealed');
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach((el) => observer.observe(el));

  if (stepsContainer) {
    const stepsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stepsContainer.classList.add('is-revealed');
          obs.unobserve(stepsContainer);
        }
      });
    }, { threshold: 0.2 });

    stepsObserver.observe(stepsContainer);
  }
}

/**
 * 11. Botão Flutuante de WhatsApp (Controlado por IntersectionObserver sem polling de scroll)
 * - Surge após o Hero sair de vista
 * - Oculta-se ao entrar na seção Contato
 * - Executa exatamente uma animação de atenção ao surgir
 */
function initFloatingWhatsApp() {
  const floatingContainer = document.querySelector('.floating-whatsapp-container');
  const heroSection = document.getElementById('hero');
  const contactSection = document.getElementById('contato');

  if (!floatingContainer || !heroSection) return;

  let isHeroVisible = true;
  let isContactVisible = false;
  let hasAnimatedAttention = false;

  function updateFloatingVisibility() {
    const shouldBeVisible = !isHeroVisible && !isContactVisible;

    if (shouldBeVisible) {
      floatingContainer.classList.add('is-visible');

      if (!hasAnimatedAttention) {
        floatingContainer.classList.add('attention-once');
        hasAnimatedAttention = true;
        setTimeout(() => {
          floatingContainer.classList.remove('attention-once');
        }, 1400);
      }
    } else {
      floatingContainer.classList.remove('is-visible');
    }
  }

  // Observador do Hero
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isHeroVisible = entry.isIntersecting;
      updateFloatingVisibility();
    });
  }, { threshold: 0.05 });

  heroObserver.observe(heroSection);

  // Observador do Contato
  if (contactSection) {
    const contactObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isContactVisible = entry.isIntersecting;
        updateFloatingVisibility();
      });
    }, { threshold: 0.1 });

    contactObserver.observe(contactSection);
  }
}

/**
 * 12. Utilidades de Cópia (Telefone e Endereço) com ARIA Live e Toast
 */
function initClipboardActions() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  const liveRegion = document.getElementById('aria-live-feedback');
  const toast = document.getElementById('copy-toast');
  const toastMsg = document.getElementById('copy-toast-message');

  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    if (liveRegion) liveRegion.textContent = message;

    toast.classList.add('is-active');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-active');
      if (liveRegion) liveRegion.textContent = '';
    }, 2400);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy-value') || '';
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const isPhone = textToCopy.includes('3394') || textToCopy.startsWith('(');
        showToast(isPhone ? 'Telefone copiado para a área de transferência' : 'Endereço copiado para a área de transferência');
      } catch (err) {
        fallbackCopyText(textToCopy);
        showToast('Texto copiado para a área de transferência');
      }
    });
  });

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      // Ignora erro de fallback
    }
    document.body.removeChild(textArea);
  }
}

/**
 * 13. Feedback Imediato nos Botões de WhatsApp
 */
function initWhatsAppFeedback() {
  const waButtons = document.querySelectorAll('.btn-whatsapp-action');

  waButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.add('btn-loading');
      const spanText = btn.querySelector('span');
      if (spanText) {
        const prevText = spanText.textContent;
        spanText.textContent = 'Abrindo WhatsApp...';
        setTimeout(() => {
          spanText.textContent = prevText;
          btn.classList.remove('btn-loading');
        }, 1200);
      } else {
        setTimeout(() => {
          btn.classList.remove('btn-loading');
        }, 1200);
      }
    });
  });
}

/**
 * 14. Ano Automático no Rodapé
 */
function initCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}
