/* =====================================================
   nav.js — Interatividade de navegação
   TechLearn — Plataforma de Cursos de TI

   Por ora, este arquivo contém apenas a busca de cursos.
   Quando o backend C# estiver pronto, aqui entrarão as
   chamadas à API (fetch para buscar/filtrar dados reais).
   ===================================================== */

/* ---- Busca de cursos em tempo real (página cursos.html) ---- */

/*
   document.getElementById: busca o elemento pelo id no HTML.
   Se o campo não existir na página atual, a variável fica null
   e o código dentro do "if" não executa — sem erros.
*/
const campoBusca = document.getElementById('buscar-cursos');

if (campoBusca) {

    /* "input" dispara toda vez que o usuário digita algo */
    campoBusca.addEventListener('input', function () {

        /* Pega o texto digitado, remove espaços extras e deixa minúsculo */
        const termo = this.value.toLowerCase().trim();

        /* Seleciona todos os cards de curso na página */
        const cards = document.querySelectorAll('.card-curso-item');

        let encontrados = 0; /* contador de cursos visíveis */

        /* Para cada card, verifica se o título ou descrição inclui o termo */
        cards.forEach(function (card) {
            const titulo    = card.querySelector('.card-curso-titulo').textContent.toLowerCase();
            const descricao = card.querySelector('.card-curso-descricao').textContent.toLowerCase();

            /* O card é visível se o termo aparecer no título OU na descrição */
            const visivel = titulo.includes(termo) || descricao.includes(termo);

            /* Mostra ou esconde o article pai (que envolve o card) */
            card.closest('article').style.display = visivel ? 'block' : 'none';

            if (visivel) encontrados++;
        });

        /* Atualiza o texto "X cursos encontrados" */
        const contador = document.getElementById('contador-cursos');
        if (contador) {
            const plural = encontrados !== 1 ? 's' : '';
            contador.textContent = encontrados + ' curso' + plural + ' encontrado' + plural;
        }
    });

}
