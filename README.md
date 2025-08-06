# SEIDOR - Sistema de Controle de Frota

Sistema web para controlar a utilização dos automóveis de uma empresa, desenvolvido com Node.js, Express, TypeScript e Prisma.

## 🚀 Funcionalidades

### Automóveis
- ✅ Cadastrar novo automóvel
- ✅ Atualizar automóvel cadastrado
- ✅ Excluir automóvel cadastrado
- ✅ Recuperar automóvel por ID
- ✅ Listar automóveis com filtros por cor e marca

### Motoristas
- ✅ Cadastrar novo motorista
- ✅ Atualizar motorista cadastrado
- ✅ Excluir motorista cadastrado
- ✅ Recuperar motorista por ID
- ✅ Listar motoristas com filtro por nome

### Utilizações
- ✅ Criar registro de utilização de automóvel
- ✅ Finalizar utilização de automóvel
- ✅ Listar registros de utilização com dados completos

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset do JavaScript
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Yup** - Validação de dados
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/viniciusgrp/SEIDOR---Controle-de-frota.git
cd SEIDOR---Controle-de-frota
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npm run db:migrate
```

4. Gere o cliente Prisma:
```bash
npm run db:generate
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📡 API Endpoints

### Health Check
- `GET /health` - Verificar status da API

### Automóveis
- `POST /api/automoveis` - Criar automóvel
- `GET /api/automoveis` - Listar automóveis
- `GET /api/automoveis?cor=Azul` - Filtrar por cor
- `GET /api/automoveis?marca=Toyota` - Filtrar por marca
- `GET /api/automoveis/:id` - Buscar por ID
- `PUT /api/automoveis/:id` - Atualizar automóvel
- `DELETE /api/automoveis/:id` - Excluir automóvel

### Motoristas
- `POST /api/motoristas` - Criar motorista
- `GET /api/motoristas` - Listar motoristas
- `GET /api/motoristas?nome=João` - Filtrar por nome
- `GET /api/motoristas/:id` - Buscar por ID
- `PUT /api/motoristas/:id` - Atualizar motorista
- `DELETE /api/motoristas/:id` - Excluir motorista

### Utilizações
- `POST /api/utilizacoes` - Iniciar utilização
- `GET /api/utilizacoes` - Listar utilizações
- `GET /api/utilizacoes/:id` - Buscar por ID
- `PATCH /api/utilizacoes/:id/finalizar` - Finalizar utilização

## 📝 Regras de Negócio

1. **Automóvel**: Só pode ser utilizado por um motorista por vez
2. **Motorista**: Não pode utilizar mais de um automóvel simultaneamente
3. **Placa**: Deve ser única no sistema
4. **Exclusão**: Não é possível excluir automóvel ou motorista em uso

## 🧪 Executando Testes

### Configuração Inicial
Antes de executar os testes pela primeira vez, configure o ambiente:
```bash
npm run test:setup
```

### Executando Testes
```bash
# Executar todos os testes
npm test

# Executar apenas testes de serviços
npm run test:services

# Executar apenas testes de controllers
npm run test:controllers

# Executar testes em modo watch (reexecuta quando há mudanças)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

### Estrutura dos Testes
Os testes estão organizados em:
- `tests/services/` - Testes unitários dos serviços
  - `automovel.service.test.ts` - Testes CRUD de automóveis
  - `motorista.service.test.ts` - Testes CRUD de motoristas
  - `utilizacao.service.test.ts` - Testes de regras de negócio
- `tests/controllers/` - Testes de integração dos controllers
  - `automovel.controller.test.ts` - Testes de API para automóveis
  - `motorista.controller.test.ts` - Testes de API para motoristas
  - `utilizacao.controller.test.ts` - Testes de API para utilizações

### O que é Testado
- ✅ Operações CRUD completas
- ✅ Validações de dados (Yup schemas)
- ✅ Regras de negócio (automóvel único por motorista)
- ✅ Tratamento de erros
- ✅ Relacionamentos entre entidades
- ✅ Endpoints da API (HTTP status codes)
- ✅ Respostas JSON padronizadas
- ✅ Filtros e parâmetros de consulta

## 🧪 Testando com Postman

### Importar Collection
1. Abra o Postman
2. Clique em "Import"
3. Selecione o arquivo `SEIDOR-Controle-de-Frota.postman_collection.json`
4. Importe também o environment `SEIDOR-Controle-de-Frota.postman_environment.json`

### Fluxo de Teste Recomendado
1. **Health Check** - Verificar se a API está rodando
2. **Criar Automóvel** - Cadastrar um automóvel
3. **Criar Motorista** - Cadastrar um motorista
4. **Iniciar Utilização** - Vincular motorista ao automóvel
5. **Listar Utilizações** - Ver dados completos
6. **Finalizar Utilização** - Encerrar o uso

### Variáveis do Environment
- `baseUrl`: http://localhost:3000/api
- `automovelId`: ID do automóvel (copie das respostas)
- `motoristaId`: ID do motorista (copie das respostas)
- `utilizacaoId`: ID da utilização (copie das respostas)

## 📊 Estrutura do Banco

### Automóvel
```typescript
{
  id: string
  placa: string (único)
  cor: string
  marca: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Motorista
```typescript
{
  id: string
  nome: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Utilização
```typescript
{
  id: string
  dataInicio: DateTime
  dataTermino: DateTime?
  motivo: string
  motoristaId: string
  automovelId: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🎯 Scripts Disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Executar em produção
- `npm run db:generate` - Gerar cliente Prisma
- `npm run db:migrate` - Executar migrações
- `npm run db:studio` - Abrir Prisma Studio
- `npm run test:setup` - Configurar ambiente de testes
- `npm test` - Executar testes unitários
- `npm run test:services` - Executar apenas testes de serviços
- `npm run test:controllers` - Executar apenas testes de controllers
- `npm run test:watch` - Executar testes em modo watch
- `npm run test:coverage` - Executar testes com cobertura

## ⚠️ Importante para Desenvolvedores

### Primeira Execução
Após clonar o repositório, sempre execute:
```bash
npm install
npm run db:migrate
npm run test:setup
```

### Executando Testes
Os testes usam o mesmo banco de dados SQLite do desenvolvimento, mas limpam os dados antes de cada teste. O comando `npm run test:setup` é executado automaticamente antes dos testes para garantir que o banco esteja configurado corretamente.