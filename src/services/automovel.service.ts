import { prisma } from '../database';
import { CreateAutomovelDTO, UpdateAutomovelDTO, AutomovelFilters } from '../types';

export class AutomovelService {
  async criar(data: CreateAutomovelDTO) {
    const automovelExistente = await prisma.automovel.findUnique({
      where: { placa: data.placa }
    });

    if (automovelExistente) {
      throw new Error('Já existe um automóvel cadastrado com esta placa');
    }

    return await prisma.automovel.create({
      data
    });
  }

  async atualizar(id: string, data: UpdateAutomovelDTO) {
    if (data.placa) {
      const automovelComPlaca = await prisma.automovel.findUnique({
        where: { placa: data.placa }
      });

      if (automovelComPlaca && automovelComPlaca.id !== id) {
        throw new Error('Já existe um automóvel cadastrado com esta placa');
      }
    }

    try {
      return await prisma.automovel.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new Error('Automóvel não encontrado');
    }
  }

  async excluir(id: string) {
    const automovel = await prisma.automovel.findUnique({
      where: { id },
      include: {
        utilizacoes: {
          where: {
            dataTermino: null
          }
        }
      }
    });

    if (!automovel) {
      throw new Error('Automóvel não encontrado');
    }

    await prisma.automovel.delete({
      where: { id }
    });
  }

  async buscarPorId(id: string) {
    const automovel = await prisma.automovel.findUnique({
      where: { id }
    });

    if (!automovel) {
      throw new Error('Automóvel não encontrado');
    }

    return automovel;
  }

  async listar(filtros: AutomovelFilters = {}) {
    const where: any = {};

    if (filtros.cor) {
      where.cor = {
        contains: filtros.cor
      };
    }

    if (filtros.marca) {
      where.marca = {
        contains: filtros.marca
      };
    }

    return await prisma.automovel.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
