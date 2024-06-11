import subprocess
import sys

def install_packages():
    packages = [
        'Flask',
        'flask-cors',
        'requests',
        'beautifulsoup4'
    ]
    for package in packages:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])

install_packages()

import app  # Importa e executa o script principal
