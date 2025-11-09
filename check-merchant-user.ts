import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMerchantUser() {
  console.log('Checking MerchantUser for userId=3...\n');
  
  // Check if merchant_users entry exists
  const merchantUser = await prisma.merchantUser.findFirst({
    where: { userId: BigInt(3) },
    include: {
      merchant: true,
      user: true,
    },
  });

  if (!merchantUser) {
    console.log('❌ NO MerchantUser found for userId=3');
    console.log('\nChecking all MerchantUsers:');
    const all = await prisma.merchantUser.findMany({ include: { merchant: true, user: true } });
    console.log(`Found ${all.length} MerchantUsers total`);
    all.forEach(mu => {
      console.log(`  - UserId: ${mu.userId}, MerchantId: ${mu.merchantId}, Merchant: ${mu.merchant.name}, User: ${mu.user.email}`);
    });
  } else {
    console.log('✅ MerchantUser found!');
    console.log('UserId:', merchantUser.userId.toString());
    console.log('MerchantId:', merchantUser.merchantId.toString());
    console.log('Merchant Name:', merchantUser.merchant.name);
    console.log('User Email:', merchantUser.user.email);
  }

  await prisma.$disconnect();
}

checkMerchantUser().catch(console.error);
