import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { UserCircle, X } from 'lucide-react';

export const Login: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(true);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const { login, register, isAuthenticated, accounts, switchAccount, logoutAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, or default to drive
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/drive/my-drive';
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login(loginEmail, loginPassword);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await register(registerUsername, registerEmail, registerPassword);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Registration failed');
    }
    setIsLoading(false);
  };

  const handleSwitchToAccount = (userId: string) => {
    switchAccount(userId);
    navigate(from, { replace: true });
  };

  // Show account picker if there are existing accounts
  if (accounts.length > 0 && showAccountPicker) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-r from-gray-200 to-blue-200">
        <div className="w-[400px] bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <h1 className="text-2xl font-bold">Choose an account</h1>
            <p className="text-blue-100 mt-1">to continue to Data Sphere</p>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {accounts.map(session => (
              <div
                key={session.user.id}
                className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 group"
              >
                <div 
                  className="flex-1 flex items-center gap-3"
                  onClick={() => handleSwitchToAccount(session.user.id)}
                >
                  {session.user.profilePic ? (
                    <img 
                      src={session.user.profilePic} 
                      alt={session.user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle size={48} className="text-gray-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{session.user.username}</p>
                    <p className="text-sm text-gray-500 truncate">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    logoutAccount(session.user.id);
                  }}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-full transition-all"
                  title="Remove account"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setShowAccountPicker(false)}
              className="w-full py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
            >
              Use another account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-r from-gray-200 to-blue-200">
      {/* Back to account picker button */}
      {accounts.length > 0 && (
        <button
          onClick={() => setShowAccountPicker(true)}
          className="absolute top-6 left-6 px-4 py-2 bg-white/80 hover:bg-white rounded-lg shadow-md transition-colors text-gray-700 text-sm font-medium"
        >
          ← Back to accounts
        </button>
      )}

      {/* Container */}
      <div className="relative w-[850px] h-[550px] bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden">
        
        {/* Login Form */}
        <div
          className={`absolute w-1/2 h-full flex items-center px-10 transition-all duration-[600ms] ease-in-out ${
            isActive ? 'invisible opacity-0 right-1/2' : 'visible opacity-100 right-0'
          }`}
          style={{ transitionDelay: isActive ? '0s' : '1.2s' }}
        >
          <form className="w-full" onSubmit={handleLogin}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
            
            {error && !isActive && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="relative my-6">
              <input
                type="email"
                placeholder="Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="bx bxs-envelope absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl"></i>
            </div>
            
            <div className="relative my-6">
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl"></i>
            </div>
            
            <div className="text-right mb-4">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#7494ec] hover:bg-[#5a7de0] rounded-lg text-white font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <p className="text-center text-gray-600 text-sm mt-6 mb-4">or login with social platforms</p>
            
            <div className="flex justify-center gap-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <i className="bx bxl-google text-xl text-gray-700"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <i className="bx bxl-facebook text-xl text-gray-700"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <i className="bx bxl-github text-xl text-gray-700"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <i className="bx bxl-linkedin text-xl text-gray-700"></i>
              </a>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div
          className={`absolute right-0 w-1/2 h-full flex items-center px-10 transition-all duration-[600ms] ease-in-out ${
            isActive ? 'visible opacity-100 right-1/2' : 'invisible opacity-0 right-0'
          }`}
          style={{ transitionDelay: isActive ? '1.2s' : '0s' }}
        >
          <form className="w-full" onSubmit={handleRegister}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Registration</h1>
            
            {error && isActive && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="relative my-5">
              <input
                type="text"
                placeholder="Username"
                required
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl"></i>
            </div>
            
            <div className="relative my-5">
              <input
                type="email"
                placeholder="Email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="bx bxs-envelope absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl"></i>
            </div>
            
            <div className="relative my-5">
              <input
                type="password"
                placeholder="Password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl"></i>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#7494ec] hover:bg-[#5a7de0] rounded-lg text-white font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
            
            <p className="text-center text-gray-600 text-sm mt-6 mb-4">or register with social platforms</p>
            
            <div className="flex justify-center gap-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <i className="bx bxl-google text-xl text-gray-700"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <i className="bx bxl-facebook text-xl text-gray-700"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <i className="bx bxl-github text-xl text-gray-700"></i>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <i className="bx bxl-linkedin text-xl text-gray-700"></i>
              </a>
            </div>
          </form>
        </div>

        {/* Toggle Box */}
        <div className="absolute w-full h-full overflow-hidden pointer-events-none">
          {/* Blue background slider */}
          <div
            className={`absolute w-[300%] h-full bg-[#7494ec] rounded-[150px] transition-all duration-[1800ms] ease-in-out ${
              isActive ? 'left-1/2' : 'left-[-250%]'
            }`}
          ></div>

          {/* Left Panel - Show when not active */}
          <div
            className={`absolute left-0 w-1/2 h-full flex flex-col items-center justify-center text-white px-10 z-10 transition-opacity duration-500 ${
              isActive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
            }`}
          >
            <h1 className="text-3xl font-bold mb-4">Hello, Welcome!</h1>
            <p className="text-lg mb-6">Don't have an account?</p>
            <button
              onClick={() => setIsActive(true)}
              className="px-8 py-2 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-[#7494ec] transition-colors"
            >
              Register
            </button>
          </div>

          {/* Right Panel - Show when active */}
          <div
            className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center text-white px-10 z-10 transition-opacity duration-500 ${
              isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-lg mb-6">Already have an account?</p>
            <button
              onClick={() => setIsActive(false)}
              className="px-8 py-2 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-[#7494ec] transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
