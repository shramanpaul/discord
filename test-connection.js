require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      provider: 'mysql',
      ssl: {
        rejectUnauthorized: false, // Ignore self-signed certificate error
      },
    },
  },
});

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connection successful with Prisma');
    const profiles = await prisma.profile.findMany();
    console.log('Profiles:', profiles);
  } catch (error) {
    console.error('Database connection failed with Prisma', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
