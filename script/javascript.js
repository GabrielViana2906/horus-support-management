// Espera a página carregar por completo
        document.addEventListener("DOMContentLoaded", function() {
            
            // 1. Cria os ícones baseados nas tags <i data-lucide="...">
            lucide.createIcons();

            // 2. Lógica para trocar a classe "active" nas abas do Ribbon (INÍCIO, TICKETS...)
            var abas = document.querySelectorAll(".tab-btn");
            
            for (var i = 0; i < abas.length; i++) {
                abas[i].addEventListener("click", function() {
                    // Remove 'active' de todas as abas
                    for (var j = 0; j < abas.length; j++) {
                        abas[j].classList.remove("active");
                    }
                    // Adiciona 'active' apenas na aba que foi clicada
                    this.classList.add("active");
                });
            }

            // 3. Lógica para trocar a classe "active" nos botões da barra lateral
            var botoesSidebar = document.querySelectorAll(".sidebar-btn");

            for (var k = 0; k < botoesSidebar.length; k++) {
                botoesSidebar[k].addEventListener("click", function() {
                    // Remove 'active' de todos os botões do menu
                    for (var l = 0; l < botoesSidebar.length; l++) {
                        botoesSidebar[l].classList.remove("active");
                        
                        // Reseta a cor do ícone dos botões inativos
                        var iconeInativo = botoesSidebar[l].querySelector("svg");
                        if (iconeInativo) {
                            iconeInativo.style.color = "#475569";
                        }
                    }
                    
                    // Adiciona 'active' no botão clicado
                    this.classList.add("active");
                    
                    // Muda a cor do ícone do botão ativo para branco
                    var iconeAtivo = this.querySelector("svg");
                    if (iconeAtivo) {
                        iconeAtivo.style.color = "#ffffff";
                    }
                });
            }

        });