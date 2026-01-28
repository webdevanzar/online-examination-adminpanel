import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "../components/InputField";
import { AdminLoginSchema, type AdminLoginSchemaType } from "../zodschemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminGoogleAuth, useAdminLogin } from "../services/auth";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  Chrome,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export const Login = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useAdminLogin();
  const { googleLogin, isPending: googlePending } = useAdminGoogleAuth();

  const methods = useForm<AdminLoginSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = (data: AdminLoginSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Welcome back! Login successful");
        navigate("/");
      },
      onError: (error: unknown) => {
        const err = error as AxiosError<{ message: string }>;
        const msg =
          err.response?.data?.message ||
          "Invalid credentials, please try again";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Decorative Side - Desktop Only */}
      <div className="hidden lg:flex relative bg-slate-900 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#3b82f6_0%,transparent_50%),radial-gradient(circle_at_70%_80%,#6366f1_0%,transparent_50%)] opacity-20" />
        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-10 mx-auto"
          >
            <ShieldCheck size={48} className="text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-black text-white leading-tight mb-6"
          >
            Manage your exams with{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-400">
              precision.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-400 text-lg font-medium leading-relaxed"
          >
            Access the advanced administrator dashboard to create, monitor, and
            analyze examinations seamlessly.
          </motion.p>
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <LogIn size={24} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Secure Access</p>
              <p className="text-slate-400 text-xs font-medium">
                Enterprise-grade proctoring system
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="flex items-center justify-center p-8 bg-slate-50/50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500 font-medium">
              Please enter your credentials to continue
            </p>
          </div>

          <FormProvider {...methods}>
            <form
              className="space-y-6"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              {/* Email */}
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute left-4 top-[38px] text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
                    <Mail size={18} />
                  </div>
                  <InputField
                    name={"email"}
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    className="pl-11"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute left-4 top-[38px] text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
                    <Lock size={18} />
                  </div>
                  <InputField
                    name={"password"}
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11"
                  />
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      {...methods.register("rememberMe")}
                      className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer appearance-none checked:bg-blue-600 checked:border-blue-600"
                    />
                    <ShieldCheck
                      size={12}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 opacity-0 group-has-checked:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {isPending ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-50 px-4 text-slate-400 font-black tracking-widest">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google button */}
              <button
                type="button"
                onClick={() => googleLogin()}
                disabled={googlePending}
                className="w-full border-2 border-slate-200 py-4 rounded-2xl flex items-center justify-center gap-3 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all font-black text-slate-700 shadow-sm"
              >
                <Chrome size={20} className="text-slate-600" />
                Google Account
              </button>
            </form>
          </FormProvider>

          {/* Footer */}
          <p className="text-center text-sm mt-10 font-bold text-slate-500">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-black decoration-2 hover:underline underline-offset-4 transition-all"
            >
              Sign up today
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
