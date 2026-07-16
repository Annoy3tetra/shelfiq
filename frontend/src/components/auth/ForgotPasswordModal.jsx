import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  X,
  Loader2,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { forgotPassword } from "../../services/authService";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: 0.15 },
  },
};

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("form"); // "form" | "success"
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "" } });

  const handleClose = () => {
    onClose();
    // Reset state after exit animation
    setTimeout(() => {
      setStep("form");
      setApiError("");
      reset();
    }, 200);
  };

  const onSubmit = async (data) => {
    setApiError("");
    try {
      await forgotPassword(data.email);
      setStep("success");
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        "Something went wrong. Please try again.";
      setApiError(msg);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:p-8 dark:border-slate-800 dark:bg-slate-900"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <AnimatePresence mode="wait">
              {step === "form" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Header */}
                  <div className="mb-6">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      Reset your password
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Enter your email address and we&apos;ll send you a link to
                      reset your password.
                    </p>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {apiError && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400"
                      >
                        {apiError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                      <label
                        htmlFor="forgot-email"
                        className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Mail className="h-4.5 w-4.5" />
                        </div>
                        <input
                          id="forgot-email"
                          type="email"
                          autoFocus
                          disabled={isSubmitting}
                          placeholder="name@company.com"
                          className={`w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950 ${
                            errors.email
                              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                              : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          }`}
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value:
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/10 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-blue-600/50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send reset link</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Back link */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to sign in
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-center"
                >
                  {/* Success animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                      delay: 0.1,
                    }}
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40"
                  >
                    <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>

                  <h2 className="mb-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Check your email
                  </h2>
                  <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                    If an account with that email exists, we&apos;ve sent a
                    password reset link. The link expires in 15 minutes.
                  </p>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Back to sign in
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
