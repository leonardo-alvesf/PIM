const CURSOS_INFO = {
    'ux-ui-design': {
        titulo: 'Simulado de UX e UI Design',
        descricao: 'Teste seus conhecimentos sobre experiência e interface do usuário'
    },
    'dev-web': {
        titulo: 'Simulado de Desenvolvimento Web Responsivo',
        descricao: 'Avalie seu domínio sobre design responsivo e mobile-first'
    },
    'banco-dados': {
        titulo: 'Simulado de Modelagem de Banco de Dados e NoSQL',
        descricao: 'Teste seus conhecimentos sobre bancos de dados relacionais e não-relacionais'
    },
    'eng-software': {
        titulo: 'Simulado de Engenharia de Software Aplicada',
        descricao: 'Avalie seu conhecimento sobre metodologias, padrões e boas práticas'
    },
    'csharp': {
        titulo: 'Simulado de Programação em C#',
        descricao: 'Teste seus conhecimentos sobre programação estruturada e orientada a objetos'
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('curso');
    const info = CURSOS_INFO[cursoId];

    if (info) {
        document.getElementById('intro-titulo').textContent = info.titulo;
        document.getElementById('intro-card-titulo').textContent = info.titulo;
        document.getElementById('intro-descricao').textContent = info.descricao;
        document.title = 'TechLearn — ' + info.titulo;
    }

    const btn = document.getElementById('btn-comecar');
    if (btn && cursoId) {
        btn.href = 'simulado-questao.html?curso=' + cursoId;
    }
});
