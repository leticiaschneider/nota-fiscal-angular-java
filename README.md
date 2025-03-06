# 📜 Nota Fiscal - API e Frontend

Este projeto consiste em uma aplicação de gestão de notas fiscais, contendo um **backend** desenvolvido em **Java com Quarkus** e um **frontend** desenvolvido em **Angular**.

<br>

## 📌 Tecnologias Utilizadas

### 🔹 Backend:
- **Java** (versão 23.0.2)
- **Maven** (versão 3.9.9)
- **PostgreSQL** (Banco de Dados)

### 🔹 Frontend:
- **Angular** (versão 19.0.2)
- **Node.js** (versão 22.11.0)
- **NPM** (versão 10.9.0)

<br>

## 🚀 Como Rodar o Projeto

#### 🔹 **Banco de Dados**

Antes de iniciar o backend, configure o banco de dados PostgreSQL. Crie um banco de dados e atualize as configurações no arquivo `application.properties`.

#### Exemplo de configuração (`src/main/resources/application.properties`):
```properties
quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=SEU_USUARIO
quarkus.datasource.password=SUA_SENHA
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/SEU_BANCO
```

<br>

#### 🔹 **Rodando o Backend**

1. Acesse a pasta do backend:
   ```sh
   cd nota-fiscal-api
   ```
2. Instale as dependências do projeto:
   ```sh
   mvn clean install
   ```
3. Inicie a aplicação:
   ```sh
   mvn quarkus:dev
   ```
4. A API estará disponível em: `http://localhost:8080`
5. Para acessar a interface do Swagger `http://localhost:8080/q/swagger-ui`

<br>

#### 🔹 **Rodando o Frontend**

1. Acesse a pasta do frontend:
   ```sh
   cd fiscal-front-app
   ```
2. Instale as dependências:
   ```sh
   npm install  # ou yarn install
   ```
3. Inicie o servidor de desenvolvimento:
   ```sh
   ng serve
   ```
4. A aplicação estará disponível em: `http://localhost:4200`

<br>

## ✨ Contact
Letícia Araújo Schneider - leticia.schneider@gmail.com

