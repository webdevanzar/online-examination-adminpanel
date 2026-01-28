import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InputField } from "../components/InputField";
import type z from "zod";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { AdminRegisterSchema } from "../zodschemas";
import { useAdminGoogleAuth, useAdminRegister } from "../services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Chrome,
  Camera,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export const Signup = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const { googleLogin, isPending: googlePending } = useAdminGoogleAuth();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
    setProfileFile(file);
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileFile(null);
  };

  const methods = useForm<z.infer<typeof AdminRegisterSchema>>({
    mode: "onChange",
    resolver: zodResolver(AdminRegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useAdminRegister();

  const onSubmit = (data: z.infer<typeof AdminRegisterSchema>) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    if (profileFile) formData.append("profileImage", profileFile);

    mutate(formData, {
      onSuccess: () => {
        toast.success("Account created! Welcome aboard");
        navigate("/login");
      },
      onError: (error: unknown) => {
        const err = error as AxiosError<{ message: string }>;
        const msg =
          err.response?.data?.message ||
          "Registration failed, please try again";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Decorative Side - Desktop Only */}
      <div className="hidden lg:flex relative bg-slate-900 overflow-hidden items-center justify-center p-12 order-last lg:order-first">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#3b82f6_0%,transparent_50%),radial-gradient(circle_at_30%_80%,#6366f1_0%,transparent_50%)] opacity-20" />
        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-10 mx-auto"
          >
            <UserPlus size={48} className="text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-black text-white leading-tight mb-6"
          >
            Empower your{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-400">
              academic
            </span>{" "}
            vision.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-400 text-lg font-medium leading-relaxed"
          >
            Join our enterprise-grade examination network. Manage results,
            proctor content, and scale your assessments globally.
          </motion.p>
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">
                Enterprise Identity
              </p>
              <p className="text-slate-400 text-xs font-medium">
                Verified administrator credentials
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Form Side */}
      <div className="flex items-center justify-center p-8 bg-slate-50/50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md py-12"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-slate-500 font-medium">
              Start managing your examinations today
            </p>
          </div>

          <FormProvider {...methods}>
            <form
              className="space-y-6"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              {/* Profile Upload Section */}
              <div className="flex flex-col items-center lg:items-start mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-4xl bg-white border-2 border-slate-200 shadow-sm overflow-hidden flex items-center justify-center group-hover:border-blue-500 transition-all">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera
                        size={32}
                        className="text-slate-300 group-hover:text-blue-500 transition-colors"
                      />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 active:scale-90 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Camera size={18} />
                  </label>
                  {profileImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 active:scale-90 transition-all border-2 border-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {!profileImage && (
                  <p className="mt-3 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                    Upload Avatar (Optional)
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute left-4 top-[38px] text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
                    <User size={18} />
                  </div>
                  <InputField
                    name={"fullName"}
                    label="Full Name"
                    placeholder="Ex: Alexander Pierce"
                    className="pl-11"
                  />
                </div>
              </div>

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

              {/* Password Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="relative group">
                  <div className="absolute left-4 top-[38px] text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
                    <Lock size={18} />
                  </div>
                  <InputField
                    name={"confirmPassword"}
                    label="Confirm"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11"
                  />
                </div>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {isPending ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
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
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Google Signup */}
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

          <p className="text-center text-sm mt-10 font-bold text-slate-500">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-black decoration-2 hover:underline underline-offset-4 transition-all"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
