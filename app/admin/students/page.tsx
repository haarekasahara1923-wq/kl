import { db } from '@/db';
import { students } from '@/db/schema';
import { eq } from 'drizzle-orm';
import StudentsClient from './StudentsClient';

export default async function StudentsPage() {
  let studentList: any[] = [];
  try {
    studentList = await db.query.students.findMany({
      where: eq(students.isDeleted, false),
      orderBy: (s, { desc }) => [desc(s.createdAt)],
    });
  } catch {}
  return <StudentsClient students={studentList} />;
}
