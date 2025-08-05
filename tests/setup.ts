import { prisma } from '../src/database';

beforeEach(async () => {
  // Limpa as tabelas antes de cada teste
  await prisma.utilizacao.deleteMany();
  await prisma.automovel.deleteMany();
  await prisma.motorista.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
