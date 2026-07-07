import { useState } from "react";
import { Plus, Trash2, ShoppingCart, Loader2, History } from "lucide-react";
import { useGetProductsQuery } from "../../../redux/features/product/productApi";
import { useCreateSaleMutation, useGetSalesQuery } from "../../../redux/features/sale/saleApi";
import { Skeleton } from "../../../components/ui/skeleton";
import { useAppSelector } from "../../../redux/hooks";

export default function Sales() {
  const user = useAppSelector((state) => state.auth.user);
  const canViewHistory = user?.role === 'admin' || user?.role === 'manager';

  const [activeTab, setActiveTab] = useState<'history' | 'create'>(canViewHistory ? 'history' : 'create');

  const { data: salesData, isLoading: isLoadingSales } = useGetSalesQuery(undefined, {
    skip: !canViewHistory
  });
  const sales = salesData?.data || [];

  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery(undefined);
  const [createSale, { isLoading: isCreatingSale }] = useCreateSaleMutation();

  const products = productsData?.data || [];
  
  const [cart, setCart] = useState<{ id: number; product: any; quantity: number }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddToCart = () => {
    setError("");
    setSuccess("");
    if (!selectedProductId || quantity <= 0) return;
    
    const product = products.find((p: any) => p._id === selectedProductId);
    if (!product) return;

    // Check stock availability (considering what's already in the cart)
    const existingIndex = cart.findIndex(item => item.product._id === product._id);
    const currentCartQty = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    
    if (currentCartQty + quantity > product.stockQuantity) {
      setError(`Cannot add ${quantity} more. Only ${product.stockQuantity - currentCartQty} left in stock.`);
      return;
    }

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { id: Date.now(), product, quantity }]);
    }
    
    setSelectedProductId("");
    setQuantity(1);
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const grandTotal = cart.reduce((total, item) => total + (item.product.sellingPrice * item.quantity), 0);

  const handleSubmitSale = async () => {
    if (cart.length === 0) return;
    setError("");
    setSuccess("");

    try {
      const saleData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        }))
      };

      await createSale(saleData).unwrap();
      setCart([]);
      setSuccess("Sale completed successfully!");
    } catch (err: any) {
      console.error("Failed to create sale:", err);
      setError(err.data?.message || "Failed to create sale. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Sales Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {canViewHistory && (
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history' 
                ? 'border-gray-900 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <History className="w-4 h-4 mr-2" />
            Sales History
          </button>
        )}
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'create' 
              ? 'border-gray-900 text-gray-900' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Create New Sale
        </button>
      </div>

      {activeTab === 'history' ? (
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
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-md border border-green-200">
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gray-50/50 border-b border-gray-100">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-gray-500" />
            Add Products to Sale
          </h2>
          
          {isLoadingProducts ? (
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="w-full md:w-32 space-y-1.5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full md:w-24" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Product</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  disabled={isLoadingProducts}
                >
                  <option value="">{isLoadingProducts ? "Loading products..." : "-- Choose a product --"}</option>
                  {products.map((product: any) => (
                    <option key={product._id} value={product._id} disabled={product.stockQuantity === 0}>
                      {product.name} (Stock: {product.stockQuantity}) - ${product.sellingPrice?.toFixed(2)}
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
          )}
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
                        <td className="py-3 px-4 text-right">${item.product.sellingPrice?.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">{item.quantity}</td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ${(item.product.sellingPrice * item.quantity).toFixed(2)}
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
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Grand Total</span>
                    <span className="text-xl font-bold text-gray-900">${grandTotal.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={handleSubmitSale}
                    disabled={isCreatingSale || cart.length === 0}
                    className="w-full mt-6 flex items-center justify-center bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingSale && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isCreatingSale ? "Processing..." : "Submit Sale"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
