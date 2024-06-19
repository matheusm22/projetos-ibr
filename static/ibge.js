
function delayConsultaIbge() {
    clearTimeout(timer); // Limpa o temporizador anterior
    timer = setTimeout(Consulta_Ibge, 2300); // Define um novo temporizador de 2 segundos
}


function Consulta_Ibge() {
    const modalContent = document.getElementById('modalContent');
    const cidadeInput = document.getElementById('cidade');
    const estadoSelect = document.getElementById('estado_ibge');
    modalContent.style.overflowY = 'auto';
    modalContent.style.maxHeight = '400px';

    const cidade = formatInput(cidadeInput.value);
    const estado = estadoSelect.value;

    // console.log("Cidade formatada:", cidade);
    // console.log("Estado:", estado);

    if (!cidade || !estado) {
        if (modalContent) {
            modalContent.innerHTML = `<p>Por favor, informe o estado e a cidade!</p>
            <button class="consulta" style='margin-left:70px' onclick="novaConsultaIbge()">Nova consulta</button>`;
        }
        return;
    }

    if (modalContent) {
        modalContent.innerHTML = '<p>Carregando...</p>';
    }

    const timeout = setTimeout(() => {
        if (modalContent) {
            modalContent.innerHTML = `<p>Falha na conexão, tente novamente!</p>
            <button class="consulta" onclick="novaConsultaIbge()">Nova consulta</button>`;
        }
    }, 5000);

    const erro = 'Ocorreu um erro interno. Por favor, tente novamente mais tarde.';

    const filePath = '/templates/ibge.txt';

    fetch(filePath)
        .then(response => {
            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(erro);
            }
            return response.text();
        })
        .then(data => {
            // console.log("Conteúdo do arquivo ibge.txt:", data); // Use para testes!
            const lines = data.split('\n');
            for (const line of lines) {
                const parts = line.split(';');
                if (parts.length === 3) {
                    // console.log("Cidade no arquivo:", parts[1]);
                    // console.log("Estado no arquivo:", parts[0]);
                    if (formatInput(parts[1]) === cidade && parts[0] === estado) {
                        const codigo_ibge = parts[2].trim();
                        modalContent.innerHTML = `
                        <button class="consulta" onclick="novaConsultaIbge()">Nova consulta</button>
                            <p><strong>Estado:</strong> ${parts[0]}</p>
                            <p><strong>Cidade:</strong> ${parts[1]}</p>
                            <p><strong>Código IBGE:</strong> ${codigo_ibge} <button class='copiar' onclick="copiarTexto('${codigo_ibge || 'Não disponível'}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/></svg></button></p>
                        `;
                        return;
                    }
                }
            }
            if (modalContent) {
                modalContent.innerHTML = `<p>Código IBGE não encontrado para o estado e cidade informados.</p>
                <button class="consulta" style='margin-left:150px' onclick="novaConsultaIbge()">Nova consulta</button>
               `;
            }
        })
        .catch(error => {
            console.error(error);
            console.log('Verifica o flask!');
            if (modalContent) {
                modalContent.innerHTML = `<p>${error.message || erro}</p>
                <button class="consulta" onclick="novaConsultaIbge()">Nova consulta</button>`;
            }
        });
}

function formatInput(input) {
    return input.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '');
}

document.addEventListener('DOMContentLoaded', function () {
    var estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT',
        'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO',
        'RR', 'SC', 'SP', 'SE', 'TO'
    ];
    var selectEstado = document.getElementById('estado_ibge');
    if (selectEstado) {
        for (var i = 0; i < estados.length; i++) {
            var optionEstado = document.createElement('option');
            optionEstado.value = estados[i];
            optionEstado.textContent = estados[i];
            selectEstado.appendChild(optionEstado);
        }
    }
});


function novaConsultaIbge() {
    // Limpar o conteúdo do modal
    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        modalContent.innerHTML = `
        <div class="form-group">
        <select class="input borda" id="estado_ibge"  oninput="verificarIBGE()" style="width: 100px; margin-top: 10px; margin-left:65px;"  required>
            <option value=""></option>
            <option value="AC">AC</option>
            <option value="AL">AL</option>
            <option value="AP">AP</option>
            <option value="AM">AM</option>
            <option value="BA">BA</option>
            <option value="CE">CE</option>
            <option value="DF">DF</option>
            <option value="ES">ES</option>
            <option value="GO">GO</option>
            <option value="MA">MA</option>
            <option value="MS">MS</option>
            <option value="MT">MT</option>
            <option value="MG">MG</option>
            <option value="PA">PA</option>
            <option value="PB">PB</option>
            <option value="PR">PR</option>
            <option value="PE">PE</option>
            <option value="PI">PI</option>
            <option value="RJ">RJ</option>
            <option value="RN">RN</option>
            <option value="RS">RS</option>
            <option value="RO">RO</option>
            <option value="RR">RR</option>
            <option value="SC">SC</option>
            <option value="SP">SP</option>
            <option value="SE">SE</option>
            <option value="TO">TO</option>
        </select>
        <label for="estado_ibge" style="margin-top: 7px; margin-left:64px;">Estado</label>
    </div>
    <div class="form-group">
        <input class="input borda" type="text" id="cidade"  oninput="verificarIBGE(), delayConsultaIbge()" required>
        <label for="cidade">Cidade</label>
    </div>`;
    }
}

function verificarIBGE() {
    var estadoSelecionado = document.getElementById('estado_ibge').value;
    var cidadeDigitada = normalizeCidade(document.getElementById('cidade').value);
   
    
    // Lendo o conteúdo do arquivo ibge.txt
    fetch('/templates/ibge.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao ler o arquivo: ' + response.statusText);
      }
      return response.text();
    })
    .then(data => {
      var linhas = data.split('\n');
      var encontrado = false;
      for (var i = 0; i < linhas.length; i++) {
        var campos = linhas[i].split(';');
        if (campos.length >= 2) {
          var uf = campos[0];
          var cidade = normalizeCidade(campos[1]);
          if (uf === estadoSelecionado && cidade === cidadeDigitada) {
            encontrado = true;
            break;
          }
        }
      }
      if (encontrado) {
          document.getElementById('cidade').classList.remove('erro');
          document.getElementById('cidade').classList.add('sucesso');
          document.getElementById('estado_ibge').classList.remove('erro');
          document.getElementById('estado_ibge').classList.add('sucesso');
      } else {
        document.getElementById('cidade').classList.remove('sucesso');
        document.getElementById('cidade').classList.add('erro');
        document.getElementById('estado_ibge').classList.remove('sucesso');
        document.getElementById('estado_ibge').classList.add('erro');
      }
    })
    .catch(error => console.error(error));
  }
  
  function normalizeCidade(cidade) {
    return removeAcentos(cidade.trim()).toLowerCase().replace(/[^a-zA-Z\s]/g, '');
  }
  
  function removeAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }