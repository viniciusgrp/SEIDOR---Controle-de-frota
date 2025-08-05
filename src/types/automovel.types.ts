export interface CreateAutomovelDTO {
  placa: string;
  cor: string;
  marca: string;
}

export interface UpdateAutomovelDTO {
  placa?: string;
  cor?: string;
  marca?: string;
}

export interface AutomovelResponse {
  id: string;
  placa: string;
  cor: string;
  marca: string;
  createdAt: Date;
  updatedAt: Date;
}
