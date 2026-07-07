import { useState } from "react";
import { ShoppingCart, History } from "lucide-react";
import { SalesHistory } from "../components/SalesHistory";
import { CreateSale } from "../components/CreateSale";

export default function Sales() {
  
  const [activeTab, setActiveTab] = useState<'history' | 'create'>('history');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Sales Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
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

      {activeTab === 'history' ? <SalesHistory /> : <CreateSale />}
    </div>
  );
}
