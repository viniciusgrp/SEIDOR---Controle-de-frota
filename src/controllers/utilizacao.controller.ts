import { Request, Response } from 'express';
import { UtilizacaoService } from '../services/utilizacao.service';
import { CreateUtilizacaoDTO } from '../types';
import { createUtilizacaoSchema } from '../validations/utilizacao.validation';

const utilizacaoService = new UtilizacaoService();

export class UtilizacaoController {
  async criar(req: Request, res: Response) {
    try {
      const data = await createUtilizacaoSchema.validate(req.body, { abortEarly: false });
      
      const utilizacao = await utilizacaoService.criar(data);
      
      res.status(201).json({
        success: true,
        data: utilizacao,
        message: 'Utilização iniciada com sucesso'
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

  async finalizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const utilizacao = await utilizacaoService.finalizar(id);
      
      res.json({
        success: true,
        data: utilizacao,
        message: 'Utilização finalizada com sucesso'
      });
    } catch (error: any) {
      const status = error.message === 'Utilização não encontrada' ? 404 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const utilizacoes = await utilizacaoService.listar();
      
      res.json({
        success: true,
        data: utilizacoes,
        total: utilizacoes.length
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
      const utilizacao = await utilizacaoService.buscarPorId(id);
      
      res.json({
        success: true,
        data: utilizacao
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}
