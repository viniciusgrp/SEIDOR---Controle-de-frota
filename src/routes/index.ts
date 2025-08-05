import { Router } from 'express';
import { automovelRoutes } from './automovel.routes';
import { motoristaRoutes } from './motorista.routes';
import { utilizacaoRoutes } from './utilizacao.routes';

const router = Router();

router.use('/automoveis', automovelRoutes);
router.use('/motoristas', motoristaRoutes);
router.use('/utilizacoes', utilizacaoRoutes);

export { router };
