/* =====================================================
   curso-detalhe.js — Lógica genérica de detalhe de curso
   Funciona em QUALQUER página de curso do TechLearn.
   ===================================================== */

/*
   localStorage salva dados permanentemente no navegador.
   Todos os cursos compartilham a mesma chave, mas cada aula
   tem um ID único (ex: "ux-design", "dev-web-mobile-first").
*/
const aulasConcluidas = new Set(
    JSON.parse(localStorage.getItem('techlearn_concluidas') || '[]')
);

/* ---- Aplicar visual de "concluída" em uma aula ---- */
function aplicarVisualConcluida(idAula) {
    /* Mostra o badge verde "✓ Aula concluída" */
    const badge = document.getElementById('badge-' + idAula);
    if (badge) badge.style.display = 'flex';

    /* Botão vira verde e desabilita clique */
    const btn = document.getElementById('btn-concluir-' + idAula);
    if (btn) {
        btn.classList.add('btn-concluido');
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                 stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Aula concluída`;
        btn.onclick = null;
    }

    /* Radio vira checkmark verde no accordion */
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

/* ---- Marcar aula como concluída (chamada pelo botão) ---- */
function marcarConcluida(idAula) {
    if (aulasConcluidas.has(idAula)) return;

    aulasConcluidas.add(idAula);
    localStorage.setItem('techlearn_concluidas', JSON.stringify([...aulasConcluidas]));

    aplicarVisualConcluida(idAula);
    atualizarProgresso();
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

/* ---- Atualizar contadores de progresso (genérico) ---- */
/*
   Percorre cada módulo (<details class="modulo">) na página
   e conta dinamicamente quantas aulas foram concluídas.
   Funciona para qualquer quantidade de módulos e aulas.
*/
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
});
