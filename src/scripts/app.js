/* app.js — TechLearn */

/* ========== DADOS ========== */

const CURSOS_AULAS = {
    'ux-ui-design':  ['ux-design', 'heuristicas', 'hierarquia'],
    'dev-web':       ['dev-web-mobile-first'],
    'banco-dados':   ['banco-sql-nosql'],
    'eng-software':  ['eng-software-scrum'],
    'csharp':        ['csharp-sintaxe', 'csharp-classes']
};

const CURSOS_INFO = {
    'ux-ui-design': {
        titulo:  'Simulado de UX e UI Design',
        descricao: 'Teste seus conhecimentos sobre experiência e interface do usuário'
    },
    'dev-web': {
        titulo:  'Simulado de Desenvolvimento Web Responsivo',
        descricao: 'Avalie seu domínio sobre design responsivo e mobile-first'
    },
    'banco-dados': {
        titulo:  'Simulado de Modelagem de Banco de Dados e NoSQL',
        descricao: 'Teste seus conhecimentos sobre bancos de dados relacionais e não-relacionais'
    },
    'eng-software': {
        titulo:  'Simulado de Engenharia de Software Aplicada',
        descricao: 'Avalie seu conhecimento sobre metodologias, padrões e boas práticas'
    },
    'csharp': {
        titulo:  'Simulado de Programação em C#',
        descricao: 'Teste seus conhecimentos sobre programação estruturada e orientada a objetos'
    }
};


/* ========== ESTADO ========== */

const aulasConcluidas = new Set(
    JSON.parse(sessionStorage.getItem('techlearn_concluidas') || '[]')
);

function obterSimuladosDesbloqueados() {
    return new Set(JSON.parse(sessionStorage.getItem('techlearn_simulados_desbloqueados') || '[]'));
}

function verificarSimuladoDesbloqueado(cursoId) {
    return obterSimuladosDesbloqueados().has(cursoId);
}


/* ========== BUSCA DE CURSOS (cursos.html) ========== */

function iniciarBuscaCursos() {
    const campoBusca = document.getElementById('buscar-cursos');
    if (!campoBusca) return;

    campoBusca.addEventListener('input', function () {
        const termo = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.card-curso-item');
        let encontrados = 0;

        cards.forEach(function (card) {
            const titulo    = card.querySelector('.card-curso-titulo').textContent.toLowerCase();
            const descricao = card.querySelector('.card-curso-descricao').textContent.toLowerCase();
            const visivel   = titulo.includes(termo) || descricao.includes(termo);

            card.closest('article').style.display = visivel ? 'block' : 'none';
            if (visivel) encontrados++;
        });

        const contador = document.getElementById('contador-cursos');
        if (contador) {
            const plural = encontrados !== 1 ? 's' : '';
            contador.textContent = encontrados + ' curso' + plural + ' encontrado' + plural;
        }
    });
}


/* ========== PERFIL (perfil.html) ========== */

function iniciarPerfil() {
    const viewMode    = document.getElementById('perfil-view');
    const editMode    = document.getElementById('perfil-edit');
    const btnAbrir    = document.getElementById('btn-abrir-edicao');
    const btnSalvar   = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');

    if (!viewMode) return;

    const form = document.getElementById('perfil-edit');
    if (form) form.addEventListener('submit', e => e.preventDefault());

    if (btnAbrir) {
        btnAbrir.addEventListener('click', function () {
            viewMode.style.display = 'none';
            editMode.style.display = 'block';
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', function () {
            editMode.style.display = 'none';
            viewMode.style.display = 'flex';
        });
    }

    if (btnSalvar) {
        btnSalvar.addEventListener('click', function () {
            const novoNome  = document.getElementById('input-nome').value.trim();
            const novoEmail = document.getElementById('input-email').value.trim();

            if (novoNome)  document.getElementById('exibir-nome').textContent  = novoNome;
            if (novoEmail) document.getElementById('exibir-email').textContent = novoEmail;

            editMode.style.display = 'none';
            viewMode.style.display = 'flex';
        });
    }
}


/* ========== DETALHE DE CURSO (curso-*.html) ========== */

