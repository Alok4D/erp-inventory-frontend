import { Plus } from "lucide-react";

export default function Sales() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sales</h1>
        <button className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Sale
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-medium mb-4">Create New Sale</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-white">
                <option>Select a product...</option>
                <option>Wireless Mouse - $25.00</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input type="number" min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary" placeholder="1" />
            </div>
          </div>
          
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Add to Sale
          </button>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-md font-medium mb-4">Selected Products</h3>
            <table className="w-full text-left mb-6">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-gray-600">Product</th>
                  <th className="py-2 text-gray-600">Price</th>
                  <th className="py-2 text-gray-600">Qty</th>
                  <th className="py-2 text-gray-600 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3">Wireless Mouse</td>
                  <td className="py-3">$25.00</td>
                  <td className="py-3">2</td>
                  <td className="py-3 text-right font-medium">$50.00</td>
                </tr>
              </tbody>
            </table>
            
            <div className="flex justify-end text-xl font-bold">
              Grand Total: $50.00
            </div>
            
            <div className="flex justify-end mt-6">
              <button className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors">
                Submit Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
