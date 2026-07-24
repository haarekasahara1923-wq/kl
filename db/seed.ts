import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding initial data...');

  // Super Admin
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  await db.insert(schema.users).values({
    name: 'Super Admin',
    email: 'admin@klinternational.space',
    username: 'admin',
    passwordHash,
    role: 'admin',
  }).onConflictDoNothing();

  // Accountant
  const accHash = await bcrypt.hash('Accountant@123', 10);
  await db.insert(schema.users).values({
    name: 'School Accountant',
    email: 'accountant@klinternational.space',
    username: 'accountant',
    passwordHash: accHash,
    role: 'accountant',
  }).onConflictDoNothing();

  // Operations
  const opsHash = await bcrypt.hash('Operations@123', 10);
  await db.insert(schema.users).values({
    name: 'Operations Manager',
    email: 'operations@klinternational.space',
    username: 'operations',
    passwordHash: opsHash,
    role: 'operations',
  }).onConflictDoNothing();

  // About Content
  await db.insert(schema.aboutContent).values([
    {
      section: 'director',
      name: 'Dr. R. K. Sharma',
      designation: 'Director',
      message: 'Welcome to K.L. International School. Our endeavor is to empower students with values and knowledge to succeed in life.',
      qualifications: 'Ph.D. in Educational Leadership',
    },
    {
      section: 'principal',
      name: 'Mrs. Sunita Verma',
      designation: 'Principal',
      message: 'At KL International, every child is unique. We nurture their talent and foster holistic growth.',
      qualifications: 'M.Sc., M.Ed.',
    },
  ]).onConflictDoNothing();

  console.log('Seeding complete! Default credentials: admin / Admin@123');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
