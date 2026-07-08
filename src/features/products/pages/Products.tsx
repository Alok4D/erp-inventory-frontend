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
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: allProductsData } = useGetProductsQuery({ limit: 1000 });
  const allProducts = allProductsData?.data || [];
  const defaultCategories = ['electronics', 'clothing', 'furniture'];
  const dynamicCategories = Array.from(new Set(allProducts.map((p: any) => p.category?.toLowerCase()))).filter(Boolean) as string[];
  const allCategories = Array.from(new Set([...defaultCategories, ...dynamicCategories]));

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryArgs: any = { page, limit };
  if (debouncedSearch) queryArgs.searchTerm = debouncedSearch;
  if (categoryFilter) queryArgs.category = categoryFilter;

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
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-900 focus:border-gray-900 w-full sm:w-64"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-900 focus:border-gray-900 bg-white w-full sm:w-auto sm:min-w-[160px] text-gray-700 capitalize"
            >
              <option value="" className="text-gray-500">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
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
