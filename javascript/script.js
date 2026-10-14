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

const buttons = document.querySelectorAll(".login-user-type .tipo-login");

buttons.forEach((button) => {
    button.addEventListener("click", () => {

        
        buttons.forEach((b) => {
            b.classList.remove("active");
        });

        
        button.classList.add("active");
    });
});
