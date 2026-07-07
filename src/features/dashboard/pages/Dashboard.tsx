import { useGetDashboardSummaryQuery } from '../../../redux/features/dashboard/dashboardApi';
import { Skeleton } from '../../../components/ui/skeleton';

export default function Dashboard() {
  
  const { data, isLoading, error } = useGetDashboardSummaryQuery(undefined);

  if (error) {
    return <div className="p-6 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  const { totalProducts, totalSalesCount, totalSalesAmount, lowStockProducts } = data?.data || {};

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {isLoading ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
              <p className="text-3xl font-bold mt-2">{totalProducts || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
              <p className="text-3xl font-bold mt-2">{totalSalesCount || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">${totalSalesAmount?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Low Stock Items</h3>
              <p className="text-3xl font-bold mt-2 text-red-500">{lowStockProducts?.length || 0}</p>
            </div>
          </>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Low Stock Products (Stock &lt; 5)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 font-medium text-gray-600">Product Name</th>
                <th className="py-3 px-4 font-medium text-gray-600">SKU</th>
                <th className="py-3 px-4 font-medium text-gray-600">Stock</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-4 px-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-12" /></td>
                  </tr>
                ))
              ) : lowStockProducts && lowStockProducts.length > 0 ? (
                lowStockProducts.map((product: any) => (
                  <tr key={product._id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.sku}</td>
                    <td className="py-3 px-4 text-red-500 font-medium">{product.stockQuantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    No low stock products found. All good!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
