import { useState } from "react";
import { Plus, Search, Package2 } from "lucide-react";
import { useGetProductsQuery } from "../../../redux/features/product/productApi";
import { AddProductModal } from "../components/AddProductModal";

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, error } = useGetProductsQuery(undefined);

  const products = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
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
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-900 focus:border-gray-900 w-64"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">Failed to load products.</div>
        ) : products.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500">
            <Package2 className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-700">No products found</p>
            <p className="text-sm">Click "Add Product" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-medium text-gray-600">Image</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Product Name</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Selling Price</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Stock</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Actions</th>
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
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:underline mr-3 text-sm">Edit</button>
                      <button className="text-red-600 hover:underline text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
