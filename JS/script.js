/**
 * ==========================================================================
 * LÓGICA DE INTERATIVIDADE - LANDING PAGE DR. FELIPPE CORRÊA
 * ==========================================================================
 * Este script controla as interações dinâmicas do site, incluindo:
 * 1. Mudança de estilo do cabeçalho ao rolar a página.
 * 2. Menu de navegação mobile responsivo.
 * 3. Sistema de acordeão interativo para as perguntas frequentes (FAQ).
 * 4. Controle de animação/exibição do balão de suporte no WhatsApp flutuante.
 * 5. Animação de revelação de elementos durante a rolagem (Scroll Reveal).
 */

document.addEventListener('DOMContentLoaded', () => {
    // Executa as funções quando o documento HTML terminar de carregar
    initHeaderScroll();
    initMobileMenu();
    initFaqAccordion();
    initWhatsappTooltip();
    initScrollReveal();
    initGtmTracking(); // Inicializa o monitoramento de cliques para o GTM
});

/**
 * Função para alterar a opacidade do cabeçalho de acordo com a rolagem
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    // Monitora a rolagem da janela
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            // Se rolar mais que 50 pixels, adiciona classe de fundo opaco e sombra
            header.classList.add('header-scrolled');
        } else {
            // Caso contrário, mantém o cabeçalho transparente original
            header.classList.remove('header-scrolled');
        }
    });
}

/**
 * Lógica do Menu Responsivo Mobile (Hambúrguer)
 */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        // Alterna a abertura e fechamento do menu ao clicar no botão
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Impede a rolagem do fundo quando o menu estiver aberto
            document.body.classList.toggle('no-scroll');
        });
        
        // Fecha o menu ao clicar em qualquer link de navegação (rolagem suave)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
}

/**
 * Lógica do Sistema de Acordeão do FAQ
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        
        if (questionButton) {
            questionButton.addEventListener('click', () => {
                // Verifica se o item clicado já está aberto usando a classe faq-open
                const isOpen = item.classList.contains('faq-open');
                
                // Fecha todos os outros itens abertos para manter o visual limpo
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('faq-open');
                    const answer = otherItem.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = null;
                    }
                });
                
                // Se o item clicado não estava aberto, adiciona a classe faq-open e expande
                if (!isOpen) {
                    item.classList.add('faq-open');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        // Define dinamicamente o max-height para animar a abertura via CSS transitions
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                }
            });
        }
    });
}

/**
 * Lógica para o Balão de WhatsApp Flutuante com exibição temporizada
 */
function initWhatsappTooltip() {
    const whatsappBadge = document.getElementById('whatsappBadge');
    const whatsappTooltip = document.getElementById('whatsappTooltip');
    
    if (whatsappBadge && whatsappTooltip) {
        // Exibe o balão de mensagem automaticamente após 4 segundos do carregamento
        setTimeout(() => {
            whatsappTooltip.classList.add('visible');
        }, 4000);
        
        // Fecha o balão após 12 segundos para não incomodar o usuário caso ele ignore
        setTimeout(() => {
            whatsappTooltip.classList.remove('visible');
        }, 16000);
        
        // Permite fechar o balão manualmente caso haja um botão de fechar dentro dele
        const closeTooltip = document.getElementById('closeTooltip');
        if (closeTooltip) {
            closeTooltip.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita disparar o clique do botão do WhatsApp principal
                whatsappTooltip.classList.remove('visible');
            });
        }
    }
}

/**
 * Lógica para Revelação de Elementos ao Rolar a Página (Scroll Reveal)
 */
function initScrollReveal() {
    // Seleciona todos os elementos que possuem as classes de animação de scroll
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    // Configura o observador de interseção
    const observerOptions = {
        root: null,          // Usa o viewport da tela do navegador
        rootMargin: '0px',   // Sem margens adicionais
        threshold: 0.15      // Ativa quando 15% do elemento estiver visível
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe 'active' para iniciar a transição de revelação no CSS
                entry.target.classList.add('active');
                // Para de observar o elemento já revelado para otimizar a performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Vincula cada elemento mapeado ao observador
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Lógica para rastreamento de eventos personalizados do GTM via dataLayer
 * Esta função captura cliques nos botões flutuantes do WhatsApp e os envia ao dataLayer do Google Tag Manager.
 */
function initGtmTracking() {
    // Obtém o botão flutuante principal do WhatsApp
    const floatBtn = document.getElementById('gtm-whatsapp-float');
    // Obtém o botão de ação dentro do balão (tooltip)
    const tooltipBtn = document.getElementById('gtm-whatsapp-tooltip');

    // Se o botão flutuante principal existir, adiciona o escutador de evento de clique
    if (floatBtn) {
        floatBtn.addEventListener('click', () => {
            // Garante que o dataLayer existe na janela e envia o evento de clique estruturado
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'whatsapp_click',
                'button_location': 'floating_button'
            });
        });
    }

    // Se o botão do balão existir, adiciona o escutador de evento de clique
    if (tooltipBtn) {
        tooltipBtn.addEventListener('click', () => {
            // Garante que o dataLayer existe na janela e envia o evento de clique estruturado
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'whatsapp_click',
                'button_location': 'floating_tooltip'
            });
        });
    }
}

