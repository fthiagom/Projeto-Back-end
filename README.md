# E-commerce API (Node.js, Express, Sequelize & JWT)

API REST desenvolvida em **Node.js** e **Express** com persistência em **MySQL** via **Sequelize**, autenticação com **JWT**, hash de senhas com **bcrypt** e testes automatizados com **Jest** e **Supertest**[cite: 1, 7].

## Tecnologias utilizadas

* **Runtime / Framework:** Node.js, Express[cite: 1]
* **Banco de dados e ORM:** MySQL, Sequelize (`mysql2`)[cite: 1, 2]
* **Autenticação e segurança:** `jsonwebtoken`, `bcrypt`, `dotenv`, `cors`[cite: 1, 7, 8, 10]
* **Testes:** Jest, Supertest[cite: 1]

## Estrutura do projeto

```text
├── src/
│   ├── config/         # Configuração de conexão com o banco (Sequelize)[cite: 2]
│   ├── controllers/    # Camada HTTP (request / response)[cite: 9]
│   ├── models/         # Models e associações do Sequelize[cite: 2]
│   ├── routes/         # Definição das rotas da API[cite: 8]
│   ├── services/       # Regras de negócio e acesso aos models[cite: 10]
│   ├── app.js          # Instância e middlewares do Express[cite: 8]
│   └── server.js       # Inicialização do servidor HTTP[cite: 1]
├── tests/              # Suítes de teste com Jest e Supertest[cite: 1]
├── .env.example        # Exemplo de variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git[cite: 11]
└── package.json        # Scripts e dependências do projeto[cite: 1]
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nome_do_banco
DB_USER=seu_usuario
DB_PASS=sua_senha
JWT_SECRET=sua_chave_secreta
```

## Como instalar e rodar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Certifique-se de que o MySQL esteja rodando** e que o banco definido em `DB_NAME` exista.

3. **Inicie o servidor da API:**
   ```bash
   npm run server
   ```
   *(Ou `npm start` para rodar com `node src/server.js`.)*

## Executando os testes

Para rodar a suíte de testes automatizados com Jest:

```bash
npm test
```

## Endpoints principais

* **Health check:** `GET /health`[cite: 8]
* **Usuários e Auth:** `/v1/user`, `/v1/user/token`, `/v1/user/:id`[cite: 9]
* **Categorias:** `/v1/category`, `/v1/category/search`, `/v1/category/:id`
* **Produtos:** `/v1/product`, `/v1/product/search`, `/v1/product/:id`

**Autores**
Francisco Thiago Martins 
Davidson Luiz Martins
Manoel Denison Martins