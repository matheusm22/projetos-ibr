function Consulta_sefaz() {
    const modalContent = document.getElementById('modalContent');
    
    if (modalContent) {
        modalContent.innerHTML = '<p>Carregando...</p>';
    }
    
    fetch('/consulta_sefaz')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta da consulta:', data);  // Log para depuração
        if (data.error) {
            modalContent.innerHTML = `<p>${data.error}</p>`;
            return;
        }
        const now = new Date();
        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const ultima_atualizacao = `${now.toLocaleDateString('pt-BR', dateOptions)} ${now.toLocaleTimeString('pt-BR', timeOptions)}`;
        
        
        modalContent.style.top = '50%';
        let htmlContent =  `
        <button class="consulta" style="width: 55px;" onclick="novaConsulta()">
        <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' fill='currentColor' class='bi bi-arrow-repeat' viewBox='0 0 16 16'>
                    <path d='M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9'/>
                    <path fill-rule='evenodd' d='M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z'/>
                </svg>
            </button>
            <span><strong>Última atualização: ${ultima_atualizacao}<strong></span>
        `;
;

            if (data.services_status && data.services_status.length > 0) {
                htmlContent += '<table class="tabela-status" border="1">';
                htmlContent += '<tr><th>Autorizador</th><th>Autorização</th><th>Retorno Autorização</th><th>Inutilização</th><th>Consulta Protocolo</th><th>Status Serviço</th></tr>';

                data.services_status.forEach(service => {
                    htmlContent += `<tr>
                    <td>${service.autorizador}</td>
                    <td class="${service.autorizacao === 'ativo' ? 'ativo' : 'inativo'}">${service.autorizacao}</td>
                    <td class="${service.retorno_autorizacao === 'ativo' ? 'ativo' : 'inativo'}">${service.retorno_autorizacao}</td>
                    <td class="${service.inutilizacao === 'ativo' ? 'ativo' : 'inativo'}">${service.inutilizacao}</td>
                    <td class="${service.consulta_protocolo === 'ativo' ? 'ativo' : 'inativo'}">${service.consulta_protocolo}</td>
                    <td class="${service.status_servico === 'ativo' ? 'ativo' : 'inativo'}">${service.status_servico}</td>
                </tr>`;
                });

                htmlContent += '</table>';
            } else {
                htmlContent += '<p>Não foi possível obter o status dos serviços.</p>';
            }

            modalContent.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Erro na consulta da Sefaz:', error);
            modalContent.innerHTML = '<p>Ocorreu um erro ao tentar consultar a disponibilidade da Sefaz. Tente novamente mais tarde.</p>';
        });
}

function novaConsulta() {
    Consulta_sefaz();
}
