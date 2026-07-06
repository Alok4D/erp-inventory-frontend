import { useState, useEffect } from "react";
import { Plus, Search, Package2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetProductsQuery, useDeleteProductMutation } from "../../../redux/features/product/productApi";
import { AddProductModal } from "../components/AddProductModal";
import { EditProductModal } from "../components/EditProductModal";
import { DeleteProductModal } from "../components/DeleteProductModal";

export default function Products() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5; // Items per page

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useGetProductsQuery({ 
    searchTerm: debouncedSearch, 
    page, 
    limit 
  });
  
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = data?.data || [];
  const meta = data?.meta || { totalPage: 1, total: 0 };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete).unwrap();
      // Pagination logic: if we delete the last item on current page, go back a page
      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      }
      setProductToDelete(null);
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-900 focus:border-gray-900 w-64"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 flex justify-center items-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading products...
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">Failed to load products.</div>
        ) : products.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500">
            <Package2 className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-700">No products found</p>
            <p className="text-sm">Try adjusting your search or add a new product.</p>
          </div>
        ) : (
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
                    <th className="py-3 px-4 font-medium text-gray-600 text-center">Actions</th>
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
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
                    disabled={page === meta.totalPage}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isAddModalOpen && <AddProductModal onClose={() => setIsAddModalOpen(false)} />}
      
      {editingProduct && (
        <EditProductModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
        />
      )}

      {productToDelete && (
        <DeleteProductModal 
          isLoading={isDeleting}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
