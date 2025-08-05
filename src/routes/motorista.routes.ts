import { Router } from 'express';
import { MotoristaController } from '../controllers/motorista.controller';

const router = Router();
const motoristaController = new MotoristaController();

router.post('/', (req, res) => motoristaController.criar(req, res));
router.get('/', (req, res) => motoristaController.listar(req, res));
router.get('/:id', (req, res) => motoristaController.buscarPorId(req, res));
router.put('/:id', (req, res) => motoristaController.atualizar(req, res));
router.delete('/:id', (req, res) => motoristaController.excluir(req, res));

export { router as motoristaRoutes };
