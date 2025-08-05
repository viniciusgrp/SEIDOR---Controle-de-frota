import { Request, Response } from 'express';
import { MotoristaService } from '../services/motorista.service';
import { MotoristaFilters } from '../types';
import { createMotoristaSchema, updateMotoristaSchema } from '../validations/motorista.validation';

const motoristaService = new MotoristaService();

export class MotoristaController {
  async criar(req: Request, res: Response) {
    try {
      const data = await createMotoristaSchema.validate(req.body, { abortEarly: false });
      
      const motorista = await motoristaService.criar(data);
      
      res.status(201).json({
        success: true,
        data: motorista,
        message: 'Motorista cadastrado com sucesso'
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: error.errors
        });
      }
      
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const filtros: MotoristaFilters = {
        nome: req.query.nome as string
      };

      const motoristas = await motoristaService.listar(filtros);
      
      res.json({
        success: true,
        data: motoristas,
        total: motoristas.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const motorista = await motoristaService.buscarPorId(id);
      
      res.json({
        success: true,
        data: motorista
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await updateMotoristaSchema.validate(req.body, { abortEarly: false });
      
      const motorista = await motoristaService.atualizar(id, data);
      
      res.json({
        success: true,
        data: motorista,
        message: 'Motorista atualizado com sucesso'
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: error.errors
        });
      }
      
      const status = error.message === 'Motorista não encontrado' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await motoristaService.excluir(id);
      
      res.json({
        success: true,
        message: 'Motorista excluído com sucesso'
      });
    } catch (error: any) {
      const status = error.message === 'Motorista não encontrado' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }
}
