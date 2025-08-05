import { Router } from 'express';
import { automovelRoutes } from './automovel.routes';
import { motoristaRoutes } from './motorista.routes';

const router = Router();

router.use('/automoveis', automovelRoutes);
router.use('/motoristas', motoristaRoutes);

export { router };
