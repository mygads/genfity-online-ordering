/**
 * Prisma Seed Script
 * Creates initial Super Admin user
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if super admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@genfity.com' },
  });

  if (existingAdmin) {
    console.log('✅ Super Admin already exists');
    return;
  }

  // Create Super Admin
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@genfity.com',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
      mustChangePassword: false,
    },
  });

  console.log('✅ Super Admin created:');
  console.log('   Email: admin@genfity.com');
  console.log('   Password: Admin@123456');
  console.log('   ⚠️  Please change this password in production!');
  console.log('');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
