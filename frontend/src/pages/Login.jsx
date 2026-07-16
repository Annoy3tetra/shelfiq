import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User,
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Layers 
} from "lucide-react";

import { loginUser, registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { ShelfIQLogo, ShelfIQIcon } from "../components/ui/Logo";

const floatingItems = [
  { Icon: ShelfIQIcon, size: 24, top: "15%", left: "15%", delay: 0, duration: 8 },
  { Icon: TrendingUp, size: 28, top: "25%", left: "80%", delay: 2, duration: 10 },
  { Icon: BarChart3, size: 20, top: "60%", left: "10%", delay: 4, duration: 9 },
  { Icon: Layers, size: 22, top: "75%", left: "75%", delay: 1, duration: 11 },
  { Icon: Sparkles, size: 18, top: "45%", left: "50%", delay: 3, duration: 7 },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "admin",
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    setApiError("");
    try {
      if (isSignUp) {
        // Register new user
        await registerUser(data.name, data.email, data.password, data.role);
      }
      
      // Perform Sign In
      const response = await loginUser(data.email, data.password);
      login(response.access_token);
      
      // If remember me is checked, store email
      if (data.rememberMe) {
        localStorage.setItem("remembered_email", data.email);
      } else {
        localStorage.removeItem("remembered_email");
      }
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth action failed:", error);
      const errorMsg = error.response?.data?.detail || "Authentication failed. Please verify credentials or contact system admin.";
      setApiError(errorMsg);
    }
  };

  const handleModeToggle = () => {
    setIsSignUp(!isSignUp);
    setApiError("");
    reset(); // Clear previous validations and values
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-200"
    >
      {/* Left Section - Hero/Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] overflow-hidden items-center justify-center p-12 select-none">
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", 
            backgroundSize: "24px 24px" 
          }} 
        />
        
        {/* Abstract glowing blobs for premium feel */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/10 to-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-600/10 to-blue-500/10 blur-3xl pointer-events-none" />

        {/* Floating background elements */}
        {floatingItems.map((item, index) => {
          const { Icon, size, top, left, delay, duration } = item;
          return (
            <motion.div
              key={index}
              style={{ position: "absolute", top, left, color: "rgba(148, 163, 184, 0.15)" }}
              animate={{ 
                y: [0, -20, 0], 
                x: [0, 10, 0], 
                rotate: [0, 8, -8, 0] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration, 
                delay, 
                ease: "easeInOut" 
              }}
            >
              <Icon size={size} />
            </motion.div>
          );
        })}

        {/* Content Box */}
        <div className="relative z-10 max-w-lg w-full flex flex-col justify-between h-full">
          {/* Logo & Product Name */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ShelfIQLogo />
          </motion.div>

          {/* Copywriting */}
          <div className="my-auto py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Premium Bookstore Solution
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight"
            >
              The Intelligent OS for <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Modern Bookstores
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-slate-400 text-lg leading-relaxed mb-8"
            >
              Streamline bookstore operations, optimize inventory, forecast sales, and manage financials — all in one unified, real-time platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((n) => (
                  <img 
                    key={n}
                    src={`https://images.unsplash.com/photo-${1500000000000 + n * 100000}?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80`} 
                    alt={`User avatar ${n}`}
                    className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=48&h=48&q=80";
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-400 font-medium">
                Trusted by 500+ independent book retailers globally.
              </p>
            </motion.div>
          </div>

          {/* Footer inside Left Panel */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-slate-500 flex justify-between"
          >
            <span>&copy; {new Date().getFullYear()} ShelfIQ Inc.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Login/Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-[440px]">
          {/* Logo visible on Mobile only */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <ShelfIQLogo showText={true} darkText={true} />
          </div>

          {/* Welcome Header */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-455">
              {isSignUp ? "Register a new operator profile" : "Sign in to manage your bookstore dashboard"}
            </p>
          </div>

          {/* Error Alert Box */}
          <AnimatePresence>
            {apiError && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 dark:bg-red-950/20 dark:border-red-900/30 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
                <div className="text-sm text-red-700 dark:text-red-400 leading-normal font-medium">
                  {apiError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(15,23,42,0.03)] dark:bg-slate-900 dark:border-slate-800"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Full Name Field (Sign Up Mode Only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      disabled={isSubmitting}
                      placeholder="Sarah Jenkins"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none text-slate-900 placeholder:text-slate-400 focus:bg-white dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950
                        ${errors.name 
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                          : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        }`}
                      {...register("name", { 
                        required: "Full name is required"
                      })}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    disabled={isSubmitting}
                    placeholder="name@company.com"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none text-slate-900 placeholder:text-slate-400 focus:bg-white dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950
                      ${errors.email 
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      }`}
                    {...register("email", { 
                      required: "Email address is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {!isSignUp && (
                    <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    disabled={isSubmitting}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none text-slate-900 placeholder:text-slate-400 focus:bg-white dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950
                      ${errors.password 
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      }`}
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 5,
                        message: "Password must be at least 5 characters"
                      }
                    })}
                  />
                  <button
                    type="button"
                    tabIndex="-1"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-655 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Operator Role Selector (Sign Up Mode Only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Operator Role
                  </label>
                  <select
                    id="role"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all outline-none text-slate-900 focus:bg-white dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-100 dark:focus:bg-slate-950 cursor-pointer font-medium"
                    {...register("role")}
                  >
                    <option value="admin" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Admin</option>
                    <option value="staff" className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">Staff</option>
                  </select>
                </div>
              )}

              {/* Remember Me (Sign In Mode Only) */}
              {!isSignUp && (
                <div className="flex items-center py-1">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0 transition-colors cursor-pointer"
                    {...register("rememberMe")}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-400 select-none cursor-pointer">
                    Remember this device
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.99] transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isSignUp ? "Creating account..." : "Signing in..."}</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Link inside the Card */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={handleModeToggle}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </motion.div>

          {/* Prompt to switch accounts or registration placeholder if relevant */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              Need assistance? Contact your bookstore administrator or{" "}
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;