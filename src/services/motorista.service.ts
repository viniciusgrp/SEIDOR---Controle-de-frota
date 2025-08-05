import { prisma } from '../database';
import { CreateMotoristaDTO, UpdateMotoristaDTO, MotoristaFilters } from '../types';

export class MotoristaService {
  async criar(data: CreateMotoristaDTO) {
    return await prisma.motorista.create({
      data
    });
  }

  async atualizar(id: string, data: UpdateMotoristaDTO) {
    try {
      return await prisma.motorista.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new Error('Motorista não encontrado');
    }
  }

  async excluir(id: string) {
    const motorista = await prisma.motorista.findUnique({
      where: { id },
      include: {
        utilizacoes: {
          where: {
            dataTermino: null
          }
        }
      }
    });

    if (!motorista) {
      throw new Error('Motorista não encontrado');
    }

    await prisma.motorista.delete({
      where: { id }
    });
  }

  async buscarPorId(id: string) {
    const motorista = await prisma.motorista.findUnique({
      where: { id }
    });

    if (!motorista) {
      throw new Error('Motorista não encontrado');
    }

    return motorista;
  }

  async listar(filtros: MotoristaFilters = {}) {
    const where: any = {};

    if (filtros.nome) {
      where.nome = {
        contains: filtros.nome
      };
    }

    return await prisma.motorista.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
