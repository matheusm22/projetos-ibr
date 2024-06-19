

function delayConsultarCnpj() {
    clearTimeout(timer); // Limpa o temporizador anterior
    timer = setTimeout(ConsultarCnpj, 2000); // Define um novo temporizador de 2 segundos
}


function ConsultarCnpj() {

    const modalContent = document.getElementById('modalContent');
    const cnpj = document.getElementById('cnpj').value;

    // Verificar se o campo de input do CNPJ está vazio
    if (!cnpj.trim()) {

        if (modalContent) {
            modalContent.innerHTML = `<p>Por favor, insira o CNPJ!</p>
            <button class="consulta" style='margin-left:20px' onclick="openModal('cnpj')">Nova consulta</button>`;
        }
        return; // Encerrar a função se o campo estiver vazio
    }

    // Formatar o CNPJ para remover pontos, traços e barras
    const cnpjSemFormatacao = cnpj.replace(/[^\d]+/g, '');

    // Verificar se o CNPJ formatado tem 14 dígitos
    if (cnpjSemFormatacao.length !== 14) {

        if (modalContent) {
            modalContent.innerHTML = `<p style='margin-left:30px'>CNPJ inválido</p>
            <button class="consulta" style='margin-left:10px' onclick="openModal('cnpj')">Nova consulta</button>`;
        }
        return; // Encerrar a função se o CNPJ for inválido
    }

    // Exibir uma mensagem de "Carregando..." no modal
    if (modalContent) {
        modalContent.innerHTML = '<p>Carregando...</p>';
        modalContent.style.overflowY = 'auto'; // Adicionar barra de rolagem vertical
        modalContent.style.maxHeight = '400px'; // Definir uma altura máxima para a barra de rolagem
    }

    // Exibir uma mensagem de "Falha na conexão!" em caso de erro após 5 segundos
    const timeout = setTimeout(() => {
        if (modalContent) {
            modalContent.innerHTML = `<p>Falha na conexão, tente novamente!</p>
            <button class="consulta" onclick="openModal('cnpj')">Nova consulta</button>`;
            console.log('Verifica o flask!');
        }
    }, 5000);

    // Exibir uma mensagem no modal se ocorrer um erro interno no servidor
    const erro = 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.';

    fetch('http://localhost:5000/consulta_cnpj', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnpj: cnpjSemFormatacao }),
    })
        .then(response => {
            clearTimeout(timeout); // Limpar o temporizador ao receber a resposta do servidor

            if (!response.ok) {
                // Verificar se a resposta não está ok (status diferente de 200)
                throw new Error(erro);
            }
            return response.json();
        })
        .then(data => {

            if (modalContent) {
                // modalContent.style.width = '80%';
                // Gerar HTML para os sócios
                const sociosHtml = data.socios && data.socios.length > 0
                    ? data.socios.map(socio => `<tr><td>${socio.nome || 'Não disponível'}</td><td>${socio.qualificacao || 'Não disponível'}</td></tr>`).join('')
                    : '<tr><td colspan="2">Não disponível</td></tr>';
                modalContent.innerHTML = `
                <button class="consulta" onclick="novaConsultaCnpj()">Nova consulta</button>
                <p><strong>Cnpj:</strong> ${data.cnpj || 'Não disponível'} <button class='copiar' onclick="copiarTexto('${data.cnpj || 'Não disponível'}')"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button></p>
                <p><strong>Nome fantasia:</strong>${data.fantasia || 'Não disponível'} <button class='copiar' onclick="copiarTexto('${data.fantasia || 'Não disponível'}')"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button></p>
                <p><strong>Razão social:</strong> ${data.nome || 'Não disponível'} <button class='copiar' onclick="copiarTexto('${data.nome || 'Não disponível'}')"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button></p>
                <p><strong>Capital Social:</strong>${data.capital_social || 'Não disponível'} <button class='copiar' onclick="copiarTexto('${data.capital_social || 'Não disponível'}')"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button></p>
                <p><strong>Porte:</strong> ${data.porte || 'Não disponível'} <button class='copiar' onclick="copiarTexto('${data.porte || 'Não disponível'}')"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button></p>
                <p><strong>Abertura:</strong> ${data.abertura || 'Não disponível'}
                <p><strong>Atividade principal:</strong> ${data.atividade_principal ? data.atividade_principal.text || 'Não disponível' : 'Não disponível'} 
                <p><strong>Atividades secundárias:</strong> ${data.atividades_secundarias ? data.atividades_secundarias.map(atividade => atividade.text).join(', ') || 'Não disponível' : 'Não disponível'} <button class='copiar' onclick="copiarTexto('${data.atividades_secundarias ? data.atividades_secundarias.map(atividade => atividade.text).join(', ') || 'Não disponível' : 'Não disponível'}'><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button></p>
                <p><strong>Natureza jurídica:</strong> ${data.natureza_juridica || 'Não disponível'} 
                <p><strong>Situação:</strong> ${data.situacao || 'Não disponível'} 
                <p><strong>Status:</strong> ${data.status || 'Não disponível'} 
                <p><strong>Tipo:</strong> ${data.tipo || 'Não disponível'} 
               
                <h4>Contatos</h4>
                <p><strong>Telefone:</strong> ${data.telefone || 'Não disponível'} <button class='copiar' onclick="copiarTexto('${data.telefone || 'Não disponível'}')"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button></p>
                <p><strong>Email:</strong> ${data.email || 'Não disponível'} <button class='copiar' onclick="copiarTexto('${data.email || 'Não disponível'}')"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button></p>
               
                <h4>Localização</h4>
                <p><strong>Cep:</strong> ${data.cep || 'Não disponível'} <button class='copiar' onclick="copiarTexto('${data.cep || 'Não disponível'}')"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button> <img class="maps" title="Ver no google Maps!" onclick="abrirMapa('${data.cep.replace(/\D/g, '')}')" src="../static/maps.png"></p>
                <p><strong>Bairro:</strong> ${data.bairro || 'Não disponível'}
                <p><strong>Número:</strong> ${data.numero || 'Não disponível'} 
                <p><strong>Complemento:</strong> ${data.complemento || 'Não disponível'} 
                <p><strong>Estado:</strong> ${data.uf || 'Não disponível'} 
                <p><strong>Cidade:</strong> ${data.municipio || 'Não disponível'} 
                <br>
                `;

            }

        })

        .catch(error => {
            // Exibir uma mensagem de erro no console em caso de erro na requisição
            console.error(error);
            console.log('Verifica o flask!');
            if (modalContent) {
                modalContent.innerHTML = `<p>Falha na conexão, tente novamente!</p>
                <button class="consulta" onclick="openModal('cnpj')">Nova consulta</button>`;
            }
        });
}

