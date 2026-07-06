import { X, Loader2, AlertTriangle } from "lucide-react";

interface DeleteProductModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteProductModal({ onClose, onConfirm, isLoading }: DeleteProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-900">Delete Product</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600">Are you sure you want to delete this product? This action cannot be undone.</p>
          
          <div className="flex justify-end space-x-3 pt-4 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
