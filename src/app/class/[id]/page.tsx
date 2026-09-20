import { INITIAL_CLASSES } from '@/lib/mockData';
import ClassSpaceClient from './ClassSpaceClient';

export function generateStaticParams() {
  return INITIAL_CLASSES.map((cls) => ({ id: cls.id }));
}

export default function ClassPage() {
  return <ClassSpaceClient />;
}
