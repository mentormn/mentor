import ClassSpaceClient from './ClassSpaceClient';

export default async function ClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClassSpaceClient classId={id} />;
}
