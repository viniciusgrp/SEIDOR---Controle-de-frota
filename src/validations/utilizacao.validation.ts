import * as yup from 'yup';

export const createUtilizacaoSchema = yup.object({
  motoristaId: yup.string().required('ID do motorista é obrigatório'),
  automovelId: yup.string().required('ID do automóvel é obrigatório'),
  motivo: yup.string().required('Motivo da utilização é obrigatório')
});
