import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUpdateProductMutation } from "../../../redux/features/product/productApi";
import Swal from "sweetalert2";

export default function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const isCustomCategory = product && !['electronics', 'clothing', 'furniture'].includes(product.category);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category: isCustomCategory ? '' : (product?.category || ''),
    stockQuantity: product?.stockQuantity?.toString() || '0',
    purchasePrice: product?.purchasePrice?.toString() || '0',
    sellingPrice: product?.sellingPrice?.toString() || '0',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(!!isCustomCategory);
  const [newCategory, setNewCategory] = useState(isCustomCategory ? product.category : '');

  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
  }, [product, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'category' && e.target.value === 'add_new_category') {
      setIsAddingNewCategory(true);
      setFormData({ ...formData, category: '' });
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const data = new FormData();
      if (imageFile) {
        data.append('image', imageFile);
      }
      
      const productData = {
        name: formData.name,
        sku: formData.sku,
        category: isAddingNewCategory ? newCategory : formData.category,
        stockQuantity: Number(formData.stockQuantity),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
      };
      
      data.append('data', JSON.stringify(productData));

      await updateProduct({ id: product._id, data }).unwrap();
      
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Product updated successfully!',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/products');
    } catch (err: any) {
      console.error('Failed to update product:', err);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: err.data?.message || 'Failed to update product',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 bg-gray-50/50 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-1">Update product information for {product.name}</p>
        </div>
        <button 
          type="button"
          onClick={() => navigate('/products')}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Product Information */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Product Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm" placeholder="e.g. N95 Respirator Face Mask" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                  <select 
                    name="category" 
                    value={isAddingNewCategory ? 'add_new_category' : formData.category} 
                    onChange={handleChange} 
                    required={!isAddingNewCategory} 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 transition-all bg-white text-sm text-gray-700 cursor-pointer shadow-sm"
                  >
                    <option value="" className="text-gray-500">Select category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="furniture">Furniture</option>
                    <option value="add_new_category" className="font-bold text-indigo-600 bg-indigo-50/50">+ Add New Category</option>
                  </select>
                  {isAddingNewCategory && (
                    <div className="mt-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 p-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
                      <input 
                        type="text" 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)} 
                        required 
                        autoFocus
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm shadow-sm" 
                        placeholder="Type new category name..." 
                      />
                      <button 
                        type="button" 
                        onClick={() => { setIsAddingNewCategory(false); setNewCategory(''); }}
                        className="p-2 text-indigo-400 hover:text-red-500 bg-white rounded-md hover:bg-red-50 border border-indigo-100 hover:border-red-200 transition-colors shadow-sm flex-shrink-0"
                        title="Cancel adding new category"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU / Model Number <span className="text-red-500">*</span></label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm" placeholder="e.g. N95-8210-20" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Purchase Price ($) <span className="text-red-500">*</span></label>
                  <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} step="0.01" min="0" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Selling Price ($) <span className="text-red-500">*</span></label>
                  <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} step="0.01" min="0" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity <span className="text-red-500">*</span></label>
                  <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} min="0" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm" placeholder="0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image and Actions */}
        <div className="w-full lg:w-[350px] space-y-6 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Image</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {imageFile || product.imageUrl ? (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : product.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate w-48">
                    {imageFile ? imageFile.name : 'Current Image'}
                  </span>
                  <span className="text-xs text-indigo-500 mt-1">Click to change image</span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Update Image</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center disabled:opacity-50 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
