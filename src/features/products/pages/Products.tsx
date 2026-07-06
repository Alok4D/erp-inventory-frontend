import { Plus, Search } from "lucide-react";

export default function Products() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
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
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary w-64"
            />
          </div>
        </div>

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
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                </td>
                <td className="py-3 px-4">Wireless Mouse</td>
                <td className="py-3 px-4">Electronics</td>
                <td className="py-3 px-4">$25.00</td>
                <td className="py-3 px-4">50</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:underline mr-3">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
