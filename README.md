# Fullstack User Management Application

Este repositório contém uma aplicação fullstack para gerenciamento de usuários. A aplicação permite cadastrar, visualizar, editar e excluir usuários, com validações específicas (como CPF com apenas números e limite de 11 caracteres, e e-mail válido) e feedback visual em caso de erro. A interface foi desenvolvida em React (utilizando Vite) e o backend utiliza FastAPI com PostgreSQL.

## Índice

- [Features](#features)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Banco de Dados](#banco-de-dados)
- [Como Executar a Aplicação](#como-executar-a-aplicação)
- [Testando a Aplicação](#testando-a-aplicação)
- [Documentação da API](#documentação-da-api)
- [Notas Adicionais](#notas-adicionais)
- [Licença](#licença)

## Features

- **Cadastro de Usuários:**  
  Cadastro com validações específicas para CPF (apenas números, máximo de 11 caracteres) e e-mail (validação em tempo real).
- **Operações CRUD:**  
  Criação, leitura, atualização e deleção de usuários.
- **Feedback Visual:**  
  Mensagens de erro exibidas diretamente no formulário (por exemplo, para CPF duplicado e e-mail inválido) e destaque visual nos campos com erro (label e input em vermelho).
- **Interface Responsiva:**  
  Layout moderno com componentes dispostos de forma compacta (campos agrupados em “duplas”) e tabela de usuários com cabeçalho atrativo, linhas alternadas (branco e cinza) e bordas arredondadas.
- **API Documentada:**  
  Documentação automática da API via Swagger UI.

## Tecnologias Utilizadas

- **Backend:**  
  - Python 3.10+ / 3.12  
  - [FastAPI](https://fastapi.tiangolo.com/)  
  - [SQLAlchemy](https://www.sqlalchemy.org/)  
  - [Pydantic](https://pydantic-docs.helpmanual.io/) (v2.x)  
  - Uvicorn (ASGI Server)  
  - PostgreSQL
- **Frontend:**  
  - [React](https://reactjs.org/)  
  - [Vite](https://vitejs.dev/)  
  - CSS customizado (com medidas em pixels e responsividade)
- **Outras Ferramentas:**  
  - Node.js e npm  
  - Git

## Pré-requisitos

Antes de instalar e configurar o projeto, certifique-se de ter instalado:

- **Python 3.10+** (ou 3.12)  
- **Node.js** (versão 18 ou superior) e npm  
- **PostgreSQL** (recomendado via [Homebrew](https://brew.sh/) no macOS ou conforme seu sistema operacional)  
- **Git**

## Instalação e Configuração

### Backend

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   cd nome-do-repositorio/backend
   ```

2. **Crie e ative um ambiente virtual:**

   ```bash
   python -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate      # Windows
   ```

3. **Instale as dependências do Python:**

   ```bash
   pip install -r requirements.txt
   ```

O arquivo `requirements.txt` deve conter pacotes como fastapi, uvicorn, sqlalchemy, psycopg[binary] (ou psycopg2-binary), pydantic, entre outros.

4. **Configuração do CORS (no `main.py`):**

   Certifique-se de que o CORS esteja configurado para permitir requisições do frontend (por exemplo, de `http://localhost:5173`):

   ```python
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   from routes import router

   app = FastAPI()

   origins = [
       "http://localhost:5173",
       "http://127.0.0.1:5173"
   ]

   app.add_middleware(
       CORSMiddleware,
       allow_origins=origins,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

   app.include_router(router)
   ```

### Frontend

1. **Navegue para a pasta do frontend:**

   ```bash
   cd ../frontend
   ```

2. **Instale as dependências do Node.js:**

   ```bash
   npm install
   ```

3. **Crie um arquivo `.env` na pasta frontend com a seguinte configuração:**

   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```

### Banco de Dados

1. **Instale o PostgreSQL:**

   Se estiver no macOS, pode usar o Homebrew:

   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   ```

2. **Configure o Banco de Dados:**

   Conecte-se ao PostgreSQL e execute os comandos SQL abaixo:

   ```sql
   psql postgres
   CREATE DATABASE registerdb;
   CREATE USER admin_user WITH PASSWORD '1234';
   ALTER DATABASE registerdb OWNER TO admin_user;
   GRANT ALL PRIVILEGES ON DATABASE registerdb TO admin_user;
   \q
   ```

3. **Configure a URL de conexão no backend (`database.py` ou similar):**

   ```python
   DATABASE_URL = "postgresql://admin_user:1234@localhost/registerdb"
   ```

