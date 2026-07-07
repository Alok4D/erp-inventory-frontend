import { useState, useEffect } from "react";
import { Plus, Trash2, ShoppingCart, Loader2, Search } from "lucide-react";
import { useGetProductsQuery } from "../../../redux/features/product/productApi";
import { useCreateSaleMutation } from "../../../redux/features/sale/saleApi";
import { Skeleton } from "../../../components/ui/skeleton";
import Swal from "sweetalert2";

export function CreateSale() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({
    searchTerm: debouncedSearch,
    limit: 100 
  });
  const [createSale, { isLoading: isCreatingSale }] = useCreateSaleMutation();

  const products = productsData?.data || [];
  
  const [cart, setCart] = useState<{ id: number; product: any; quantity: number }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  // Auto-select product if search yields exactly 1 result
  useEffect(() => {
    if (products.length === 1 && debouncedSearch) {
      setSelectedProductId(products[0]._id);
    }
  }, [products, debouncedSearch]);

  const handleAddToCart = () => {
    if (!selectedProductId || quantity <= 0) return;
    
    const product = products.find((p: any) => p._id === selectedProductId);
    if (!product) return;

    // Check stock availability (considering what's already in the cart)
    const existingIndex = cart.findIndex(item => item.product._id === product._id);
    const currentCartQty = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    
    if (currentCartQty + quantity > product.stockQuantity) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: `Cannot add ${quantity} more. Only ${product.stockQuantity - currentCartQty} left in stock.`,
        showConfirmButton: false,
        timer: 2000
      });
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
    setSearchTerm("");
    setQuantity(1);
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const grandTotal = cart.reduce((total, item) => total + (item.product.sellingPrice * item.quantity), 0);

  const handleSubmitSale = async () => {
    if (cart.length === 0) return;

    try {
      const saleData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        }))
      };

      await createSale(saleData).unwrap();
      setCart([]);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Sale completed successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err: any) {
      console.error("Failed to create sale:", err);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: err.data?.message || "Failed to create sale. Please try again.",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gray-50/50 border-b border-gray-100">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-gray-500" />
            Add Products to Sale
          </h2>
          
          {isLoadingProducts && !productsData ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 w-full space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="md:col-span-4 w-full space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="md:col-span-2 w-full space-y-1.5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Search Product</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name or SKU..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:col-span-4 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Product</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  disabled={isLoadingProducts && !productsData}
                >
                  <option value="">{isLoadingProducts && !productsData ? "Loading..." : "-- Choose a product --"}</option>
                  {products.map((product: any) => (
                    <option key={product._id} value={product._id} disabled={product.stockQuantity === 0}>
                      {product.name} (Stock: {product.stockQuantity}) - ${product.sellingPrice?.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className="md:col-span-2 w-full">
                <button 
                  onClick={handleAddToCart}
                  disabled={!selectedProductId}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </button>
              </div>
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
  );
}
