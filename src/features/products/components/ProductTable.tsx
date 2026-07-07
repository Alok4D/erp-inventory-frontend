import { Package2, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";

interface ProductTableProps {
  products: any[];
  isLoading: boolean;
  error: any;
  meta: { totalPage: number; total: number };
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  canManageProducts: boolean;
  setEditingProduct: (product: any) => void;
  setProductToDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ProductTable({
  products,
  isLoading,
  error,
  meta,
  page,
  setPage,
  canManageProducts,
  setEditingProduct,
  setProductToDelete,
  isDeleting,
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="border rounded-md">
          <div className="border-b px-4 py-3 grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b px-4 py-4 grid grid-cols-6 gap-4 items-center">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <div className="flex space-x-2 justify-center">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">Failed to load products.</div>;
  }

  if (products.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-500">
        <Package2 className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-lg font-medium text-gray-700">No products found</p>
        <p className="text-sm">Try adjusting your search or add a new product.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 font-medium text-gray-600">Image</th>
              <th className="py-3 px-4 font-medium text-gray-600">Product Name</th>
              <th className="py-3 px-4 font-medium text-gray-600">Category</th>
              <th className="py-3 px-4 font-medium text-gray-600">Selling Price</th>
              <th className="py-3 px-4 font-medium text-gray-600">Stock</th>
              {canManageProducts && <th className="py-3 px-4 font-medium text-gray-600 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-md object-cover bg-gray-100 border border-gray-200" 
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                      <Package2 className="w-6 h-6" />
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-800">{product.name}</div>
                  <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                </td>
                <td className="py-3 px-4 capitalize">{product.category}</td>
                <td className="py-3 px-4">${product.sellingPrice?.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stockQuantity < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {product.stockQuantity} in stock
                  </span>
                </td>
                {canManageProducts && (
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="text-blue-600 hover:underline mr-3 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setProductToDelete(product._id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {meta.totalPage > 1 && (
        <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-4">
          <div className="text-sm text-gray-500">
            Showing page {page} of {meta.totalPage} ({meta.total} total items)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              disabled={page === meta.totalPage}
              className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
