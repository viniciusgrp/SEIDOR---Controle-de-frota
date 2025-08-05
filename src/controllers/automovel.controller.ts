import { Request, Response } from 'express';
import { AutomovelService } from '../services/automovel.service';
import { CreateAutomovelDTO, UpdateAutomovelDTO, AutomovelFilters } from '../types';
import { createAutomovelSchema, updateAutomovelSchema } from '../validations/automovel.validation';

const automovelService = new AutomovelService();

export class AutomovelController {
  async criar(req: Request, res: Response) {
    try {
      const data = await createAutomovelSchema.validate(req.body, { abortEarly: false });
      
      const automovel = await automovelService.criar(data);
      
      res.status(201).json({
        success: true,
        data: automovel,
        message: 'Automóvel cadastrado com sucesso'
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
      const filtros: AutomovelFilters = {
        cor: req.query.cor as string,
        marca: req.query.marca as string
      };

      const automoveis = await automovelService.listar(filtros);
      
      res.json({
        success: true,
        data: automoveis,
        total: automoveis.length
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
      const automovel = await automovelService.buscarPorId(id);
      
      res.json({
        success: true,
        data: automovel
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
      const data = await updateAutomovelSchema.validate(req.body, { abortEarly: false });
      
      const automovel = await automovelService.atualizar(id, data);
      
      res.json({
        success: true,
        data: automovel,
        message: 'Automóvel atualizado com sucesso'
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: error.errors
        });
      }
      
      const status = error.message === 'Automóvel não encontrado' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await automovelService.excluir(id);
      
      res.json({
        success: true,
        message: 'Automóvel excluído com sucesso'
      });
    } catch (error: any) {
      const status = error.message === 'Automóvel não encontrado' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }
}
