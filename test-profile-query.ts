import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testProfile() {
  console.log('Testing merchant profile query...\n');
  
  // Simulate authContext.userId from JWT (string from JSON)
  const userIdFromJWT = "3"; // JWT payload has string
  const userId = BigInt(userIdFromJWT);
  
  console.log('UserIdFromJWT (string):', userIdFromJWT);
  console.log('UserId (BigInt):', userId.toString());
  console.log('UserId typeof:', typeof userId);
  
  console.log('\n---Querying MerchantUser---\n');
  
  const merchantUser = await prisma.merchantUser.findFirst({
    where: { userId: userId },
    include: { merchant: true },
  });
  
  if (!merchantUser) {
    console.log('❌ MerchantUser NOT FOUND');
  } else {
    console.log('✅ MerchantUser FOUND:');
    console.log('  MerchantId:', merchantUser.merchantId.toString());
    console.log('  Merchant Name:', merchantUser.merchant.name);
  }

  await prisma.$disconnect();
}

testProfile().catch(console.error);
