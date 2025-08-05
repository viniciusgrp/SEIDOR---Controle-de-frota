    import { AutomovelService } from '../../src/services/automovel.service';
    import { prisma } from '../../src/database';

    describe('AutomovelService', () => {
    let automovelService: AutomovelService;

    beforeEach(() => {
        automovelService = new AutomovelService();
    });

    describe('criar', () => {
        it('cria um automóvel', async () => {
        const dadosAutomovel = {
            placa: 'ABC1234',
            cor: 'Azul',
            marca: 'Toyota'
        };

        const resultado = await automovelService.criar(dadosAutomovel);

        expect(resultado).toMatchObject(dadosAutomovel);
        expect(resultado.id).toBeDefined();
        expect(resultado.createdAt).toBeDefined();
        expect(resultado.updatedAt).toBeDefined();
        });

        it('falha ao criar automóvel com placa duplicada', async () => {
        const dadosAutomovel = {
            placa: 'ABC1234',
            cor: 'Azul',
            marca: 'Toyota'
        };

        await automovelService.criar(dadosAutomovel);

        await expect(automovelService.criar(dadosAutomovel))
            .rejects
            .toThrow('Já existe um automóvel cadastrado com esta placa');
        });
    });

    describe('listar', () => {
        it('retorna lista vazia quando não há automóveis', async () => {
        const resultado = await automovelService.listar();
        expect(resultado).toEqual([]);
        });

        it('deve listar automóveis criados', async () => {
        await automovelService.criar({
            placa: 'ABC1234',
            cor: 'Azul',
            marca: 'Toyota'
        });

        await automovelService.criar({
            placa: 'DEF5678',
            cor: 'Vermelho',
            marca: 'Honda'
        });

        const resultado = await automovelService.listar();
        expect(resultado).toHaveLength(2);
        });

        it('filtra automóveis por cor', async () => {
        await automovelService.criar({
            placa: 'ABC1234',
            cor: 'Azul',
            marca: 'Toyota'
        });

        await automovelService.criar({
            placa: 'DEF5678',
            cor: 'Vermelho',
            marca: 'Honda'
        });

        const resultado = await automovelService.listar({ cor: 'Azul' });
        expect(resultado).toHaveLength(1);
        expect(resultado[0].cor).toBe('Azul');
        });

        it('filtra automóveis por marca', async () => {
        await automovelService.criar({
            placa: 'ABC1234',
            cor: 'Azul',
            marca: 'Toyota'
        });

        await automovelService.criar({
            placa: 'DEF5678',
            cor: 'Vermelho',
            marca: 'Honda'
        });

        const resultado = await automovelService.listar({ marca: 'Toyota' });
        expect(resultado).toHaveLength(1);
        expect(resultado[0].marca).toBe('Toyota');
        });
    });

    describe('buscarPorId', () => {
        it('busca automóvel por ID', async () => {
        const automovel = await automovelService.criar({
            placa: 'ABC1234',
            cor: 'Azul',
            marca: 'Toyota'
        });

        const resultado = await automovelService.buscarPorId(automovel.id);
        expect(resultado.id).toBe(automovel.id);
        expect(resultado.placa).toBe('ABC1234');
        });

        it('deve falhar ao buscar automóvel inexistente', async () => {
        const idInexistente = '123e4567-e89b-12d3-a456-426614174000';
        
        await expect(automovelService.buscarPorId(idInexistente))
            .rejects
            .toThrow('Automóvel não encontrado');
        });
    });

    describe('atualizar', () => {
        it('atualiza automóvel', async () => {
        const automovel = await automovelService.criar({
            placa: 'ABC1234',
            cor: 'Azul',
            marca: 'Toyota'
        });

        const resultado = await automovelService.atualizar(automovel.id, {
            cor: 'Verde'
        });

        expect(resultado.cor).toBe('Verde');
        expect(resultado.placa).toBe('ABC1234');
        expect(resultado.marca).toBe('Toyota');
        });

        it('falha ao atualizar automóvel inexistente', async () => {
        const idInexistente = '123e4567-e89b-12d3-a456-426614174000';
        
        await expect(automovelService.atualizar(idInexistente, { cor: 'Verde' }))
            .rejects
            .toThrow('Automóvel não encontrado');
        });

        it('falha ao atualizar com placa duplicada', async () => {
        await automovelService.criar({
            placa: 'ABC1234',
            cor: 'Azul',
            marca: 'Toyota'
        });

        const automovel2 = await automovelService.criar({
            placa: 'DEF5678',
            cor: 'Vermelho',
            marca: 'Honda'
        });

        await expect(automovelService.atualizar(automovel2.id, { placa: 'ABC1234' }))
            .rejects
            .toThrow('Já existe um automóvel cadastrado com esta placa');
        });
    });

    describe('excluir', () => {
        it('exclui automóvel', async () => {
        const automovel = await automovelService.criar({
            placa: 'ABC1234',
            cor: 'Azul',
            marca: 'Toyota'
        });

        await automovelService.excluir(automovel.id);

        await expect(automovelService.buscarPorId(automovel.id))
            .rejects
            .toThrow('Automóvel não encontrado');
        });

        it('falha ao excluir automóvel inexistente', async () => {
        const idInexistente = '123e4567-e89b-12d3-a456-426614174000';
        
        await expect(automovelService.excluir(idInexistente))
            .rejects
            .toThrow('Automóvel não encontrado');
        });

        it('deve falhar ao excluir automóvel em uso', async () => {
        const automovel = await automovelService.criar({
            placa: 'ABC1234',
            cor: 'Azul',
            marca: 'Toyota'
        });

        const motorista = await prisma.motorista.create({
            data: { nome: 'João Silva' }
        });

        await prisma.utilizacao.create({
            data: {
            motoristaId: motorista.id,
            automovelId: automovel.id,
            motivo: 'Teste'
            }
        });

        await expect(automovelService.excluir(automovel.id))
            .rejects
            .toThrow('Não é possível excluir um automóvel que está sendo utilizado');
        });
    });
    });
