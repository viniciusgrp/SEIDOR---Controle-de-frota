import { AutomovelResponse } from './automovel.types';
import { MotoristaResponse } from './motorista.types';

export interface CreateUtilizacaoDTO {
  motoristaId: string;
  automovelId: string;
  motivo: string;
}

export interface FinalizarUtilizacaoDTO {
  dataTermino: Date;
}

export interface UtilizacaoResponse {
  id: string;
  dataInicio: Date;
  dataTermino: Date | null;
  motivo: string;
  motorista: MotoristaResponse;
  automovel: AutomovelResponse;
  createdAt: Date;
  updatedAt: Date;
}
