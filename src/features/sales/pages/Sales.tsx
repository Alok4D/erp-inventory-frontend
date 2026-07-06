import { useState } from "react";
import { Plus, Trash2, ShoppingCart } from "lucide-react";

// Dummy data for static design
const dummyProducts = [
  { id: 1, name: "Wireless Mouse", price: 25.00, stock: 50, sku: "PRD-001" },
  { id: 2, name: "Office Chair", price: 120.00, stock: 3, sku: "PRD-002" },
  { id: 3, name: "Mechanical Keyboard", price: 75.00, stock: 15, sku: "PRD-003" },
];

export default function Sales() {
  const [cart, setCart] = useState<{ id: number; product: typeof dummyProducts[0]; quantity: number }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    if (!selectedProductId || quantity <= 0) return;
    
    const product = dummyProducts.find(p => p.id === Number(selectedProductId));
    if (!product) return;

    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { id: Date.now(), product, quantity }]);
    }
    
    // Reset selection
    setSelectedProductId("");
    setQuantity(1);
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const grandTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Create Sale</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gray-50/50 border-b border-gray-100">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-gray-500" />
            Add Products to Sale
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Product</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">-- Choose a product --</option>
                {dummyProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock}) - ${product.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
              <input 
                type="number" 
                min="1" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={!selectedProductId}
              className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-md font-medium mb-4">Cart Items</h3>
          
          {cart.length === 0 ? (
            <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>No products added yet.</p>
              <p className="text-sm mt-1">Select a product and add it to the cart.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="py-3 px-4 font-medium text-gray-600">Product Name</th>
                      <th className="py-3 px-4 font-medium text-gray-600">SKU</th>
                      <th className="py-3 px-4 font-medium text-gray-600 text-right">Price</th>
                      <th className="py-3 px-4 font-medium text-gray-600 text-center">Qty</th>
                      <th className="py-3 px-4 font-medium text-gray-600 text-right">Total</th>
                      <th className="py-3 px-4 font-medium text-gray-600 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{item.product.name}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">{item.product.sku}</td>
                        <td className="py-3 px-4 text-right">${item.product.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">{item.quantity}</td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex justify-end">
                <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                    <span>Tax (0%)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Grand Total</span>
                    <span className="text-xl font-bold text-gray-900">${grandTotal.toFixed(2)}</span>
                  </div>
                  
                  <button className="w-full mt-6 bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors shadow-sm">
                    Submit Sale
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
