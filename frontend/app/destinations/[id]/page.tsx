import DestinationMarketplace from '@/components/DestinationMarketplace';

export default async function DestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DestinationMarketplace destinationId={id} />;
}
