# 📱 GQuiz

**GQuiz** é uma plataforma de quiz sobre a Gincana da UTFPR, com modos
singleplayer, fases, mundos temáticos e partidas multiplayer em tempo
real.

🔗 **Acesse o projeto online:**
👉 https://g-quizz.vercel.app/

------------------------------------------------------------------------

# 🚀 Funcionalidades Principais

### 🗺️ 1. Sistema de Mundos e Fases

Explore diferentes áreas do conhecimento e avance por fases com
dificuldade progressiva.

### 🎲 2. Quiz Aleatório

Gere quizzes totalmente aleatórios escolhendo: - Número de perguntas
- Categoria
- Tempo por pergunta
- Quick Time Events

### 👥 3. Multiplayer em Salas

Crie ou entre em salas privadas ou públicas para jogar quizzes
competitivos em tempo real.

### ⚡ Quick Time Events (QTE)

Eventos surpresa entre perguntas que exigem reação rápida --- errar faz
perder pontos.

------------------------------------------------------------------------

# ⚙️ Como Executar Localmente

## 🧩 Pré-requisitos

-   Node.js (18+)
-   Git
-   Editor de código (VS Code recomendado)

------------------------------------------------------------------------

## 📥 Clone o Repositório

``` bash
git clone https://github.com/D4fto/GQuiz.git
```

------------------------------------------------------------------------

## 📦 Instale as Dependências

### Backend

``` bash
cd backend
npm i
```

### Frontend

``` bash
cd frontend
npm i
```

------------------------------------------------------------------------

## 🗄️ Configure o Banco de Dados

Use o arquivo [`estrutura.sql`](estrutura.sql) incluído no repositório.\
O esquema ficará semelhante à imagem fornecida.
![alt text](supabase-schema-ahoxlzbzbwegjiivmpuz.svg)

------------------------------------------------------------------------

## 🔐 Configurar Variáveis de Ambiente

Renomeie `.env.example` para `.env`.

### Frontend

``` env
VITE_API_URL=http://localhost:3000
VITE_URL=http://localhost:5173
```

### Backend

``` env
DATABASE_URL=[SUA_DATABASE_URL]

FRONT_URL=http://localhost:5173
PORT=3000

JWT_SECRET=[SUA_SECRET_KEY]
```

------------------------------------------------------------------------

## 🗃️ Gerar o Prisma

``` bash
cd backend
npx prisma generate
```

------------------------------------------------------------------------

## ▶️ Executar a Aplicação

### Backend

``` bash
cd backend
node app.js
```

### Frontend

``` bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

---

## 🌟 Funcionalidade Inédita e adicionais

Implementamos uma funcionalidade inédita e duas adicionais:

### ⌛ Quick time events (Inédita)

Adicionamos eventos aleatórios entre as perguntas, onde caso não seja respondido corretament o mais rápido possível o jogardo perderá pontos

### 🔍 Multiplayer com salas

Pode-se criar salas multiplayer com perguntas aleatórias, podendo ser salas privadas ou públicas

### Quiz aleatório

Pode-se jogar um quiz aleatório onde é escolhido um número determinado de questões de nosso banco com mais de 100 questões


------------------------------------------------------------------------

# 🧠 Tecnologias Utilizadas

### Frontend

-   React.js
-   CSS Modules

### Backend

-   Node.js
-   Prisma ORM
-   Socket.io

### Infra

-   Vercel
-   AWS

------------------------------------------------------------------------

# 👨‍💻 Autores


Projeto desenvolvido por:  
- [@D4fto](https://github.com/D4fto)  
- [@echeliga](https://github.com/echeliga)
- [@marceloAst](https://github.com/marceloAst)

---

