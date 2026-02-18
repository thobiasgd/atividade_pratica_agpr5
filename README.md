# 🚚 FastFeet API — Controle de Encomendas

API desenvolvida como solução para o **Desafio 04 – DDD no Node.js e NestJS**.

Este projeto simula o backend de uma transportadora fictícia chamada **FastFeet**, responsável pelo gerenciamento de entregas, destinatários, entregadores e notificações.

---

# 📌 Sobre o Projeto

A aplicação permite:

- Gerenciamento de usuários (`ADMIN` / `DELIVERY`)
- Autenticação com CPF e senha (JWT RS256)
- CRUD de destinatários
- CRUD de encomendas
- Controle completo do fluxo de entrega
- Upload obrigatório de comprovante na entrega
- Listagem de encomendas próximas por bairro
- Sistema de notificações baseado em **Domain Events**

---

# 🧠 Arquitetura

O projeto foi estruturado utilizando:

- **DDD (Domain-Driven Design)**
- **Clean Architecture**
- **Aggregate Roots**
- **Domain Events**
- **RBAC (Role-Based Access Control)**
- **Prisma ORM**
- **NestJS**

## 📂 Estrutura

```
src/
 ├── core/
 │    ├── entities
 │    ├── events
 │    └── either
 │
 ├── domain/
 │    ├── entities
 │    ├── events
 │    ├── repositories
 │    └── use-cases
 │
 ├── infra/
 │    ├── auth
 │    ├── database (Prisma)
 │    └── http (Controllers)
 │
 └── app.module.ts
```

---

# 🔄 Fluxo de Status da Encomenda

```
WAITING
   ↓
ON_THE_WAY
   ↓
DELIVERED
   ↘
 RETURNED
```

Cada alteração de status dispara automaticamente um **Domain Event**:

- `OrderCreatedEvent`
- `OrderAssignedToCarrierEvent`
- `OrderDeliveredEvent`
- `OrderReturnedEvent`

Esses eventos acionam Subscribers responsáveis por criar notificações.

---

# 🔐 Regras de Negócio

- Apenas `ADMIN` pode:
  - Criar encomendas
  - Criar destinatários
  - Criar entregadores
  - Alterar senha de usuários

- Apenas o entregador responsável pode:
  - Marcar entrega como entregue

- Para marcar como entregue:
  - É obrigatório enviar uma foto

- A cada alteração de status:
  - O destinatário é notificado automaticamente

---

# 🚀 Como Rodar o Projeto

## 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/fastfeet-api
cd fastfeet-api
```

---

## 2️⃣ Instalar dependências

```bash
npm install
```

---

## 3️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fastfeet"
JWT_PRIVATE_KEY="SUA_CHAVE_PRIVADA_BASE64"
JWT_PUBLIC_KEY="SUA_CHAVE_PUBLICA_BASE64"
PORT=3333
```

---

## 4️⃣ Executar migrations

```bash
npx prisma migrate dev
```

---

## 5️⃣ Iniciar servidor

```bash
npm run start:dev
```

Servidor disponível em:

```
http://localhost:3333
```

---

# 📡 API Reference

Base URL:

```
http://localhost:3333
```

---

# 🔐 Autenticação

---

## ➤ Criar Usuário

**Endpoint**

```
POST /users
```

**Autenticação**

```
Bearer Token (ADMIN)
```

**Headers**

```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**

```json
{
  "name": "Nome do Usuário",
  "cpf": "111.111.111.11",
  "password": "123456",
  "type": "ADMIN"
}
```

**Regras**

- Apenas ADMIN pode criar usuários.

---

## ➤ Login

**Endpoint**

```
POST /sessions
```

**Autenticação**

```
Não requer
```

**Headers**

```
Content-Type: application/json
```

**Body**

```json
{
  "cpf": "111.111.111.11",
  "password": "123456"
}
```

**Response**

```json
{
  "access_token": "JWT_TOKEN"
}
```

---

# 👤 Destinatários

---

## ➤ Criar Destinatário

**Endpoint**

```
POST /recipients
```

**Autenticação**

```
Bearer Token (ADMIN)
```

**Headers**

```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**

```json
{
  "name": "Fulano",
  "cpf": "555.555.555.55"
}
```

