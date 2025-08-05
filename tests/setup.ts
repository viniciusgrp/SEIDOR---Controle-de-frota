import { prisma } from '../src/database';

beforeAll(async () => {
  try {
    await prisma.utilizacao.findFirst();
  } catch (error) {
    console.log('Banco de dados não configurado. Execute: npm run test:setup');
    process.exit(1);
  }
});

beforeEach(async () => {
  try {
    await prisma.utilizacao.deleteMany();
    await prisma.automovel.deleteMany();
    await prisma.motorista.deleteMany();
    
    // Aguarda um pouco para garantir que as operações sejam completadas
    await new Promise(resolve => setTimeout(resolve, 10));
  } catch (error) {
    console.error('Erro ao limpar banco de dados de teste:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.log('Erro ao desconectar do banco:', error);
  }
});