function abrirMapa(cep) {
    // Construir a URL do Google Maps com base no CEP
    const url = 'https://www.google.com/maps/search/?api=1&query=' + cep;

    // Abrir a URL em uma nova janela
    window.open(url, '_blank');
}

function novaConsultaCnpj() {
    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        modalContent.innerHTML = `
        <div class="form-group">
        <input class="input borda" style="margin-top:10px;" oninput="validarEntrada(event),validarCNPJ(), delayConsultarCnpj()" type="text" name="cnpj" id="cnpj" required>
        <label for="cnpj" style="margin-top:7px;">CNPJ</label>
        </div>`
    }
}

function validarCNPJ() {
    const cnpjInput = document.getElementById('cnpj');
    const cnpj = cnpjInput.value.replace(/[^\d]+/g, '');
    const cnpjlabel = document.getElementById('cnpjlabel');
    if (cnpj.length <= 13 || cnpj.length >= 15) {
        cnpjInput.classList.add('erro');
        cnpjInput.classList.remove('sucesso');
        cnpjlabel.classList.add('erro');
        cnpjlabel.classList.remove('sucesso');
        cnpjlabel.classList.remove('verde');
        cnpjlabel.classList.add('vermelho');
    } else if (cnpj.length === 14) {
        cnpjInput.classList.remove('erro');
        cnpjInput.classList.add('sucesso');
        cnpjlabel.classList.remove('erro');
        cnpjlabel.classList.add('sucesso');
        cnpjlabel.classList.remove('vermelho');
        cnpjlabel.classList.add('verde');
    } else {
        cnpjInput.classList.remove('sucesso');
        cnpjInput.classList.remove('erro');
        cnpjlabel.classList.remove('sucesso');
        cnpjlabel.classList.remove('erro');
        cnpjlabel.classList.remove('verde');
        cnpjlabel.classList.remove('vermelho');
    }
}

// Adicionando estilos para a label quando o input recebe foco
document.getElementById('cnpj').addEventListener('focus', function() {
    const cnpjlabel = document.getElementById('cnpjlabel');
    if (this.classList.contains('sucesso')) {
        cnpjlabel.classList.add('verde');
        cnpjlabel.classList.remove('vermelho');
    } else if (this.classList.contains('erro')) {
        cnpjlabel.classList.add('vermelho');
        cnpjlabel.classList.remove('verde');
    }
});



