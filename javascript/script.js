const abas = document.querySelectorAll('.guides ul li');


abas.forEach(aba => {
    aba.addEventListener('click', function(evento) {
        evento.preventDefault();
        abas.forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
});