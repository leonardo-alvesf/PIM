/* =====================================================
   perfil.js — Lógica da tela de perfil
   TechLearn — Plataforma de Cursos de TI
   ===================================================== */

/*
   Pegamos as referências dos elementos que precisamos manipular.
   document.getElementById() busca um elemento pelo seu "id" no HTML.
*/
const viewMode   = document.getElementById('perfil-view');
const editMode   = document.getElementById('perfil-edit');
const btnAbrir   = document.getElementById('btn-abrir-edicao');
const btnSalvar  = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');

/* ---- Abrir modo edição ---- */
if (btnAbrir) {
    btnAbrir.addEventListener('click', function () {
        /* Esconde o modo visualização */
        viewMode.style.display = 'none';

        /* Mostra o formulário de edição */
        editMode.style.display = 'block';
    });
}

/* ---- Cancelar edição ---- */
if (btnCancelar) {
    btnCancelar.addEventListener('click', function () {
        /* Volta para o modo visualização sem salvar */
        editMode.style.display = 'none';
        viewMode.style.display = 'flex';
    });
}

/* ---- Salvar alterações ---- */
if (btnSalvar) {
    btnSalvar.addEventListener('click', function () {
        /* Lê os valores digitados nos campos */
        const novoNome  = document.getElementById('input-nome').value.trim();
        const novoEmail = document.getElementById('input-email').value.trim();

        /* Atualiza os textos na tela de visualização */
        if (novoNome)  document.getElementById('exibir-nome').textContent  = novoNome;
        if (novoEmail) document.getElementById('exibir-email').textContent = novoEmail;

        /*
           Futuramente: aqui vai a chamada ao backend C# para salvar no banco.
           Exemplo: fetch('/api/usuario', { method: 'PUT', body: JSON.stringify({nome, email}) })
        */

        /* Volta para o modo visualização */
        editMode.style.display = 'none';
        viewMode.style.display = 'flex';
    });
}
