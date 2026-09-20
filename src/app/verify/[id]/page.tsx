import VerifyClient from './VerifyClient';

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VerifyClient certId={id} />;
}
