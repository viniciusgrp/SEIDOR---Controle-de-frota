import { prisma } from '../database';
import { CreateUtilizacaoDTO } from '../types';

export class UtilizacaoService {
  async criar(data: CreateUtilizacaoDTO) {
    const motorista = await prisma.motorista.findUnique({
      where: { id: data.motoristaId }
    });

    if (!motorista) {
      throw new Error('Motorista não encontrado');
    }

    const automovel = await prisma.automovel.findUnique({
      where: { id: data.automovelId }
    });

    if (!automovel) {
      throw new Error('Automóvel não encontrado');
    }

    const automovelEmUso = await prisma.utilizacao.findFirst({
      where: {
        automovelId: data.automovelId,
        dataTermino: null
      }
    });

    if (automovelEmUso) {
      throw new Error('Este automóvel está em uso');
    }

    const motoristaComAutomovel = await prisma.utilizacao.findFirst({
      where: {
        motoristaId: data.motoristaId,
        dataTermino: null
      }
    });

    if (motoristaComAutomovel) {
      throw new Error('Este motorista já está utilizando outro automóvel');
    }

    return await prisma.utilizacao.create({
      data,
      include: {
        motorista: true,
        automovel: true
      }
    });
  }

  async finalizar(id: string) {
    const utilizacao = await prisma.utilizacao.findUnique({
      where: { id },
      include: {
        motorista: true,
        automovel: true
      }
    });

    if (!utilizacao) {
      throw new Error('Utilização não encontrada');
    }

    if (utilizacao.dataTermino) {
      throw new Error('Esta utilização já foi finalizada');
    }

    return await prisma.utilizacao.update({
      where: { id },
      data: {
        dataTermino: new Date()
      },
      include: {
        motorista: true,
        automovel: true
      }
    });
  }

  async listar() {
    return await prisma.utilizacao.findMany({
      include: {
        motorista: true,
        automovel: true
      },
      orderBy: {
        dataInicio: 'desc'
      }
    });
  }

  async buscarPorId(id: string) {
    const utilizacao = await prisma.utilizacao.findUnique({
      where: { id },
      include: {
        motorista: true,
        automovel: true
      }
    });

    if (!utilizacao) {
      throw new Error('Utilização não encontrada');
    }

    return utilizacao;
  }
}
