import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProductList from '@/components/accounting/ProductList';

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-6">
      <ProductList />
    </div>
  );
}
