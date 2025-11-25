import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InputField } from "../components/InputField";
import type z from "zod";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { AdminRegisterSchema } from "../zodschemas";
import { useAdminRegister } from "../services/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export const Signup = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
    setProfileFile(file);
  };

  const removeImage = () => {
    setProfileImage(null);
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
        toast.success("Registered successfully");
        navigate("/login");
      },
      onError: (error: unknown) => {
        const err = error as AxiosError<{ message: string }>;
        const msg = err.response?.data?.message || "Something went wrong";
        toast.error(msg);
      },
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        {/* Profile Upload Section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Blue Close Icon – appears only when image exists */}
            {profileImage && (
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow"
              >
                ✕
              </button>
            )}

            {/* Upload Frame */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Circle */}
              <div
                className="
                w-24 h-24 rounded-full 
                flex items-center justify-center 
                overflow-hidden shadow-md
                border-2 border-gray-300 
                hover:border-blue-600 border-dashed
              "
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-sm">Upload</span>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold">Sign up</h1>
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form className="space-y-5" onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Full Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputField
                  name={"fullName"}
                  label="Full Name"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <InputField
                  name={"email"}
                  label="Email"
                  type="email"
                  placeholder="Enter email"
                />
              </div>
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputField
                  name={"password"}
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <InputField
                  name={"confirmPassword"}
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              {isPending ? "Signing Up..." : "Sign up"}
            </button>

            {/* Google Signup */}
            <button
              type="button"
              className="w-full border py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5"
              />
              Sign up with Google
            </button>
          </form>
        </FormProvider>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
