import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import db from '@/db/db';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { PageHeader } from '../_components/pageHeader';

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { priceInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum.priceInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { priceInCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      (orderData._sum.priceInCents ?? 0) / (!userCount ? 1 : userCount) / 100,
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({
      where: { isAvailableForPurchase: true },
    }),
    db.product.count({
      where: { isAvailableForPurchase: false },
    }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

export default async function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeader>Products</PageHeader>
      </div>
    </>
  );
}
