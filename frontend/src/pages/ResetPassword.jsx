import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import { resetPassword } from "../services/authService";
import { ShelfIQLogo } from "../components/ui/Logo";

/** Compute a 0–4 strength score from a password string. */
const getPasswordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 5) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
};

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = [
  "bg-slate-200 dark:bg-slate-700",
  "bg-red-500",
  "bg-amber-500",
  "bg-blue-500",
  "bg-emerald-500",
];

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState(token ? "form" : "invalid"); // "form" | "success" | "invalid"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: "", confirmPassword: "" } });

  const passwordValue = watch("password");
  const strength = useMemo(
    () => getPasswordStrength(passwordValue),
    [passwordValue]
  );

  const onSubmit = async (data) => {
    setApiError("");
    try {
      await resetPassword(token, data.password);
      setStep("success");
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (
        error.response?.status === 400 &&
        detail?.toLowerCase().includes("expired")
      ) {
        setStep("invalid");
      } else {
        setApiError(
          detail || "Something went wrong. Please try again."
        );
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4 transition-colors dark:bg-slate-950"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <ShelfIQLogo showText darkText />
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.03)] sm:p-8 dark:border-slate-800 dark:bg-slate-900"
        >
          <AnimatePresence mode="wait">
            {/* ─── Form ─── */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40">
                    <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Set a new password
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Choose a strong password that you haven&apos;t used before.
                  </p>
                </div>

                {/* API error */}
                <AnimatePresence>
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mb-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-950/20"
                    >
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                      <span className="text-sm font-medium leading-normal text-red-700 dark:text-red-400">
                        {apiError}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* New password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Lock className="h-4.5 w-4.5" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoFocus
                        disabled={isSubmitting}
                        placeholder="••••••••"
                        className={`w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950 ${
                          errors.password
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        }`}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 5,
                            message:
                              "Password must be at least 5 characters",
                          },
                        })}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.password.message}
                      </p>
                    )}

                    {/* Strength meter */}
                    {passwordValue && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2"
                      >
                        <div className="mb-1 flex gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                strength >= level
                                  ? strengthColors[strength]
                                  : "bg-slate-200 dark:bg-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className={`text-xs font-medium ${
                            strength <= 1
                              ? "text-red-600"
                              : strength === 2
                                ? "text-amber-600"
                                : strength === 3
                                  ? "text-blue-600"
                                  : "text-emerald-600"
                          }`}
                        >
                          {strengthLabels[strength]}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Lock className="h-4.5 w-4.5" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        disabled={isSubmitting}
                        placeholder="••••••••"
                        className={`w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950 ${
                          errors.confirmPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        }`}
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === passwordValue ||
                            "Passwords do not match",
                        })}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600"
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.confirmPassword.message}
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
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset password</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─── Success ─── */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
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
                  Password updated
                </h2>
                <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                  Your password has been reset successfully. You can now
                  sign in with your new password.
                </p>
                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/10 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.99]"
                >
                  <span>Sign in</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}

            {/* ─── Invalid / Expired Token ─── */}
            {step === "invalid" && (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 18,
                    delay: 0.1,
                  }}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40"
                >
                  <AlertCircle className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </motion.div>
                <h2 className="mb-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Link expired or invalid
                </h2>
                <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                  This password reset link has expired or has already been
                  used. Please request a new one.
                </p>
                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to sign in</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ShelfIQ Inc.
        </p>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
