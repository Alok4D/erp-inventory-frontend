export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Stat Cards placeholders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <p className="text-3xl font-bold mt-2">45</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Low Stock Items</h3>
          <p className="text-3xl font-bold mt-2 text-red-500">8</p>
        </div>
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
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Sample Product 1</td>
                <td className="py-3 px-4">PRD-001</td>
                <td className="py-3 px-4 text-red-500 font-medium">3</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Sample Product 2</td>
                <td className="py-3 px-4">PRD-002</td>
                <td className="py-3 px-4 text-red-500 font-medium">1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
