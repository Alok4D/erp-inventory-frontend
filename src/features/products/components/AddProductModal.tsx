import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useAddProductMutation } from "../../../redux/features/product/productApi";

interface AddProductModalProps {
  onClose: () => void;
}

export function AddProductModal({ onClose }: AddProductModalProps) {
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
  const [error, setError] = useState('');

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
    setError('');

    if (!imageFile) {
      setError('Please select an image file');
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
      onClose();
    } catch (err: any) {
      console.error('Failed to add product:', err);
      setError(err.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold">Add New Product</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="e.g. Wireless Mouse" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU <span className="text-red-500">*</span></label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="PRD-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white">
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
              <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Purchase Price ($) <span className="text-red-500">*</span></label>
              <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} step="0.01" min="0" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Selling Price ($) <span className="text-red-500">*</span></label>
              <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} step="0.01" min="0" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="0.00" />
            </div>
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Image <span className="text-red-500">*</span></label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" required />
            <p className="text-xs text-gray-500 mt-2">Image upload is required while creating a product.</p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
