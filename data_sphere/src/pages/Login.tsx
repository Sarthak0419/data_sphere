import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-r from-gray-200 to-blue-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 hover:bg-white/30 rounded-full transition-colors"
      >
        <X size={28} className="text-gray-700" />
      </button>

      {/* Container */}
      <div className="relative w-[850px] h-[550px] bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden">
        
        {/* Login Form */}
        <div
          className={`absolute w-1/2 h-full flex items-center px-10 transition-all duration-[600ms] ease-in-out ${
            isActive ? 'invisible opacity-0 right-1/2' : 'visible opacity-100 right-0'
          }`}
          style={{ transitionDelay: isActive ? '0s' : '1.2s' }}
        >
          <form className="w-full" onSubmit={(e) => e.preventDefault()}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
            
            <div className="relative my-6">
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl"></i>
            </div>
            
            <div className="relative my-6">
              <input
                type="password"
                placeholder="Password"
                required
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
              className="w-full h-12 bg-[#7494ec] hover:bg-[#5a7de0] rounded-lg text-white font-semibold cursor-pointer transition-colors"
            >
              Login
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
          <form className="w-full" onSubmit={(e) => e.preventDefault()}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Registration</h1>
            
            <div className="relative my-5">
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl"></i>
            </div>
            
            <div className="relative my-5">
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="bx bxs-envelope absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl"></i>
            </div>
            
            <div className="relative my-5">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl"></i>
            </div>
            
            <button
              type="submit"
              className="w-full h-12 bg-[#7494ec] hover:bg-[#5a7de0] rounded-lg text-white font-semibold cursor-pointer transition-colors"
            >
              Register
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
        <div className="absolute w-full h-full overflow-hidden">
          {/* Blue background slider */}
          <div
            className={`absolute w-[300%] h-full bg-[#7494ec] rounded-[150px] transition-all duration-[1800ms] ease-in-out ${
              isActive ? 'left-1/2' : 'left-[-250%]'
            }`}
          ></div>

          {/* Left Panel - Show when not active */}
          <div
            className={`absolute left-0 w-1/2 h-full flex flex-col items-center justify-center text-white px-10 z-10 transition-opacity duration-500 ${
              isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
