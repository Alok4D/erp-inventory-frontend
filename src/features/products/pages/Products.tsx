import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useGetProductsQuery, useDeleteProductMutation } from "../../../redux/features/product/productApi";
import { useNavigate } from "react-router-dom";
import { DeleteProductModal } from "../components/DeleteProductModal";
import { useAppSelector } from "../../../redux/hooks";
import { ProductTable } from "../components/ProductTable";

const Products = () => {
  const navigate = useNavigate();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  const user = useAppSelector((state) => state.auth.user);
  const canManageProducts = user?.role === 'admin' || user?.role === 'manager';

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryArgs: any = { page, limit };
  if (debouncedSearch) queryArgs.searchTerm = debouncedSearch;

  const { data, isLoading, error } = useGetProductsQuery(queryArgs);
  
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
        {canManageProducts && (
          <button
            onClick={() => navigate('/products/add-product')}
            className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        )}
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

        <ProductTable 
          products={products}
          isLoading={isLoading}
          error={error}
          meta={meta}
          page={page}
          setPage={setPage}
          canManageProducts={canManageProducts}
          setProductToDelete={setProductToDelete}
          isDeleting={isDeleting}
        />
      </div>

      {productToDelete && (
        <DeleteProductModal 
          isLoading={isDeleting}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default Products;
