import request from 'supertest';
import express from 'express';
import { UtilizacaoController } from '../../src/controllers/utilizacao.controller';
import { AutomovelController } from '../../src/controllers/automovel.controller';
import { MotoristaController } from '../../src/controllers/motorista.controller';

const app = express();
app.use(express.json());

const utilizacaoController = new UtilizacaoController();
const automovelController = new AutomovelController();
const motoristaController = new MotoristaController();

app.post('/utilizacoes', (req, res) => utilizacaoController.criar(req, res));
app.get('/utilizacoes', (req, res) => utilizacaoController.listar(req, res));
app.get('/utilizacoes/:id', (req, res) => utilizacaoController.buscarPorId(req, res));
app.patch('/utilizacoes/:id/finalizar', (req, res) => utilizacaoController.finalizar(req, res));

app.post('/automoveis', (req, res) => automovelController.criar(req, res));
app.post('/motoristas', (req, res) => motoristaController.criar(req, res));

describe('UtilizacaoController', () => {
    let automovelId: string;
    let motoristaId: string;

    beforeEach(async () => {
        const automovelResponse = await request(app)
            .post('/automoveis')
            .send({
                placa: 'TEST' + Math.random().toString(36).substr(2, 5),
                cor: 'Azul',
                marca: 'Toyota'
            });
        automovelId = automovelResponse.body.data.id;

        const motoristaResponse = await request(app)
            .post('/motoristas')
            .send({
                nome: 'Motorista Teste ' + Math.random().toString(36).substr(2, 5)
            });
        motoristaId = motoristaResponse.body.data.id;
    });

    describe('POST /utilizacoes', () => {
        it('cria uma utilização com dados válidos', async () => {
            const dadosUtilizacao = {
                motoristaId,
                automovelId,
                motivo: 'Viagem de negócios'
            };

            const response = await request(app)
                .post('/utilizacoes')
                .send(dadosUtilizacao)
                .expect(201);

            expect(response.body).toMatchObject({
                success: true,
                message: 'Utilização iniciada com sucesso'
            });
            expect(response.body.data).toMatchObject({
                motoristaId,
                automovelId,
                motivo: 'Viagem de negócios'
            });
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.dataInicio).toBeDefined();
            expect(response.body.data.dataTermino).toBeNull();
            expect(response.body.data.motorista).toBeDefined();
            expect(response.body.data.automovel).toBeDefined();
        });

        it('falha ao criar utilização com dados inválidos', async () => {
            const dadosInvalidos = {
                motoristaId: 'id-invalido',
                automovelId: '',
                motivo: ''
            };

            const response = await request(app)
                .post('/utilizacoes')
                .send(dadosInvalidos)
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Dados inválidos'
            });
            expect(response.body.details).toBeDefined();
        });

        it('falha ao criar utilização com motorista inexistente', async () => {
            const dadosUtilizacao = {
                motoristaId: '123e4567-e89b-12d3-a456-426614174000',
                automovelId,
                motivo: 'Viagem de negócios'
            };

            const response = await request(app)
                .post('/utilizacoes')
                .send(dadosUtilizacao)
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Motorista não encontrado'
            });
        });

        it('falha ao criar utilização com automóvel inexistente', async () => {
            const dadosUtilizacao = {
                motoristaId,
                automovelId: '123e4567-e89b-12d3-a456-426614174000',
                motivo: 'Viagem de negócios'
            };

            const response = await request(app)
                .post('/utilizacoes')
                .send(dadosUtilizacao)
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Automóvel não encontrado'
            });
        });

        it('falha ao criar utilização com automóvel já em uso', async () => {
            const motoristaResponse2 = await request(app)
                .post('/motoristas')
                .send({ nome: 'Segundo Motorista' });

            const motorista2Id = motoristaResponse2.body.data.id;

            await request(app)
                .post('/utilizacoes')
                .send({
                    motoristaId,
                    automovelId,
                    motivo: 'Primeira viagem'
                })
                .expect(201);

            const response = await request(app)
                .post('/utilizacoes')
                .send({
                    motoristaId: motorista2Id,
                    automovelId,
                    motivo: 'Segunda viagem'
                })
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Este automóvel está em uso'
            });
        });

        it('falha ao criar utilização com motorista já utilizando outro automóvel', async () => {
            const automovelResponse2 = await request(app)
                .post('/automoveis')
                .send({
                    placa: 'SECOND' + Math.random().toString(36).substr(2, 3),
                    cor: 'Vermelho',
                    marca: 'Honda'
                });

            const automovel2Id = automovelResponse2.body.data.id;

            await request(app)
                .post('/utilizacoes')
                .send({
                    motoristaId,
                    automovelId,
                    motivo: 'Primeira viagem'
                })
                .expect(201);

            const response = await request(app)
                .post('/utilizacoes')
                .send({
                    motoristaId,
                    automovelId: automovel2Id,
                    motivo: 'Segunda viagem'
                })
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Este motorista já está utilizando outro automóvel'
            });
        });
    });

    describe('GET /utilizacoes', () => {
        it('lista utilizações', async () => {
            await request(app)
                .post('/utilizacoes')
                .send({
                    motoristaId,
                    automovelId,
                    motivo: 'Viagem 1'
                });

            const response = await request(app)
                .get('/utilizacoes')
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                total: 1
            });
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].motorista).toBeDefined();
            expect(response.body.data[0].automovel).toBeDefined();
        });

        it('retorna lista vazia quando não há utilizações', async () => {
            const response = await request(app)
                .get('/utilizacoes')
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                data: []
            });
        });
    });

    describe('GET /utilizacoes/:id', () => {
        it('busca utilização por ID válido', async () => {
            const createResponse = await request(app)
                .post('/utilizacoes')
                .send({
                    motoristaId,
                    automovelId,
                    motivo: 'Viagem para busca'
                });

            const utilizacaoId = createResponse.body.data.id;

            const response = await request(app)
                .get(`/utilizacoes/${utilizacaoId}`)
                .expect(200);

            expect(response.body).toMatchObject({
                success: true
            });
            expect(response.body.data.id).toBe(utilizacaoId);
            expect(response.body.data.motivo).toBe('Viagem para busca');
            expect(response.body.data.motorista).toBeDefined();
            expect(response.body.data.automovel).toBeDefined();
        });

        it('falha ao buscar utilização inexistente', async () => {
            const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

            const response = await request(app)
                .get(`/utilizacoes/${idInexistente}`)
                .expect(404);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Utilização não encontrada'
            });
        });
    });

    describe('PATCH /utilizacoes/:id/finalizar', () => {
        it('finaliza utilização existente', async () => {
            const createResponse = await request(app)
                .post('/utilizacoes')
                .send({
                    motoristaId,
                    automovelId,
                    motivo: 'Viagem para finalizar'
                });

            const utilizacaoId = createResponse.body.data.id;

            const response = await request(app)
                .patch(`/utilizacoes/${utilizacaoId}/finalizar`)
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                message: 'Utilização finalizada com sucesso'
            });
            expect(response.body.data.dataTermino).toBeDefined();
            expect(response.body.data.dataTermino).not.toBeNull();
        });

        it('falha ao finalizar utilização inexistente', async () => {
            const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

            const response = await request(app)
                .patch(`/utilizacoes/${idInexistente}/finalizar`)
                .expect(404);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Utilização não encontrada'
            });
        });

        it('falha ao finalizar utilização já finalizada', async () => {
            const createResponse = await request(app)
                .post('/utilizacoes')
                .send({
                    motoristaId,
                    automovelId,
                    motivo: 'Viagem já finalizada'
                });

            const utilizacaoId = createResponse.body.data.id;

            await request(app)
                .patch(`/utilizacoes/${utilizacaoId}/finalizar`)
                .expect(200);

            const response = await request(app)
                .patch(`/utilizacoes/${utilizacaoId}/finalizar`)
                .expect(400);

            expect(response.body).toMatchObject({
                success: false,
                error: 'Esta utilização já foi finalizada'
            });
        });

        it('permite nova utilização após finalizar a anterior', async () => {
            const createResponse1 = await request(app)
                .post('/utilizacoes')
                .send({
                    motoristaId,
                    automovelId,
                    motivo: 'Primeira viagem'
                });

            await request(app)
                .patch(`/utilizacoes/${createResponse1.body.data.id}/finalizar`)
                .expect(200);

            const response = await request(app)
                .post('/utilizacoes')
                .send({
                    motoristaId,
                    automovelId,
                    motivo: 'Segunda viagem'
                })
                .expect(201);

            expect(response.body.data.motivo).toBe('Segunda viagem');
        });
    });
});