function obterCursoId() {
    const main = document.querySelector('[data-curso]');
    return main ? main.getAttribute('data-curso') : null;
}

function simuladoJaDesbloqueado() {
    const cursoId = obterCursoId();
    if (!cursoId) return true;
    return verificarSimuladoDesbloqueado(cursoId);
}

function aplicarVisualConcluida(idAula) {
    const badge = document.getElementById('badge-' + idAula);
    if (badge) badge.style.display = 'flex';

    const btn = document.getElementById('btn-concluir-' + idAula);
    if (btn) btn.style.display = 'none';

    const itemAula = document.querySelector('[data-aula="' + idAula + '"]');
    if (itemAula) {
        const radio = itemAula.querySelector('.radio-aula');
        if (radio) {
            radio.style.backgroundColor = '#16A34A';
            radio.style.borderColor     = '#16A34A';
            radio.style.display         = 'flex';
            radio.style.alignItems      = 'center';
            radio.style.justifyContent  = 'center';
            radio.innerHTML = `
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none"
                     stroke="white" stroke-width="3.5"
                     stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>`;
        }
    }
}

function mostrarCardConclusao(idAula) {
    const cursoId = obterCursoId();
    if (!cursoId) return;

    const existente = document.getElementById('card-conclusao-curso');
    if (existente) existente.remove();

    const article = document.querySelector('#painel-' + idAula + ' article');
    if (!article) return;

    const card = document.createElement('section');
    card.id = 'card-conclusao-curso';
    card.className = 'card-conclusao-curso';
    card.innerHTML = `
        <div class="icone-conclusao" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="6"/>
                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
            </svg>
        </div>
        <div class="conclusao-texto">
            <h2 class="titulo-conclusao">Todas as aulas concluídas!</h2>
            <p class="descricao-conclusao">Marque o curso como completo para desbloquear o simulado</p>
        </div>
        <button type="button" class="btn-completar-curso" onclick="desbloquearCurso('${cursoId}')">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                 stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Marcar curso como completo
        </button>
    `;

    article.appendChild(card);
}

function marcarConcluida(idAula) {
    if (aulasConcluidas.has(idAula)) return;

    aulasConcluidas.add(idAula);
    sessionStorage.setItem('techlearn_concluidas', JSON.stringify([...aulasConcluidas]));

    aplicarVisualConcluida(idAula);
    atualizarProgresso();

    const todasAulas = Array.from(document.querySelectorAll('.aula-item'))
        .map(item => item.getAttribute('data-aula'));
    const todosConcluidos = todasAulas.every(aula => aulasConcluidas.has(aula));

    if (todosConcluidos && !simuladoJaDesbloqueado()) {
        mostrarCardConclusao(idAula);
    }
}

function desbloquearCurso(cursoId) {
    const simuladosDesbloqueados = obterSimuladosDesbloqueados();
    simuladosDesbloqueados.add(cursoId);
    sessionStorage.setItem('techlearn_simulados_desbloqueados', JSON.stringify([...simuladosDesbloqueados]));

    const card = document.getElementById('card-conclusao-curso');
    if (card) {
        card.className = 'card-curso-completo';
        card.innerHTML = `
            <div class="icone-curso-completo" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none"
                     stroke="white" stroke-width="2.5"
                     stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </div>
            <div class="conclusao-info">
                <h2 class="titulo-curso-completo">Curso completo!</h2>
                <p class="descricao-curso-completo">O simulado foi desbloqueado. Teste seus conhecimentos!</p>
            </div>
            <a href="simulados.html" class="btn-ir-simulados">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Ir para simulados
            </a>
        `;
    }

    window.dispatchEvent(new CustomEvent('simuladoDesbloqueado', { detail: { curso: cursoId } }));
}

