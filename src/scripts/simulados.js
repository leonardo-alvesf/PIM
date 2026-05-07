const CURSOS_AULAS = {
    'ux-ui-design': ['ux-design', 'heuristicas', 'hierarquia'],
    'dev-web': ['dev-web-mobile-first'],
    'banco-dados': ['banco-sql-nosql'],
    'eng-software': ['eng-software-scrum'],
    'csharp': ['csharp-sintaxe', 'csharp-classes']
};

function obterSimuladosDesbloqueados() {
    return new Set(JSON.parse(sessionStorage.getItem('techlearn_simulados_desbloqueados') || '[]'));
}

function obterAulasConcluidas() {
    return new Set(JSON.parse(sessionStorage.getItem('techlearn_concluidas') || '[]'));
}

function verificarSimuladoDesbloqueado(cursoId) {
    return obterSimuladosDesbloqueados().has(cursoId);
}

function desbloquearSimulado(cursoId) {
    const simuladosDesbloqueados = obterSimuladosDesbloqueados();
    simuladosDesbloqueados.add(cursoId);
    sessionStorage.setItem('techlearn_simulados_desbloqueados', JSON.stringify([...simuladosDesbloqueados]));
    atualizarEstadoSimulado(cursoId);
}

function atualizarEstadoSimulado(cursoId) {
    const card = document.querySelector('[data-curso="' + cursoId + '"]');
    const bloqueadoEl = document.getElementById('bloqueado-' + cursoId);
    const desbloqueadoEl = document.getElementById('desbloqueado-' + cursoId);

    if (verificarSimuladoDesbloqueado(cursoId)) {
        if (bloqueadoEl) bloqueadoEl.style.display = 'none';
        if (desbloqueadoEl) desbloqueadoEl.style.display = 'flex';
        if (card) {
            card.classList.add('desbloqueado');
            card.onclick = function () {
                window.location.href = 'simulado-intro.html?curso=' + cursoId;
            };
        }
    } else {
        if (bloqueadoEl) bloqueadoEl.style.display = 'flex';
        if (desbloqueadoEl) desbloqueadoEl.style.display = 'none';
        if (card) {
            card.classList.remove('desbloqueado');
            card.onclick = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    Object.keys(CURSOS_AULAS).forEach(cursoId => {
        atualizarEstadoSimulado(cursoId);
    });
});

window.addEventListener('simuladoDesbloqueado', function (event) {
    atualizarEstadoSimulado(event.detail.curso);
});
