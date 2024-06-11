function delayconsultarCep() {
    clearTimeout(timer); // Limpa o temporizador anterior
    timer = setTimeout(consultarCep, 2000); // Define um novo temporizador de 2 segundos
}


function consultarCep() {
    const modalContent = document.getElementById('modalContent');
    var cep = document.getElementById('cep').value;
        url = `/api/consultar-cep?cep=${cep}`;
        

    if (modalContent) {
        modalContent.innerHTML = '<p>Carregando...</p>';
        modalContent.style.overflowY = 'auto';
        modalContent.style.maxHeight = '400px';
    }

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            
           
            modalContent.style.width = '60%';
            modalContent.innerHTML = '<button class="consulta" style="margin-left:100px;" onclick="novaConsultaCep()">Nova consulta</button>';
          
            if (data.erro) {
                modalContent.innerHTML = `<p style="margin-left:100px;">CEP não encontrado!</p>
                <button class="consulta" style="margin-left:100px;" onclick="novaConsultaCep()">Nova consulta</button>`;
            } else {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    modalContent.innerHTML += '<p><strong>' + key + ':</strong> ' + data[key] + '<button class="copiar" title="Copiar informação" onclick="copiarTexto(\'' + 
                    (data[key] || 'Não disponível') + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button>' + '</p>';
                }
            }
        }
            var modal = document.getElementById('myModal');
            modal.style.display = 'block';
        })
        .catch((error) => {
            console.error('Erro ao consultar:', error);
        });
}

function validarCep() {
    const cepInput = document.getElementById('cep');
    const ceplabel = document.getElementById('ceplabel');
    const cepformat = cepInput.value.replace(/[^\d]+/g, '');

    if (cepformat.length <= 7 || cepformat.length >= 9) {
        cepInput.classList.add('erro');
        cepInput.classList.remove('sucesso');
        ceplabel.classList.add('erro');
        ceplabel.classList.remove('sucesso');
        ceplabel.classList.remove('verde');
        ceplabel.classList.add('vermelho');
    } else if (cepformat.length === 8) {
        cepInput.classList.remove('erro');
        cepInput.classList.add('sucesso');
        ceplabel.classList.remove('erro');
        ceplabel.classList.add('sucesso');
        ceplabel.classList.remove('vermelho');
        ceplabel.classList.add('verde');
    } else {
        cepInput.classList.remove('sucesso');
        cepInput.classList.remove('erro');
        ceplabel.classList.remove('sucesso');
        ceplabel.classList.remove('erro');
        ceplabel.classList.remove('verde');
        ceplabel.classList.remove('vermelho');
    }
}

// Adicionando estilos para a label quando o input recebe foco
document.getElementById('cep').addEventListener('focus', function() {
    const ceplabel = document.getElementById('ceplabel');
    if (this.classList.contains('sucesso')) {
        ceplabel.classList.add('verde');
        ceplabel.classList.remove('vermelho');
    } else if (this.classList.contains('erro')) {
        ceplabel.classList.add('vermelho');
        ceplabel.classList.remove('verde');
    }
});


function novaConsultaCep() {
    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        modalContent.innerHTML = `
        <div class="form-group">
            <input class="input borda" type="text" id="cep"  style="margin-top:10px; margin-left: 65px;"  oninput="validarEntrada(event),validarCep(), delayconsultarCep()" required>
            <label for="cep-input" style="margin-top:7px; margin-left: 70px;">CEP</label>
        </div>
`;
    }
}

