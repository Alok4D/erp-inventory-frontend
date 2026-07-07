import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useSignupMutation } from '../../../redux/features/auth/authApi';
import { useState } from 'react';

export default function Signup() {
  
  const { register, handleSubmit } = useForm();
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const onSubmit = async (data: any) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      
      const payload = {
        password: data.password,
        user: {
          name: data.name,
          email: data.email,
          role: data.role,
        }
      };

      await signup(payload).unwrap();
      
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to create account');
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
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">Join Mini ERP</h1>
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
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center font-medium">
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm text-center font-medium">
              {successMsg}
            </div>
          )}

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
              <input 
                type="password" 
                {...register('password', { required: true })}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || successMsg !== ''}
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
