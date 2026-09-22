const { execSync } = require('child_process');
if (process.env.DATABASE_URL) {
  try {
    console.log('Preparing database schema (prisma db push)...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('Seeding database initial records...');
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
    console.log('Database initialized and seeded successfully.');
  } catch (err) {
    console.warn('Database preparation notice:', err.message);
  }
} else {
  console.log('DATABASE_URL not set in build environment; database initialization will run at request time.');
}
