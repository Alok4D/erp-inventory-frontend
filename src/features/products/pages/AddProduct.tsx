import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAddProductMutation } from "../../../redux/features/product/productApi";
import Swal from "sweetalert2";

export default function AddProduct() {
  const navigate = useNavigate();
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    stockQuantity: '',
    purchasePrice: '',
    sellingPrice: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Please select an image file',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    try {
      const data = new FormData();
      data.append('image', imageFile);
      
      const productData = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        stockQuantity: Number(formData.stockQuantity),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
      };
      
      data.append('data', JSON.stringify(productData));

      await addProduct(data).unwrap();
      
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Product added successfully!',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/products');
    } catch (err: any) {
      console.error('Failed to add product:', err);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: err.data?.message || 'Failed to add product',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the information below to add a new product to your inventory.</p>
        </div>
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="e.g. Wireless Mouse" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SKU <span className="text-red-500">*</span></label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="PRD-001" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white">
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
              <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} min="0" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Purchase Price ($) <span className="text-red-500">*</span></label>
              <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} step="0.01" min="0" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Selling Price ($) <span className="text-red-500">*</span></label>
              <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} step="0.01" min="0" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="0.00" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image <span className="text-red-500">*</span></label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required />
            <p className="text-xs text-gray-500 mt-2">Image upload is required while creating a product.</p>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-gray-100 mt-8">
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