function ativarAula(event, idAula) {
    event.preventDefault();

    document.querySelectorAll('.painel-aula').forEach(function (p) {
        p.style.display = 'none';
    });

    const painel = document.getElementById('painel-' + idAula);
    if (painel) painel.style.display = 'block';

    document.querySelectorAll('.aula-item').forEach(function (item) {
        item.classList.remove('ativa');
    });

    const itemClicado = document.querySelector('[data-aula="' + idAula + '"]');
    if (itemClicado) itemClicado.classList.add('ativa');

    if (painel) painel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function atualizarProgresso() {
    document.querySelectorAll('details.modulo').forEach(function (modulo) {
        const itens = modulo.querySelectorAll('.aula-item');
        let concluidas = 0;

        itens.forEach(function (item) {
            if (aulasConcluidas.has(item.getAttribute('data-aula'))) concluidas++;
        });

        const progresso = modulo.querySelector('.modulo-progresso');
        if (progresso) {
            progresso.textContent = concluidas + '/' + itens.length + ' concluídas';
        }
    });
}

function iniciarDetalhe() {
    if (!document.querySelector('.aula-item')) return;

    aulasConcluidas.forEach(function (idAula) {
        aplicarVisualConcluida(idAula);
    });
    atualizarProgresso();

    if (!simuladoJaDesbloqueado()) {
        const todasAulas = Array.from(document.querySelectorAll('.aula-item'))
            .map(item => item.getAttribute('data-aula'));
        const todosConcluidos = todasAulas.length > 0 &&
            todasAulas.every(aula => aulasConcluidas.has(aula));

        if (todosConcluidos) {
            mostrarCardConclusao(todasAulas[todasAulas.length - 1]);
        }
    }
}


/* ========== SIMULADOS (simulados.html) ========== */

function atualizarEstadoSimulado(cursoId) {
    const card         = document.querySelector('.card-simulado[data-curso="' + cursoId + '"]');
    const bloqueadoEl  = document.getElementById('bloqueado-' + cursoId);
    const desbloqueadoEl = document.getElementById('desbloqueado-' + cursoId);

    if (verificarSimuladoDesbloqueado(cursoId)) {
        if (bloqueadoEl)     bloqueadoEl.style.display     = 'none';
        if (desbloqueadoEl)  desbloqueadoEl.style.display  = 'flex';
        if (card) {
            card.classList.add('desbloqueado');
            card.onclick = function () {
                window.location.href = 'simulado-intro.html?curso=' + cursoId;
            };
        }
    } else {
        if (bloqueadoEl)     bloqueadoEl.style.display     = 'flex';
        if (desbloqueadoEl)  desbloqueadoEl.style.display  = 'none';
        if (card) {
            card.classList.remove('desbloqueado');
            card.onclick = null;
        }
    }
}

function iniciarSimulados() {
    if (!document.querySelector('.card-simulado')) return;

    Object.keys(CURSOS_AULAS).forEach(cursoId => {
        atualizarEstadoSimulado(cursoId);
    });
}


/* ========== INTRO DO SIMULADO (simulado-intro.html) ========== */

function iniciarIntroSimulado() {
    const tituloEl = document.getElementById('intro-titulo');
    if (!tituloEl) return;

    const params  = new URLSearchParams(window.location.search);
    const cursoId = params.get('curso');
    const info    = CURSOS_INFO[cursoId];

    if (info) {
        tituloEl.textContent = info.titulo;
        const cardTitulo = document.getElementById('intro-card-titulo');
        if (cardTitulo) cardTitulo.textContent = info.titulo;
        const descEl = document.getElementById('intro-descricao');
        if (descEl) descEl.textContent = info.descricao;
        document.title = 'TechLearn — ' + info.titulo;
    }

    const arquivos = {
        'ux-ui-design': 'simulado-ux-ui.html',
        'dev-web':      'simulado-dev-web.html',
        'banco-dados':  'simulado-banco-dados.html',
        'eng-software': 'simulado-eng-software.html',
        'csharp':       'simulado-csharp.html'
    };
    const btn = document.getElementById('btn-comecar');
    if (btn && cursoId && arquivos[cursoId]) {
        btn.href = arquivos[cursoId];
    }
}


/* ========== INIT ========== */

document.addEventListener('DOMContentLoaded', function () {
    iniciarBuscaCursos();
    iniciarPerfil();
    iniciarDetalhe();
    iniciarSimulados();
    iniciarIntroSimulado();
});

window.addEventListener('simuladoDesbloqueado', function (event) {
    atualizarEstadoSimulado(event.detail.curso);
});
