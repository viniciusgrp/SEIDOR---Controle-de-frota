import { Router } from 'express';
import { AutomovelController } from '../controllers/automovel.controller';

const router = Router();
const automovelController = new AutomovelController();

router.post('/', (req, res) => automovelController.criar(req, res));
router.get('/', (req, res) => automovelController.listar(req, res));
router.get('/:id', (req, res) => automovelController.buscarPorId(req, res));
router.put('/:id', (req, res) => automovelController.atualizar(req, res));
router.delete('/:id', (req, res) => automovelController.excluir(req, res));

export { router as automovelRoutes };
