// --- LÓGICA DE ANIMAÇÃO DO FUNDO ---
const canvas = document.getElementById('matrix-background');
const ctx = canvas.getContext('2d');
let animationFrameId;

// NOVAS VARIÁVEIS PARA CONTROLE DE VELOCIDADE
let fpsInterval = 1000 / 0.1; //
let then = Date.now();
let startTime = then;

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const snippets = ['() => {}', 'items.map(i => i)', 'flex items-center', 'gh pr create', 'git checkout -b dev', 'useState()', 'useEffect()', 'w-full', 'p-4', 'const data = await fetch()', 'Promise.all()', 'class="bg-cyan-500"', 'grid-cols-3', 'yarn dev'];
const fontSize = 14;
const columns = Math.floor(window.innerWidth / (fontSize * 1.5));
const drops = Array(columns).fill(1);

function drawMatrix() {
    // Fundo semi-transparente para criar o efeito de "rastro" com a nova cor
    ctx.fillStyle = 'rgba(203, 221, 236, 0.1)'; // Cor de fundo com opacidade
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cor do texto da animação
    ctx.fillStyle = 'rgba(8, 145, 178, 0.3)'; // ciano com opacidade
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = snippets[Math.floor(Math.random() * snippets.length)];
        ctx.fillText(text, i * fontSize * 1.5, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

function animate() {
    drawMatrix();
    animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
    setupCanvas();
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animate();
}

// --- LÓGICA DE RENDERIZAÇÃO E ROTEAMENTO ---
let pageData = null; // Armazenará os dados do JSON

// Elementos do DOM
const langPtBtn = document.getElementById('lang-pt');
const langEnBtn = document.getElementById('lang-en');
const pages = document.querySelectorAll('.page-content');
const navLinks = document.querySelectorAll('.nav-link');

// Carrega os dados do arquivo JSON
async function fetchContentData() {
    try {
        const response = await fetch('./dataCore/content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        pageData = await response.json();
    } catch (error) {
        console.error("Could not fetch content data:", error);
        document.querySelector('main').innerHTML = '<p class="text-red-500 text-center">Failed to load page content. Please try again later.</p>';
    }
}

function renderContent(lang) {
    if (!pageData) return;
    const content = pageData[lang];

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (content[key]) {
            el.style.opacity = 0;
            setTimeout(() => {
                // --- LÓGICA CORRETA PARA LIDAR COM STRINGS E ARRAYS ---
                const value = content[key];
                // Verifica se o valor é um array. Se for, junta os elementos. Senão, usa como está.
                const text = Array.isArray(value) ? value.join('') : value.toString();
                // A lógica para substituir o '\n' por '<br>' continua a mesma.
                el.innerHTML = text.replace(/\n/g, '<br>');
                // --- FIM DA LÓGICA ---
                
                el.style.opacity = 1;
            }, 150);
        }
    });
    // ********* BLOG *********
    const blogContainer = document.getElementById('blog-container');
    if(blogContainer) {
        // A lógica para renderizar o blog também precisa ser ajustada para a descrição em array
        blogContainer.innerHTML = content.blogPosts.map(p => {
                // 1. Inicia a variável que vai guardar o HTML do título
    let titleHtml = '';

    // 2. Verifica se o título é um array (nossa nova estrutura)
    if (Array.isArray(p.title)) {
        // 3. Se for um array, percorre cada "pedaço"
        titleHtml = p.title.map(part => {
            if (part.type === 'link') {
                // Se o pedaço for um link, cria uma tag <a>
                return `<a href="${part.url}" target="_blank" rel="noopener noreferrer" class="text-cyan-600 hover:underline">${part.value}</a>`;
            }
            // Senão, apenas retorna o texto
            return part.value;
        }).join(''); // Junta todos os pedaços de HTML
    } else {
        // 4. Se não for um array, funciona como antes (para posts antigos)
        titleHtml = p.title;
    }
    // LÓGICA NOVA PARA A DESCRIÇÃO (substitui a linha antiga)
    let descriptionHtml = '';
    if (Array.isArray(p.description) && typeof p.description[0] === 'object') {
        descriptionHtml = p.description.map(part => {
    if (part.type === 'link') {
        return `<a href="${part.url}" target="_blank" rel="noopener noreferrer" class="text-cyan-600 hover:underline font-semibold">${part.value}</a>`;
    }
    
    // --- INÍCIO DA CORREÇÃO ---
    // Se o valor do texto for um array, junte seus pedaços.
    if (Array.isArray(part.value)) {
        return part.value.join('');
    }
            return part.value;
        }).join('');
    } else {
        descriptionHtml = Array.isArray(p.description) ? p.description.join('') : p.description;
    }
            return `<div class="bg-white/90 p-4 rounded-lg border border-slate-200
             hover:border-cyan-400 hover:shadow-md transition-all duration-300"><h3 class="font-bold text-lg 
             text-slate-800">${titleHtml}</h3><p class="text-sm text-slate-500 mt-1 mb-3">${descriptionHtml.replace(/\n/g, '<br>')}</p><a href="${p.link}"
             target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-700 font-semibold">${content.readArticleLink} 
             <i data-lucide="arrow-up-right" class="w-4 h-4 ml-1"></i></a></div>`;
        }).join('');
    }

       // ********* CONTENT *********
    const contentContainer = document.getElementById('content-container');
    if(contentContainer) {
        // A lógica para renderizar o blog também precisa ser ajustada para a descrição em array
        contentContainer.innerHTML = content.contentPosts.map(p => {
                // 1. Inicia a variável que vai guardar o HTML do título
    let titleHtml = '';

    // 2. Verifica se o título é um array (nossa nova estrutura)
    if (Array.isArray(p.title)) {
        // 3. Se for um array, percorre cada "pedaço"
        titleHtml = p.title.map(part => {
            if (part.type === 'link') {
                // Se o pedaço for um link, cria uma tag <a>
                return `<a href="${part.url}" target="_blank" rel="noopener noreferrer" class="text-cyan-600 hover:underline">${part.value}</a>`;
            }
            // Senão, apenas retorna o texto
            return part.value;
        }).join(''); // Junta todos os pedaços de HTML
    } else {
        // 4. Se não for um array, funciona como antes (para posts antigos)
        titleHtml = p.title;
    }
    // LÓGICA NOVA PARA A DESCRIÇÃO (substitui a linha antiga)
    let descriptionHtml = '';
    if (Array.isArray(p.description) && typeof p.description[0] === 'object') {
        descriptionHtml = p.description.map(part => {
    if (part.type === 'link') {
        return `<a href="${part.url}" target="_blank" rel="noopener noreferrer" class="text-cyan-600 hover:underline font-semibold">${part.value}</a>`;
    }
    
    // Se o valor do texto for um array, junte seus pedaços.
    if (Array.isArray(part.value)) {
        return part.value.join('');
    }
            return part.value;
        }).join('');
    } else {
        descriptionHtml = Array.isArray(p.description) ? p.description.join('') : p.description;
    }
            return `<div class="bg-white/90 p-4 rounded-lg border border-slate-200
             hover:border-cyan-400 hover:shadow-md transition-all duration-300"><h3 class="font-bold text-lg 
             text-slate-800">${titleHtml}</h3><p class="text-sm text-slate-500 mt-1 mb-3">${descriptionHtml.replace(/\n/g, '<br>')}</p><a href="${p.link}"
             target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-700 font-semibold">${content.contentLink} 
             <i data-lucide="arrow-up-right" class="w-4 h-4 ml-1"></i></a></div>`;
        }).join('');
    }

       // ********* DOCUMENTATION *********
    const docContainer = document.getElementById('doc-container');
    if(docContainer) {
        // A lógica para renderizar o blog também precisa ser ajustada para a descrição em array
        docContainer.innerHTML = content.docPosts.map(p => {
                // 1. Inicia a variável que vai guardar o HTML do título
    let titleHtml = '';

    // 2. Verifica se o título é um array (nossa nova estrutura)
    if (Array.isArray(p.title)) {
        // 3. Se for um array, percorre cada "pedaço"
        titleHtml = p.title.map(part => {
            if (part.type === 'link') {
                // Se o pedaço for um link, cria uma tag <a>
                return `<a href="${part.url}" target="_blank" rel="noopener noreferrer" class="text-cyan-600 hover:underline">${part.value}</a>`;
            }
            // Senão, apenas retorna o texto
            return part.value;
        }).join(''); // Junta todos os pedaços de HTML
    } else {
        // 4. Se não for um array, funciona como antes (para posts antigos)
        titleHtml = p.title;
    }
    // LÓGICA NOVA PARA A DESCRIÇÃO (substitui a linha antiga)
    let descriptionHtml = '';
    if (Array.isArray(p.description) && typeof p.description[0] === 'object') {
        descriptionHtml = p.description.map(part => {
    if (part.type === 'link') {
        return `<a href="${part.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-cyan-600 hover:underline font-semibold">${part.value} <i data-lucide="arrow-up-right" class="w-4 h-4 ml-1"></i></a>`;
    }
    
    // Se o valor do texto for um array, junte seus pedaços.
    if (Array.isArray(part.value)) {
        return part.value.join('');
    }
            return part.value;
        }).join('');
    } else {
        descriptionHtml = Array.isArray(p.description) ? p.description.join('') : p.description;
    }
            return `<div class="bg-white/90 p-4 rounded-lg border border-slate-200
             hover:border-cyan-400 hover:shadow-md transition-all duration-300"><h3 class="font-bold text-lg 
             text-slate-800">${titleHtml}</h3><p class="text-sm text-slate-500 mt-1 mb-3">${descriptionHtml.replace(/\n/g, '<br>')}</p><a href="${p.link}"
             target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-700 font-semibold">${content.docLink} 
             <i data-lucide="arrow-up-right" class="w-4 h-4 ml-1"></i></a></div>`;
        }).join('');
    }



    // ********* SKILLS *********
        const skillsContainer = document.getElementById('skills-container');
    if(skillsContainer) {
        skillsContainer.innerHTML = content.skills.map(skill => `<span class="bg-cyan-100/60 text-cyan-800 text-sm font-medium px-3 py-1 
            rounded-full">${skill}</span>`).join('');
    }

    // ********* UPDATES TICKER *********

const tickerContent = document.getElementById('ticker-content');
if (tickerContent) {
    // ======== CONFIGURAÇÕES DO TICKER (EDITÁVEL) ========
    // 1. Velocidade da animação em pixels por segundo.
    const PIXELS_PER_SECOND = 90; 
    // 2. Tempo desejado (em segundos) para a primeira atualização aparecer na tela.
    const INITIAL_APPEARANCE_TIME_SECONDS = 11; 
    // ======================================================

    // Popula o conteúdo do ticker
    const blogItems = content.blogPosts.map(p => ({ ...p, origin: content.navBlog }));
    const contentItems = content.contentPosts.map(p => ({ ...p, origin: content.navContent }));
    const docItems = content.docPosts.map(p => ({ ...p, origin: content.navDoc }));
    const allPosts = [...blogItems, ...contentItems, ...docItems];
    const tickerTitles = allPosts.map(post => {
        const titleText = post.title.map(part => part.value).join('');
        return `[${post.origin}] ${titleText}`;
    });
    tickerContent.innerHTML = tickerTitles.join(' &nbsp; • &nbsp; ');

    // Lógica da Animação Dinâmica
    // Usamos requestAnimationFrame para garantir que o DOM foi atualizado antes de medirmos a largura
    requestAnimationFrame(() => {
        const textWidth = tickerContent.offsetWidth;
        const screenWidth = window.innerWidth;
        
        // Distância total que o texto percorre na animação (da borda direita até sumir na esquerda)
        const totalDistance = screenWidth + textWidth;
        
        // Duração total da animação para manter a velocidade constante
        const totalDuration = totalDistance / PIXELS_PER_SECOND;

        // Calcula o tempo que o texto leva para cruzar a tela até aparecer
        const actualTimeToAppear = screenWidth / PIXELS_PER_SECOND;

        // Calcula o "salto no tempo" (delay negativo) para ajustar o início
        // Se o tempo real for 4s e você quer 1.5s, o salto será de 2.5s
        const negativeDelay = actualTimeToAppear - INITIAL_APPEARANCE_TIME_SECONDS;
        
        // Aplica os estilos da animação via JS
        tickerContent.style.animationName = 'scroll-ticker';
        tickerContent.style.animationTimingFunction = 'linear';
        tickerContent.style.animationIterationCount = 'infinite';
        tickerContent.style.animationDuration = `${totalDuration.toFixed(2)}s`;
        // Aplica o delay negativo para a mágica acontecer!
        tickerContent.style.animationDelay = `-${negativeDelay.toFixed(2)}s`;
    });

    // Lógica para o título da seção (opcional, mas mantém a consistência)
    const updatesTitleEl = document.querySelector('#ticker-section [data-key="updatesTitle"]');
    if (updatesTitleEl && content.updatesTitle) {
        updatesTitleEl.textContent = content.updatesTitle;
    }
}

    
    // ********* PROJECTS *********
    const projectsContainer = document.getElementById('projects-container');
    if(projectsContainer) {
        // A lógica para renderizar projetos também precisa ser ajustada para a descrição em array
        projectsContainer.innerHTML = content.projects.map(p => {
            const description = Array.isArray(p.description) ? p.description.join('') : p.description;
            return `<div class="bg-white/90 p-4 rounded-lg border border-slate-200 hover:border-cyan-400 hover:shadow-md 
            transition-all duration-300"><h3 class="font-bold text-lg text-slate-800">${p.title}</h3><p class="text-sm text-slate-500 mt-1 mb-3">
            ${description}</p><div class="flex items-center space-x-4"><a href="${p.link}" target="_blank" rel="noopener noreferrer" 
            class="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-700 font-semibold">${content.viewProjectLink} 
            <i data-lucide="arrow-up-right" class="w-4 h-4 ml-1"></i></a>${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener noreferrer" 
            class="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 font-semibold">
            <i data-lucide="github" class="w-4 h-4 mr-1"></i> ${content.viewRepoLink}</a>` : ''}</div></div>`;
        }).join('');
    }
    // ********* CONTACT *********
const contactContainer = document.getElementById('contact-container');
if(contactContainer) {
    contactContainer.innerHTML = `<div class="flex items-center text-slate-600"><i data-lucide="mail" class="w-5 h-5 mr-3 text-cyan-600"></i><a href="mailto:${content.contactEmail}" class="hover:text-cyan-600 transition-colors">${content.contactEmail}</a></div><div class="flex items-center text-slate-600"><i data-lucide="phone" class="w-5 h-5 mr-3 text-cyan-600"></i><span>${content.contactPhone}</span></div><div class="flex items-center text-slate-600"><i data-lucide="message-square-more" class="w-5 h-5 mr-3 text-cyan-600"></i><a href="${content.contactWhatsapp}" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-600 transition-colors">WhatsApp</a></div>`;
} 
    //  Garantindo renderizção do Lucide icon whatsapp
    lucide.createIcons(); 
}    
function router() {
    const hash = window.location.hash || '#home';
    pages.forEach(page => {
        if (`#${page.id.split('-')[1]}` === hash) {
            page.classList.add('active');
            page.style.opacity = 0;
            setTimeout(() => page.style.opacity = 1, 50);
        } else {
            page.classList.remove('active');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === hash);
    });
}

function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en-US';
    langPtBtn.classList.toggle('opacity-100', lang === 'pt');
    langPtBtn.classList.toggle('opacity-50', lang !== 'pt');
    langEnBtn.classList.toggle('opacity-100', lang === 'en');
    langEnBtn.classList.toggle('opacity-50', lang !== 'en');
    renderContent(lang);
}

// --- LÓGICA DO CONTADOR DE VISITAS (VERSÃO FINAL COM API VisitorBadge) ---
async function updateAndLogVisitCount() {
    // Usar um identificador simples e consistente para a sua página.
    const pageId = 'danielriegoor.portfolio';

    const today = new Date().toISOString().split('T')[0];
    const lastVisitDate = localStorage.getItem('lastVisitDate');
    const shouldCountHit = lastVisitDate !== today;

    // A URL é diferente para incrementar (count=1) e para apenas obter (count=0).
    const apiUrl = `https://api.visitorbadge.io/api/visitors?path=${pageId}&count=${shouldCountHit ? 1 : 0}&format=json`;

    if (shouldCountHit) {
        console.log('Registrando nova visita única para o dia...');
    } else {
        console.log('Visita já registrada hoje. Buscando contagem atual...');
    }

    try {
        const response = await fetch(apiUrl, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`O servidor respondeu com o status ${response.status}`);
        }
        const data = await response.json();

        // O valor vem no campo 'total'.
        const count = data.total;

        if (typeof count === 'undefined') {
            throw new Error('Formato de resposta da API inesperado.');
        }

        console.log(`✅ Sucesso! Total de visitas: ${count}`);

        // Armazena a data da visita apenas se o hit foi bem-sucedido.
        if (shouldCountHit) {
            localStorage.setItem('lastVisitDate', today);
        }

    } catch (error) {
        console.error(`❌ Falha ao comunicar com a API de contagem: ${error.message}`);
    }
}


// Event Listeners
window.addEventListener('hashchange', router);
window.addEventListener('resize', startAnimation);
langPtBtn.addEventListener('click', () => setLanguage('pt'));
langEnBtn.addEventListener('click', () => setLanguage('en'));

// Inicialização
async function init() {
    await fetchContentData();
    const savedLang = localStorage.getItem('preferredLanguage') || 'pt';
    setLanguage(savedLang);
    router();
    startAnimation();
    lucide.createIcons();
    
    // Adiciona a chamada para o contador de visitas
    await updateAndLogVisitCount();
}

init();