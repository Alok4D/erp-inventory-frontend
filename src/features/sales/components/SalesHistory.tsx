import { useGetSalesQuery } from "../../../redux/features/sale/saleApi";
import { Skeleton } from "../../../components/ui/skeleton";
import { History } from "lucide-react";

export function SalesHistory() {
  
  const { data: salesData, isLoading: isLoadingSales } = useGetSalesQuery(undefined);
  const sales = salesData?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <History className="w-5 h-5 mr-2 text-gray-500" />
          All Sales Records
        </h2>
      </div>
      
      {isLoadingSales ? (
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      ) : sales.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-700">No sales history found</p>
          <p className="text-sm mt-1">Go to the "Create New Sale" tab to record your first sale.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="py-3 px-6 font-medium text-gray-600">Date</th>
                <th className="py-3 px-6 font-medium text-gray-600">Products Sold</th>
                <th className="py-3 px-6 font-medium text-gray-600 text-center">Total Quantity</th>
                <th className="py-3 px-6 font-medium text-gray-600 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale: any) => (
                <tr key={sale._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(sale.createdAt).toLocaleDateString()} <br/>
                    <span className="text-xs text-gray-400">{new Date(sale.createdAt).toLocaleTimeString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <ul className="space-y-1">
                      {sale.items.map((item: any, idx: number) => (
                        <li key={idx} className="text-sm text-gray-800 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                          {item.productName || (item.product && item.product.name) || 'Unknown Product'} 
                          <span className="text-gray-500 ml-1">x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-6 text-center font-medium text-gray-700">
                    {sale.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-gray-900">
                    ${sale.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
