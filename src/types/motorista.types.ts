export interface CreateMotoristaDTO {
  nome: string;
}

export interface UpdateMotoristaDTO {
  nome?: string;
}

export interface MotoristaResponse {
  id: string;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}
