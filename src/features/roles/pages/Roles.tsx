import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useGetAllRolesQuery, useDeleteRoleMutation } from '../../../redux/features/role/roleApi';
import { RoleModal } from '../components/RoleModal';
import { useAppSelector } from '../../../redux/hooks';
import { Skeleton } from '../../../components/ui/skeleton';

export default function Roles() {
  const { data: rolesResponse, isLoading } = useGetAllRolesQuery({});
  const [deleteRole] = useDeleteRoleMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  
  const user = useAppSelector((state) => state.auth.user);
  const canManageRoles = user?.permissions?.includes('manage_roles') || user?.role === 'admin';

  if (!canManageRoles) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }

  const handleDelete = async (id: string, name: string) => {
    if (['admin', 'manager', 'employee'].includes(name.toLowerCase())) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Cannot delete system default roles',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteRole(id).unwrap();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Role deleted successfully',
          showConfirmButton: false,
          timer: 1500
        });
      } catch (err: any) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: err.data?.message || 'Failed to delete role',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  };

  const handleEdit = (role: any) => {
    if (['admin'].includes(role.name.toLowerCase())) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Cannot edit the master Admin role',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const roles = rolesResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system roles and access control</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-none hover:bg-indigo-700 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Role
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
                  <th className="px-6 py-4"><Skeleton className="h-4 w-32" /></th>
                  <th className="px-6 py-4 flex justify-end"><Skeleton className="h-4 w-16" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap md:whitespace-normal">Role Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 min-w-[280px]">Permissions</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right whitespace-nowrap md:whitespace-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roles.map((role: any) => (
                  <tr key={role._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap md:whitespace-normal">
                      <span className="inline-flex items-center px-3 py-1 rounded-none text-sm font-medium bg-indigo-100 text-indigo-800 capitalize">
                        {role.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 min-w-[280px]">
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm: string) => (
                          <span key={perm} className="inline-flex items-center px-2.5 py-1 rounded-none text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                            {perm.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {role.permissions.length === 0 && <span className="text-gray-400 text-sm italic">No permissions</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap md:whitespace-normal">
                      {role.name.toLowerCase() !== 'admin' && (
                        <button
                          onClick={() => handleEdit(role)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                          title="Edit Role"
                        >
                          <Edit className="w-5 h-5 inline" />
                        </button>
                      )}
                      {!['admin', 'manager', 'employee'].includes(role.name.toLowerCase()) && (
                        <button
                          onClick={() => handleDelete(role._id, role.name)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Delete Role"
                        >
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {roles.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500 text-lg">
                      No roles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <RoleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          role={selectedRole}
        />
      )}
    </div>
  );
}
