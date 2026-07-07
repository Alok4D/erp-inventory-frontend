import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useCreateRoleMutation, useUpdateRoleMutation } from '../../../redux/features/role/roleApi';
import { toast } from 'sonner';


interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: any;
}

const AVAILABLE_PERMISSIONS = [
  'view_dashboard',
  'create_product',
  'view_products',
  'update_product',
  'delete_product',
  'create_sale',
  'view_sales',
  'delete_sale',
  'manage_roles',
];

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  useEffect(() => {
    if (role) {
      setName(role.name);
      setPermissions(role.permissions || []);
    } else {
      setName('');
      setPermissions([]);
    }
  }, [role]);

  if (!isOpen) return null;

  const isSystemRole = role && ['admin', 'manager', 'employee'].includes(role.name.toLowerCase());

  const handleTogglePermission = (perm: string) => {
    setPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      if (role) {
        await updateRole({ id: role._id, data: { name, permissions } }).unwrap();
        toast.success('Role updated successfully');
      } else {
        await createRole({ name, permissions }).unwrap();
        toast.success('Role created successfully');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to save role');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-md transform overflow-hidden rounded-xs bg-white p-6 text-left shadow-xl transition-all">
          <div className="absolute right-4 top-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {role ? 'Edit Role' : 'Create New Role'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSystemRole}
                className="w-full px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g. Supervisor"
              />
              {isSystemRole && (
                <p className="text-xs text-amber-600 mt-1">System role names cannot be changed.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                {AVAILABLE_PERMISSIONS.map(perm => (
                  <label key={perm} className="flex items-center p-3 border border-gray-100 rounded-none cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={permissions.includes(perm)}
                        onChange={() => handleTogglePermission(perm)}
                      />
                      <div className={`w-5 h-5 rounded-none border flex items-center justify-center ${permissions.includes(perm) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                        {permissions.includes(perm) && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <span className="ml-3 text-sm text-gray-700 capitalize">
                      {perm.replace(/_/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-none hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-none hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save Role'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
