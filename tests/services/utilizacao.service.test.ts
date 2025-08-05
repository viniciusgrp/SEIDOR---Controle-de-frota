import { UtilizacaoService } from '../../src/services/utilizacao.service';
import { AutomovelService } from '../../src/services/automovel.service';
import { MotoristaService } from '../../src/services/motorista.service';
import { prisma } from '../../src/database';

describe('UtilizacaoService', () => {
    let utilizacaoService: UtilizacaoService;
    let automovelService: AutomovelService;
    let motoristaService: MotoristaService;

    beforeEach(() => {
        utilizacaoService = new UtilizacaoService();
        automovelService = new AutomovelService();
        motoristaService = new MotoristaService();
    });

    describe('criar', () => {
        it('cria uma utilização', async () => {
            const automovel = await automovelService.criar({
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            });

            const motorista = await motoristaService.criar({
                nome: 'João Silva'
            });

            const dadosUtilizacao = {
                motoristaId: motorista.id,
                automovelId: automovel.id,
                motivo: 'Viagem de negócios'
            };

            const resultado = await utilizacaoService.criar(dadosUtilizacao);

            expect(resultado).toMatchObject({
                motoristaId: motorista.id,
                automovelId: automovel.id,
                motivo: 'Viagem de negócios'
            });
            expect(resultado.id).toBeDefined();
            expect(resultado.dataInicio).toBeDefined();
            expect(resultado.dataTermino).toBeNull();
            expect(resultado.motorista).toMatchObject({ nome: 'João Silva' });
            expect(resultado.automovel).toMatchObject({ placa: 'ABC1234' });
        });

        it('falha ao criar utilização com motorista inexistente', async () => {
            const automovel = await automovelService.criar({
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            });

            const dadosUtilizacao = {
                motoristaId: '123e4567-e89b-12d3-a456-426614174000',
                automovelId: automovel.id,
                motivo: 'Viagem de negócios'
            };

            await expect(utilizacaoService.criar(dadosUtilizacao))
                .rejects
                .toThrow('Motorista não encontrado');
        });

        it('falha ao criar utilização com automóvel inexistente', async () => {
            const motorista = await motoristaService.criar({
                nome: 'João Silva'
            });

            const dadosUtilizacao = {
                motoristaId: motorista.id,
                automovelId: '123e4567-e89b-12d3-a456-426614174000',
                motivo: 'Viagem de negócios'
            };

            await expect(utilizacaoService.criar(dadosUtilizacao))
                .rejects
                .toThrow('Automóvel não encontrado');
        });

        it('falha ao criar utilização com automóvel já em uso', async () => {
            const automovel = await automovelService.criar({
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            });

            const motorista1 = await motoristaService.criar({
                nome: 'João Silva'
            });

            const motorista2 = await motoristaService.criar({
                nome: 'Maria Santos'
            });

            await utilizacaoService.criar({
                motoristaId: motorista1.id,
                automovelId: automovel.id,
                motivo: 'Viagem de negócios'
            });

            await expect(utilizacaoService.criar({
                motoristaId: motorista2.id,
                automovelId: automovel.id,
                motivo: 'Outra viagem'
            }))
                .rejects
                .toThrow('Este automóvel está em uso');
        });

        it('falha ao criar utilização com motorista já utilizando outro automóvel', async () => {
            const automovel1 = await automovelService.criar({
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            });

            const automovel2 = await automovelService.criar({
                placa: 'DEF5678',
                cor: 'Vermelho',
                marca: 'Honda'
            });

            const motorista = await motoristaService.criar({
                nome: 'João Silva'
            });

            await utilizacaoService.criar({
                motoristaId: motorista.id,
                automovelId: automovel1.id,
                motivo: 'Viagem de negócios'
            });

            await expect(utilizacaoService.criar({
                motoristaId: motorista.id,
                automovelId: automovel2.id,
                motivo: 'Outra viagem'
            }))
                .rejects
                .toThrow('Este motorista já está utilizando outro automóvel');
        });

        it('permite criar utilização após finalizar a anterior', async () => {
            const automovel = await automovelService.criar({
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            });

            const motorista1 = await motoristaService.criar({
                nome: 'João Silva'
            });

            const motorista2 = await motoristaService.criar({
                nome: 'Maria Santos'
            });

            const utilizacao1 = await utilizacaoService.criar({
                motoristaId: motorista1.id,
                automovelId: automovel.id,
                motivo: 'Viagem de negócios'
            });

            // Garantir que a finalização seja completada
            const utilizacaoFinalizada = await utilizacaoService.finalizar(utilizacao1.id);
            expect(utilizacaoFinalizada.dataTermino).not.toBeNull();

            // Pequena pausa para garantir que a transação seja completada
            await new Promise(resolve => setTimeout(resolve, 50));

            const utilizacao2 = await utilizacaoService.criar({
                motoristaId: motorista2.id,
                automovelId: automovel.id,
                motivo: 'Outra viagem'
            });

            expect(utilizacao2.motoristaId).toBe(motorista2.id);
            expect(utilizacao2.automovelId).toBe(automovel.id);
        });
    });

    describe('finalizar', () => {
        it('finaliza uma utilização', async () => {
            const automovel = await automovelService.criar({
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            });

            const motorista = await motoristaService.criar({
                nome: 'João Silva'
            });

            const utilizacao = await utilizacaoService.criar({
                motoristaId: motorista.id,
                automovelId: automovel.id,
                motivo: 'Viagem de negócios'
            });

            const resultado = await utilizacaoService.finalizar(utilizacao.id);

            expect(resultado.dataTermino).toBeDefined();
            expect(resultado.dataTermino).not.toBeNull();
            expect(new Date(resultado.dataTermino!).getTime()).toBeGreaterThan(
                new Date(resultado.dataInicio).getTime()
            );
        });

        it('falha ao finalizar utilização inexistente', async () => {
            const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

            await expect(utilizacaoService.finalizar(idInexistente))
                .rejects
                .toThrow('Utilização não encontrada');
        });

        it('falha ao finalizar utilização já finalizada', async () => {
            const automovel = await automovelService.criar({
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            });

            const motorista = await motoristaService.criar({
                nome: 'João Silva'
            });

            const utilizacao = await utilizacaoService.criar({
                motoristaId: motorista.id,
                automovelId: automovel.id,
                motivo: 'Viagem de negócios'
            });

            await utilizacaoService.finalizar(utilizacao.id);

            await expect(utilizacaoService.finalizar(utilizacao.id))
                .rejects
                .toThrow('Esta utilização já foi finalizada');
        });
    });

    describe('listar', () => {
        it('retorna lista vazia quando não há utilizações', async () => {
            const resultado = await utilizacaoService.listar();
            expect(resultado).toEqual([]);
        });

        it('lista utilizações com dados completos', async () => {
            const automovel = await automovelService.criar({
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            });

            const motorista = await motoristaService.criar({
                nome: 'João Silva'
            });

            await utilizacaoService.criar({
                motoristaId: motorista.id,
                automovelId: automovel.id,
                motivo: 'Viagem de negócios'
            });

            const resultado = await utilizacaoService.listar();

            expect(resultado).toHaveLength(1);
            expect(resultado[0]).toMatchObject({
                motivo: 'Viagem de negócios'
            });
            expect(resultado[0].motorista).toMatchObject({
                nome: 'João Silva'
            });
            expect(resultado[0].automovel).toMatchObject({
                placa: 'ABC1234'
            });
        });

        it('ordena utilizações por data de início (mais recente primeiro)', async () => {
            const automovel1 = await automovelService.criar({
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            });

            const automovel2 = await automovelService.criar({
                placa: 'DEF5678',
                cor: 'Vermelho',
                marca: 'Honda'
            });

            const motorista = await motoristaService.criar({
                nome: 'João Silva'
            });

            const utilizacao1 = await utilizacaoService.criar({
                motoristaId: motorista.id,
                automovelId: automovel1.id,
                motivo: 'Primeira viagem'
            });

            await new Promise(resolve => setTimeout(resolve, 10));

            await utilizacaoService.finalizar(utilizacao1.id);
            
            await utilizacaoService.criar({
                motoristaId: motorista.id,
                automovelId: automovel2.id,
                motivo: 'Segunda viagem'
            });

            const resultado = await utilizacaoService.listar();

            expect(resultado).toHaveLength(2);
            expect(resultado[0].motivo).toBe('Segunda viagem');
            expect(resultado[1].motivo).toBe('Primeira viagem');
        });
    });

    describe('buscarPorId', () => {
        it('busca utilização por ID', async () => {
            const automovel = await automovelService.criar({
                placa: 'ABC1234',
                cor: 'Azul',
                marca: 'Toyota'
            });

            const motorista = await motoristaService.criar({
                nome: 'João Silva'
            });

            const utilizacao = await utilizacaoService.criar({
                motoristaId: motorista.id,
                automovelId: automovel.id,
                motivo: 'Viagem de negócios'
            });

            const resultado = await utilizacaoService.buscarPorId(utilizacao.id);

            expect(resultado.id).toBe(utilizacao.id);
            expect(resultado.motivo).toBe('Viagem de negócios');
            expect(resultado.motorista).toMatchObject({
                nome: 'João Silva'
            });
            expect(resultado.automovel).toMatchObject({
                placa: 'ABC1234'
            });
        });

        it('falha ao buscar utilização inexistente', async () => {
            const idInexistente = '123e4567-e89b-12d3-a456-426614174000';

            await expect(utilizacaoService.buscarPorId(idInexistente))
                .rejects
                .toThrow('Utilização não encontrada');
        });
    });
});
