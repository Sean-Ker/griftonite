import { Card } from '@tremor/react';
import Search from '../components/search';

export const dynamic = 'force-dynamic';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? '';
  // const account = window.ethereum ? window.ethereum.selectedAddress : null;

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      {/* Gray card gradient background: */}

      <Card className="mt-6 flex justify-center inset-0 bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-1 sm:rounded-3xl">
        <Search />
      </Card>
    </main>
  );
}