---

## ➤ Cadastrar Endereço

**Endpoint**

```
POST /recipients/:recipientId/addresses
```

**Autenticação**

```
Bearer Token (ADMIN)
```

**Path Params**

| Nome        | Tipo | Descrição          |
| ----------- | ---- | ------------------ |
| recipientId | UUID | ID do destinatário |

**Headers**

```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**

```json
{
  "country": "Brasil",
  "state": "Santa Catarina",
  "city": "Ararangua",
  "neighborhood": "Mato Alto",
  "street": "Rua X",
  "number": 222
}
```

---

# 📦 Encomendas

---

## ➤ Criar Encomenda

**Endpoint**

```
POST /orders
```

**Autenticação**

```
Bearer Token (ADMIN)
```

**Headers**

```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**

```json
{
  "description": "Entrega de documento",
  "recipientId": "UUID",
  "addressId": "UUID"
}
```

---

## ➤ Atribuir Entregador

**Endpoint**

```
PATCH /orders/:orderId/asign-carrier
```

**Autenticação**

```
Bearer Token (ADMIN)
```

**Path Params**

| Nome    | Tipo | Descrição       |
| ------- | ---- | --------------- |
| orderId | UUID | ID da encomenda |

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```
Não possui body
```

**Regras**

- Status alterado para `ON_THE_WAY`.

---

## ➤ Marcar como Entregue

**Endpoint**

```
PATCH /orders/:orderId/deliver
```

**Autenticação**

```
Bearer Token (DELIVERY)
```

**Path Params**

| Nome    | Tipo | Descrição       |
| ------- | ---- | --------------- |
| orderId | UUID | ID da encomenda |

**Headers**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data**

| Campo       | Tipo       | Obrigatório | Descrição       |
| ----------- | ---------- | ----------- | --------------- |
| file        | Arquivo    | ✅ Sim      | Foto da entrega |
| deliveredAt | ISO String | ✅ Sim      | Data da entrega |

**Regras**

- Apenas o entregador responsável pode executar.
- Upload obrigatório.
- Status alterado para `DELIVERED`.

---

## ➤ Marcar como Devolvida

**Endpoint**

```
PATCH /orders/:orderId/return
```

**Autenticação**

```
Bearer Token (ADMIN)
```

**Path Params**

| Nome    | Tipo | Descrição       |
| ------- | ---- | --------------- |
| orderId | UUID | ID da encomenda |

**Headers**

```
Authorization: Bearer {token}
```

**Body**

```
Não possui body
```

**Regras**

- Status alterado para `RETURNED`.

---

## ➤ Buscar Encomendas Próximas

**Endpoint**

```
GET /nearOrders
```

**Autenticação**

```
Bearer Token (DELIVERY)
```

**Query Params**

| Nome         | Tipo   | Descrição          |
| ------------ | ------ | ------------------ |
| neighborhood | string | Bairro para filtro |

**Headers**

```
Authorization: Bearer {token}
```

---

## ➤ Listar Encomendas do Usuário

**Endpoint**

```
GET /orders
```

**Autenticação**

```
Bearer Token
```

**Headers**

```
Authorization: Bearer {token}
```

---

# 🔔 Notificações

---

## ➤ Marcar Notificação como Lida

**Endpoint**

```
PATCH /notifications/:notificationId/read
```

**Autenticação**

```
Não requer (validação via CPF no body)
```

**Path Params**

| Nome           | Tipo | Descrição         |
| -------------- | ---- | ----------------- |
| notificationId | UUID | ID da notificação |

**Headers**

```
Content-Type: application/json
```

**Body**

```json
{
  "userCpf": "111.111.111.11"
}
```

---

# 🛠 Tecnologias Utilizadas

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (RS256)
- Zod
- Clean Architecture
- Domain Events

---

# 🎯 Objetivo Técnico

Este projeto demonstra:

- Modelagem orientada ao domínio
- Separação clara de responsabilidades
- Implementação de Domain Events
- Controle de estados consistente
- Autenticação e autorização com RBAC
- Upload de arquivos com validação
- Integração com banco relacional

---

# 👨‍💻 Autor

**Thobias Gonçalves Dordete**

Backend Developer
