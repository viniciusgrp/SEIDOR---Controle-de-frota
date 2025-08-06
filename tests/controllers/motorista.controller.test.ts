import request from 'supertest';
import express from 'express';
import { MotoristaController } from '../../src/controllers/motorista.controller';

const app = express();
app.use(express.json());

const motoristaController = new MotoristaController();

app.post('/motoristas', (req, res) => motoristaController.criar(req, res));
app.get('/motoristas', (req, res) => motoristaController.listar(req, res));
app.get('/motoristas/:id', (req, res) => motoristaController.buscarPorId(req, res));
app.put('/motoristas/:id', (req, res) => motoristaController.atualizar(req, res));
app.delete('/motoristas/:id', (req, res) => motoristaController.excluir(req, res));

describe('MotoristaController', () => {
    describe('POST /motoristas', () => {
        it('cria um motorista com dados válidos', async () => {
            const dadosMotorista = {
                nome: 'João Silva Santos'
            };

            const response = await request(app)
                .post('/motoristas')
                .send(dadosMotorista)
                .expect(201);

            expect(response.body).toMatchObject({
                success: true,
                message: 'Motorista cadastrado com sucesso'
            });
            expect(response.body.data).toMatchObject(dadosMotorista);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.createdAt).toBeDefined();
        });

        it('falha ao criar motorista com nome muito curto', async () => {
            const dadosInvalidos = {
                nome: ''
            };

            const response = await request(app)
                .post('/motoristas')
                .send(dadosInvalidos)
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Dados inválidos'
            });
            expect(response.body.details).toBeDefined();
        });

        it('falha ao criar motorista sem nome', async () => {
            const dadosInvalidos = {};

            const response = await request(app)
                .post('/motoristas')
                .send(dadosInvalidos)
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Dados inválidos'
            });
        });

        it('falha ao criar motorista com nome vazio', async () => {
            const dadosInvalidos = {
                nome: ''
            };

            const response = await request(app)
                .post('/motoristas')
                .send(dadosInvalidos)
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Dados inválidos'
            });
        });
    });

    describe('GET /motoristas', () => {
        it('lista motoristas sem filtros', async () => {
            await request(app)
                .post('/motoristas')
                .send({ nome: 'Maria Silva' });

            await request(app)
                .post('/motoristas')
                .send({ nome: 'Pedro Santos' });

            const response = await request(app)
                .get('/motoristas')
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                total: 2
            });
            expect(response.body.data).toHaveLength(2);
        });

        it('filtra motoristas por nome', async () => {
            await request(app)
                .post('/motoristas')
                .send({ nome: 'Carlos Alberto' });

            const response = await request(app)
                .get('/motoristas?nome=Carlos')
                .expect(200);

            expect(response.body.success).toBe(true);
            if (response.body.data.length > 0) {
                response.body.data.forEach((motorista: any) => {
                    expect(motorista.nome.toLowerCase()).toContain('carlos');
                });
            }
        });

        it('retorna lista vazia quando não há motoristas com o filtro', async () => {
            const response = await request(app)
                .get('/motoristas?nome=NomeInexistente')
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                data: []
            });
        });
    });

    describe('GET /motoristas/:id', () => {
        it('busca motorista por ID válido', async () => {
            const createResponse = await request(app)
                .post('/motoristas')
                .send({ nome: 'Ana Paula Costa' });

            const motoristaId = createResponse.body.data.id;

            const response = await request(app)
                .get(`/motoristas/${motoristaId}`)
                .expect(200);

            expect(response.body).toMatchObject({
                success: true
            });
            expect(response.body.data.id).toBe(motoristaId);
            expect(response.body.data.nome).toBe('Ana Paula Costa');
        });

        it('falha ao buscar motorista com ID inexistente', async () => {
            const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

            const response = await request(app)
                .get(`/motoristas/${idInexistente}`)
                .expect(404);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Motorista não encontrado'
            });
        });

        it('falha ao buscar motorista com ID inválido', async () => {
            const idInvalido = 'id-invalido';

            const response = await request(app)
                .get(`/motoristas/${idInvalido}`)
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /motoristas/:id', () => {
        it('atualiza motorista com dados válidos', async () => {
            const createResponse = await request(app)
                .post('/motoristas')
                .send({ nome: 'Roberto Silva' });

            const motoristaId = createResponse.body.data.id;

            const dadosAtualizacao = {
                nome: 'Roberto Silva Santos'
            };

            const response = await request(app)
                .put(`/motoristas/${motoristaId}`)
                .send(dadosAtualizacao)
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                message: 'Motorista atualizado com sucesso'
            });
            expect(response.body.data.nome).toBe('Roberto Silva Santos');
            expect(response.body.data.id).toBe(motoristaId);
        });

        it('falha ao atualizar motorista inexistente', async () => {
            const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

            const response = await request(app)
                .put(`/motoristas/${idInexistente}`)
                .send({ nome: 'Nome Atualizado' })
                .expect(404);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Motorista não encontrado'
            });
        });

        it('atualiza motorista mantendo dados quando campos são omitidos', async () => {
            const createResponse = await request(app)
                .post('/motoristas')
                .send({ nome: 'Nome Original' });

            const motoristaId = createResponse.body.data.id;

            const response = await request(app)
                .put(`/motoristas/${motoristaId}`)
                .send({})
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                message: 'Motorista atualizado com sucesso'
            });
            expect(response.body.data.nome).toBe('Nome Original');
        });
    });

    describe('DELETE /motoristas/:id', () => {
        it('exclui motorista existente que não está em uso', async () => {
            const createResponse = await request(app)
                .post('/motoristas')
                .send({ nome: 'Motorista Para Exclusão' });

            const motoristaId = createResponse.body.data.id;

            const response = await request(app)
                .delete(`/motoristas/${motoristaId}`)
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                message: 'Motorista excluído com sucesso'
            });

            await request(app)
                .get(`/motoristas/${motoristaId}`)
                .expect(404);
        });

        it('falha ao excluir motorista inexistente', async () => {
            const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

            const response = await request(app)
                .delete(`/motoristas/${idInexistente}`)
                .expect(404);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Motorista não encontrado'
            });
        });
    });
});
