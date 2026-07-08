import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useSignupMutation } from '../../../redux/features/auth/authApi';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Signup() {
  const { register, handleSubmit } = useForm();
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        password: data.password,
        user: {
          name: data.name,
          email: data.email,
          role: data.role,
        }
      };

      await signup(payload).unwrap();
      
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Account created successfully!',
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: err?.data?.message || 'Failed to create account',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Image/Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-indigo-600">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
            alt="Dashboard Analytics" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">Join Smart ERP</h1>
          <p className="text-xl text-indigo-100 max-w-lg leading-relaxed">
            Create an account to start managing your inventory and boosting your sales efficiently.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
            <p className="text-gray-500 text-sm">Fill in the details below to get started.</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input 
                type="text" 
                {...register('name', { required: true })}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                placeholder="John Doe" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                {...register('email', { required: true })}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                placeholder="admin@erp.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <select 
                {...register('role', { required: true })}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  {...register('password', { required: true })}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12" 
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
