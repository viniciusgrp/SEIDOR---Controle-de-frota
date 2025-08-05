import { MotoristaService } from '../../src/services/motorista.service';
import { prisma } from '../../src/database';

describe('MotoristaService', () => {
  let motoristaService: MotoristaService;

  beforeEach(() => {
    motoristaService = new MotoristaService();
  });

  describe('criar', () => {
    it('cria um motorista', async () => {
      const dadosMotorista = {
        nome: 'João Silva'
      };

      const resultado = await motoristaService.criar(dadosMotorista);

      expect(resultado).toMatchObject(dadosMotorista);
      expect(resultado.id).toBeDefined();
      expect(resultado.createdAt).toBeDefined();
      expect(resultado.updatedAt).toBeDefined();
    });

    it('cria motoristas com mesmo nome', async () => {
      const dadosMotorista = {
        nome: 'João Silva'
      };

      const motorista1 = await motoristaService.criar(dadosMotorista);
      const motorista2 = await motoristaService.criar(dadosMotorista);

      expect(motorista1.id).not.toBe(motorista2.id);
      expect(motorista1.nome).toBe(motorista2.nome);
    });
  });

  describe('listar', () => {
    it('retorna lista vazia quando não há motoristas', async () => {
      const resultado = await motoristaService.listar();
      expect(resultado).toEqual([]);
    });

    it('lista motoristas criados', async () => {
      await motoristaService.criar({ nome: 'João Silva' });
      await motoristaService.criar({ nome: 'Maria Santos' });

      const resultado = await motoristaService.listar();
      expect(resultado).toHaveLength(2);
    });

    it('filtra motoristas por nome', async () => {
      await motoristaService.criar({ nome: 'João Silva' });
      await motoristaService.criar({ nome: 'Maria Santos' });
      await motoristaService.criar({ nome: 'João Oliveira' });

      const resultado = await motoristaService.listar({ nome: 'João' });
      expect(resultado).toHaveLength(2);
      expect(resultado.every(m => m.nome.includes('João'))).toBe(true);
    });

    it('retorna lista vazia quando filtro não encontra motoristas', async () => {
      await motoristaService.criar({ nome: 'João Silva' });

      const resultado = await motoristaService.listar({ nome: 'Carlos' });
      expect(resultado).toEqual([]);
    });
  });

  describe('buscarPorId', () => {
    it('busca motorista por ID', async () => {
      const motorista = await motoristaService.criar({ nome: 'João Silva' });

      const resultado = await motoristaService.buscarPorId(motorista.id);
      expect(resultado.id).toBe(motorista.id);
      expect(resultado.nome).toBe('João Silva');
    });

    it('falha ao buscar motorista inexistente', async () => {
      const idInexistente = '123e4567-e89b-12d3-a456-426614174000';
      
      await expect(motoristaService.buscarPorId(idInexistente))
        .rejects
        .toThrow('Motorista não encontrado');
    });
  });

  describe('atualizar', () => {
    it('atualiza motorista', async () => {
      const motorista = await motoristaService.criar({ nome: 'João Silva' });

      const resultado = await motoristaService.atualizar(motorista.id, {
        nome: 'João Silva Santos'
      });

      expect(resultado.nome).toBe('João Silva Santos');
      expect(resultado.id).toBe(motorista.id);
    });

    it('falha ao atualizar motorista inexistente', async () => {
      const idInexistente = '123e4567-e89b-12d3-a456-426614174000';
      
      await expect(motoristaService.atualizar(idInexistente, { nome: 'Novo Nome' }))
        .rejects
        .toThrow('Motorista não encontrado');
    });
  });

  describe('excluir', () => {
    it('exclui motorista', async () => {
      const motorista = await motoristaService.criar({ nome: 'João Silva' });

      await motoristaService.excluir(motorista.id);

      await expect(motoristaService.buscarPorId(motorista.id))
        .rejects
        .toThrow('Motorista não encontrado');
    });

    it('falha ao excluir motorista inexistente', async () => {
      const idInexistente = '123e4567-e89b-12d3-a456-426614174000';
      
      await expect(motoristaService.excluir(idInexistente))
        .rejects
        .toThrow('Motorista não encontrado');
    });
  });
});
