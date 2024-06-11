let timer;


// Função para abrir o modal
function openModal(menu) {
    var modalContent = document.getElementById("modalContent");

    var modal = document.getElementById("myModal");
    if (modal) {
        modal.style.display = "block";

        // Atualizar o título do modal conforme o menu
        var title = getMenuTitle(menu);
        var modalTitle = document.getElementById("modalTitle");
        if (modalTitle) {
            modalTitle.innerHTML = title;
        }

        // Copiar o HTML do formulário correspondente e inseri-lo dentro do modal
        var formHTML = document.getElementById(menu + "-form").innerHTML;
        var modalContent = document.getElementById("modalContent");
        if (modalContent) {
            modalContent.innerHTML = formHTML;
        }

        // Adicionar evento de clique fora do modal para fechar
        window.onclick = function (event) {
            if (event.target == modal) {
                closeModal();
            }
        }
    }
}

// Função para fechar o modal e limpar o cache
function closeModal() {
    var modal = document.getElementById("myModal");
    if (modal) {
        modal.style.display = "none";
        
        
        var modalContent = document.getElementById("modalContent");
        if (modalContent) {
            modalContent.innerHTML = '';
            modalContent.style.width = ''; // Resetar a largura do modalContent
        }
        
        location.reload();
        
        // Remover o evento de clique fora do modal
        window.onclick = null;
    }
}

// Função para obter o título do menu
function getMenuTitle(menu) {
    switch (menu) {
    
        case 'cep':
            return 'CEP';
        case 'cnpj':
            return 'CNPJ';
        case 'ibge':
            return 'IBGE';
        case 'sefaz':
            return 'Disponibilidade Sefaz';
        default:
            return 'Consultar';
    }
}

function copiarTexto(texto) {
    const input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = texto;
    document.body.appendChild(input);
    input.focus();
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);

    const modal = document.getElementById('copyModal');
    if (modal) {
        const buttonRect = event.target.getBoundingClientRect();
        const modalWidth = modal.offsetWidth;
        const modalHeight = modal.offsetHeight;

        const left = buttonRect.right + 10;
        const top = buttonRect.top + (buttonRect.height / 2) - (modalHeight / 2);

        modal.style.left = `${left}px`;
        modal.style.top = `${top}px`;

        modal.classList.add('show');
        setTimeout(() => {
            modal.classList.remove('show');
        }, 2000);
    }
}

function validarEntrada(evento) {
    const campoEntrada = evento.target;
    const caracteresInvalidos = /[^0-9.\-\/]/g; // Regex para encontrar qualquer coisa que não seja um dígito

        if (caracteresInvalidos.test(campoEntrada.value)) {
            campoEntrada.value = campoEntrada.value.replace(caracteresInvalidos, '');
        }
}

