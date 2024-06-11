from flask import Flask, send_from_directory, request, jsonify, render_template
from flask_cors import CORS
import os
import requests
from bs4 import BeautifulSoup



app = Flask(__name__)

# Configurando uma função para adicionar cabeçalhos CORS em cada resposta
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin and origin.startswith('http://192.168.15.'):
        response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


static_folder = os.path.join(os.getcwd(), 'templates')

# Rota para servir arquivos estáticos
@app.route('/templates/<path:path>')
def serve_static(path):
    return send_from_directory(static_folder, path)

@app.route('/')
def index():
    return render_template('/index.html')

# Consulta CNPJ
@app.route('/consulta_cnpj', methods=['POST'])
def consulta_cnpj():
    cnpj = request.json['cnpj']
    data = consultar_dados_cnpj(cnpj)
    return jsonify(data)

def consultar_dados_cnpj(cnpj):
    url = f'https://www.receitaws.com.br/v1/cnpj/{cnpj}'
    response = requests.get(url)
    data = response.json()
    return data

# Consulta IBGE
@app.route('/consulta_ibge', methods=['GET'])
def consulta_ibge():
    cidade = request.args.get('cidade')
    estado = request.args.get('estado')

    if not cidade or not estado:
        return jsonify({'erro': 'Parâmetros "cidade" e "estado" devem ser fornecidos'}), 400

    # Abrir o arquivo ibge.txt e buscar o código IBGE para a cidade e estado fornecidos
    with open('/templates/ibge.txt', 'r') as file:
        for line in file:
            parts = line.strip().split(',')
            if len(parts) == 3 and parts[0] == cidade and parts[1] == estado:
                return jsonify({'estado': parts[1], 'cidade': parts[0], 'codigo_ibge': parts[2]}), 200

    return jsonify({'erro': 'Código IBGE não encontrado para a cidade e estado fornecidos'}), 404


@app.route('/api/consultar-cep', methods=['GET'])
def api_consultar_cep():
    cep = request.args.get('cep')
  

    resultado = None
    if cep:
        resultado = consultar_cep_via_cep(cep)
        
    if resultado:
        return jsonify(resultado)
    else:
        return jsonify({"erro": "CEP não encontrado"}), 404

def consultar_cep_via_cep(cep):
    url = f'https://viacep.com.br/ws/{cep}/json/'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None


# Consulta Sefaz
@app.route('/consulta_sefaz', methods=['GET'])
def consulta_sefaz():
    url = 'https://www.nfe.fazenda.gov.br/portal/disponibilidade.aspx'

    try:
        response = requests.get(url)
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP 4xx/5xx

        soup = BeautifulSoup(response.text, 'html.parser')

        # Encontrando a tabela de disponibilidade dos serviços
        table = soup.find('table', {'class': 'tabelaListagemDados'})

        if not table:
            return jsonify({'erro': 'Tabela de serviços não encontrada'}), 404

        services_status = []

        for row in table.find_all('tr')[1:]:  # Pular o cabeçalho
            cols = row.find_all('td')
            autorizador = cols[0].text.strip()
            status = [
                'ativo' if col.find('img') and col.find('img')['src'].endswith('bola_verde_P.png') else 'inativo'
                for col in cols[1:6]  # Ajustando para apenas as primeiras 5 colunas
            ]

            services_status.append({
                'autorizador': autorizador,
                'autorizacao': status[0],
                'retorno_autorizacao': status[1],
                'inutilizacao': status[2],
                'consulta_protocolo': status[3],
                'status_servico': status[4],
            })

        return jsonify({'services_status': services_status}), 200

    except requests.RequestException as e:
        # Log de erro detalhado para debugging
        print(f"Erro na consulta HTTP: {e}")
        return jsonify({'erro': 'Falha na conexão com o site da Sefaz'}), 500
    except Exception as e:
        # Log de erro detalhado para debugging
        print(f"Erro inesperado: {e}")
        return jsonify({'erro': 'Erro inesperado no servidor'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)







