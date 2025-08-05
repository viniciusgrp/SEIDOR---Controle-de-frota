import * as yup from 'yup';

export const createMotoristaSchema = yup.object({
  nome: yup.string().required('Nome é obrigatório')
});

export const updateMotoristaSchema = yup.object({
  nome: yup.string().optional()
});
