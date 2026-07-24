import { db } from './db';
import { aboutContent } from './db/schema';
import { eq } from 'drizzle-orm';

async function test() {
  try {
    const existing = await db.query.aboutContent.findFirst({
      where: eq(aboutContent.section, 'director'),
    });
    console.log('existing', existing);
    if (!existing) {
      console.log('Inserting...');
      await db.insert(aboutContent).values({
        section: 'director',
        name: 'Test',
        designation: 'Director',
        message: 'Hello',
      });
      console.log('Inserted');
    }
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
