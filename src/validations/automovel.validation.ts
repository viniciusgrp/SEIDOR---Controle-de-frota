import * as yup from 'yup';

export const createAutomovelSchema = yup.object({
  placa: yup.string().required('Placa é obrigatória'),
  cor: yup.string().required('Cor é obrigatória'),
  marca: yup.string().required('Marca é obrigatória')
});

export const updateAutomovelSchema = yup.object({
  placa: yup.string().optional(),
  cor: yup.string().optional(),
  marca: yup.string().optional()
});
