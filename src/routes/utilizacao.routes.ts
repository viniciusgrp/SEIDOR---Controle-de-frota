import { Router } from 'express';
import { UtilizacaoController } from '../controllers/utilizacao.controller';

const router = Router();
const utilizacaoController = new UtilizacaoController();

router.post('/', (req, res) => utilizacaoController.criar(req, res));
router.patch('/:id/finalizar', (req, res) => utilizacaoController.finalizar(req, res));
router.get('/', (req, res) => utilizacaoController.listar(req, res));
router.get('/:id', (req, res) => utilizacaoController.buscarPorId(req, res));

export { router as utilizacaoRoutes };
