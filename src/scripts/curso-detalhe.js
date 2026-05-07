/* =====================================================
   curso-detalhe.js — Lógica genérica de detalhe de curso
   Funciona em QUALQUER página de curso do TechLearn.
   ===================================================== */

const aulasConcluidas = new Set(
    JSON.parse(sessionStorage.getItem('techlearn_concluidas') || '[]')
);

/* ---- Obter o ID do curso desta página ---- */
function obterCursoId() {
    const main = document.querySelector('[data-curso]');
    return main ? main.getAttribute('data-curso') : null;
}

/* ---- Verificar se o simulado deste curso já foi desbloqueado ---- */
function simuladoJaDesbloqueado() {
    const cursoId = obterCursoId();
    if (!cursoId) return true;
    const desbloqueados = new Set(
        JSON.parse(sessionStorage.getItem('techlearn_simulados_desbloqueados') || '[]')
    );
    return desbloqueados.has(cursoId);
}

/* ---- Aplicar visual de "concluída" em uma aula ---- */
function aplicarVisualConcluida(idAula) {
    const badge = document.getElementById('badge-' + idAula);
    if (badge) badge.style.display = 'flex';

    /* Oculta o botão ao invés de mudar o texto */
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

/* ---- Mostrar card de conclusão no painel da aula ---- */
function mostrarCardConclusao(idAula) {
    const cursoId = obterCursoId();
    if (!cursoId) return;

    /* Remover card anterior se existir */
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
                 stroke-linecap="round" stroke-linejoin="round"
                 aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Marcar curso como completo
        </button>
    `;

    article.appendChild(card);
}

/* ---- Marcar aula como concluída ---- */
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

/* ---- Desbloquear curso ---- */
function desbloquearCurso(cursoId) {
    const simuladosDesbloqueados = new Set(
        JSON.parse(sessionStorage.getItem('techlearn_simulados_desbloqueados') || '[]')
    );
    simuladosDesbloqueados.add(cursoId);
    sessionStorage.setItem('techlearn_simulados_desbloqueados', JSON.stringify([...simuladosDesbloqueados]));

    const card = document.getElementById('card-conclusao-curso');
    if (card) card.remove();

    window.dispatchEvent(new CustomEvent('simuladoDesbloqueado', { detail: { curso: cursoId } }));
}

/* ---- Trocar a aula exibida ---- */
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

/* ---- Atualizar contadores de progresso ---- */
function atualizarProgresso() {
    document.querySelectorAll('details.modulo').forEach(function (modulo) {
        const itens = modulo.querySelectorAll('.aula-item');
        let concluidas = 0;

        itens.forEach(function (item) {
            if (aulasConcluidas.has(item.getAttribute('data-aula'))) {
                concluidas++;
            }
        });

        const progresso = modulo.querySelector('.modulo-progresso');
        if (progresso) {
            progresso.textContent = concluidas + '/' + itens.length + ' concluídas';
        }
    });
}

/* ---- Restaurar estado ao carregar a página ---- */
document.addEventListener('DOMContentLoaded', function () {
    aulasConcluidas.forEach(function (idAula) {
        aplicarVisualConcluida(idAula);
    });
    atualizarProgresso();

    /* Se todas as aulas já concluídas e simulado ainda não desbloqueado,
       mostrar card de conclusão na última aula da lista */
    if (!simuladoJaDesbloqueado()) {
        const todasAulas = Array.from(document.querySelectorAll('.aula-item'))
            .map(item => item.getAttribute('data-aula'));
        const todosConcluidos = todasAulas.length > 0 &&
            todasAulas.every(aula => aulasConcluidas.has(aula));

        if (todosConcluidos) {
            const ultimaAula = todasAulas[todasAulas.length - 1];
            mostrarCardConclusao(ultimaAula);
        }
    }
});
