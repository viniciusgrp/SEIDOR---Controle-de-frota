import request from 'supertest';
import express from 'express';
import { AutomovelController } from '../../src/controllers/automovel.controller';

const app = express();
app.use(express.json());

const automovelController = new AutomovelController();

app.post('/automoveis', (req, res) => automovelController.criar(req, res));
app.get('/automoveis', (req, res) => automovelController.listar(req, res));
app.get('/automoveis/:id', (req, res) => automovelController.buscarPorId(req, res));
app.put('/automoveis/:id', (req, res) => automovelController.atualizar(req, res));
app.delete('/automoveis/:id', (req, res) => automovelController.excluir(req, res));

describe('AutomovelController', () => {
    describe('POST /automoveis', () => {
        it('cria um automóvel', async () => {
            const dadosAutomovel = {
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            };

            const response = await request(app)
                .post('/automoveis')
                .send(dadosAutomovel)
                .expect(201);

            expect(response.body).toMatchObject({
                success: true,
                message: 'Automóvel cadastrado com sucesso'
            });
            expect(response.body.data).toMatchObject(dadosAutomovel);
            expect(response.body.data.id).toBeDefined();
        });


        it('falha ao criar automóvel com placa duplicada', async () => {
            const dadosAutomovel = {
                placa: 'XYZ9876',
                cor: 'Vermelho',
                marca: 'Honda'
            };

            await request(app)
                .post('/automoveis')
                .send(dadosAutomovel)
                .expect(201);

            const response = await request(app)
                .post('/automoveis')
                .send(dadosAutomovel)
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Já existe um automóvel cadastrado com esta placa'
            });
        });
    });

    describe('GET /automoveis', () => {
        it('lista automóveis sem filtros', async () => {
            await request(app)
                .post('/automoveis')
                .send({ placa: 'TEST001', cor: 'Azul', marca: 'Toyota' });

            await request(app)
                .post('/automoveis')
                .send({ placa: 'TEST002', cor: 'Vermelho', marca: 'Honda' });

            const response = await request(app)
                .get('/automoveis')
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                total: 2
            });
            expect(response.body.data).toHaveLength(2);
        });

        it('filtra automóveis por cor', async () => {
            const response = await request(app)
                .get('/automoveis?cor=Azul')
                .expect(200);

            expect(response.body.success).toBe(true);
            if (response.body.data.length > 0) {
                response.body.data.forEach((automovel: any) => {
                    expect(automovel.cor).toBe('Azul');
                });
            }
        });

        it('filtra automóveis por marca', async () => {
            const response = await request(app)
                .get('/automoveis?marca=Toyota')
                .expect(200);

            expect(response.body.success).toBe(true);
            if (response.body.data.length > 0) {
                response.body.data.forEach((automovel: any) => {
                    expect(automovel.marca).toBe('Toyota');
                });
            }
        });
    });

    describe('GET /automoveis/:id', () => {
        it('busca automóvel por ID válido', async () => {
            const createResponse = await request(app)
                .post('/automoveis')
                .send({ placa: 'SEARCH01', cor: 'Verde', marca: 'Ford' });

            const automovelId = createResponse.body.data.id;

            const response = await request(app)
                .get(`/automoveis/${automovelId}`)
                .expect(200);

            expect(response.body).toMatchObject({
                success: true
            });
            expect(response.body.data.id).toBe(automovelId);
            expect(response.body.data.placa).toBe('SEARCH01');
        });

        it('falha ao buscar automóvel com ID inexistente', async () => {
            const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

            const response = await request(app)
                .get(`/automoveis/${idInexistente}`)
                .expect(404);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Automóvel não encontrado'
            });
        });

        it('falha ao buscar automóvel com ID inválido', async () => {
            const idInvalido = 'id-invalido';

            const response = await request(app)
                .get(`/automoveis/${idInvalido}`)
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /automoveis/:id', () => {
        it('atualiza automóvel com dados válidos', async () => {
            const createResponse = await request(app)
                .post('/automoveis')
                .send({ placa: 'UPDATE01', cor: 'Azul', marca: 'Toyota' });

            const automovelId = createResponse.body.data.id;

            const dadosAtualizacao = {
                cor: 'Vermelho',
                marca: 'Honda'
            };

            const response = await request(app)
                .put(`/automoveis/${automovelId}`)
                .send(dadosAtualizacao)
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                message: 'Automóvel atualizado com sucesso'
            });
            expect(response.body.data.cor).toBe('Vermelho');
            expect(response.body.data.marca).toBe('Honda');
            expect(response.body.data.placa).toBe('UPDATE01');
        });

        it('falha ao atualizar automóvel inexistente', async () => {
            const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

            const response = await request(app)
                .put(`/automoveis/${idInexistente}`)
                .send({ cor: 'Preto' })
                .expect(404);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Automóvel não encontrado'
            });
        });
    });

    describe('DELETE /automoveis/:id', () => {
        it('exclui automóvel existente', async () => {
            const createResponse = await request(app)
                .post('/automoveis')
                .send({ placa: 'DELETE01', cor: 'Azul', marca: 'Toyota' });

            const automovelId = createResponse.body.data.id;

            const response = await request(app)
                .delete(`/automoveis/${automovelId}`)
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                message: 'Automóvel excluído com sucesso'
            });

            await request(app)
                .get(`/automoveis/${automovelId}`)
                .expect(404);
        });

        it('falha ao excluir automóvel inexistente', async () => {
            const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

            const response = await request(app)
                .delete(`/automoveis/${idInexistente}`)
                .expect(404);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Automóvel não encontrado'
            });
        });
    });
});
