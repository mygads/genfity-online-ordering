import { PrismaClient } from '@prisma/client';
import authService from './src/lib/services/AuthService.js';

const prisma = new PrismaClient({ log: ['query', 'error'] });

async function testFullFlow() {
  console.log('Testing full auth → profile flow...\n');
  
  // Simulate login response token
  const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwic2Vzc2lvbklkIjoiNyIsInJvbGUiOiJNRVJDSEFOVF9PV05FUiIsImVtYWlsIjoic2l0aUBrb3BpLmNvbSIsImlhdCI6MTc2MjcxMTM4OSwiZXhwIjoxNzYyNzE0OTg5fQ.26A35q0cIY_eIGLQ8Q4xneoUsgXuM-IW42e0ASuYDCM";
  
  console.log('1. Verifying token...');
  const authContext = await authService.verifyToken(testToken);
  
  if (!authContext) {
    console.log('❌ Token verification failed');
    return;
  }
  
  console.log('✅ Token verified');
  console.log('   UserId:', authContext.userId.toString(), '(type:', typeof authContext.userId, ')');
  console.log('   SessionId:', authContext.sessionId.toString());
  console.log('   Role:', authContext.role);
  console.log('   Email:', authContext.email);
  
  console.log('\n2. Querying MerchantUser...');
  const merchantUser = await prisma.merchantUser.findFirst({
    where: { userId: authContext.userId },
    include: { merchant: true },
  });
  
  if (!merchantUser) {
    console.log('❌ MerchantUser NOT FOUND for userId:', authContext.userId.toString());
  } else {
    console.log('✅ MerchantUser FOUND');
    console.log('   MerchantId:', merchantUser.merchantId.toString());
    console.log('   Merchant:', merchantUser.merchant.name);
  }
  
  await prisma.$disconnect();
}

testFullFlow().catch(console.error);
