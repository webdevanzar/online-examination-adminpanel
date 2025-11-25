import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "../components/InputField";
import { AdminLoginSchema, type AdminLoginSchemaType } from "../zodschemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminLogin } from "../services/auth";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {

  const navigate = useNavigate();

  const { mutate, isPending } = useAdminLogin();

  const methods = useForm<AdminLoginSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = (data: AdminLoginSchemaType) => {
     mutate(data, {
      onSuccess: () => {
        toast.success("Login successfully");
        navigate("/");
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
        <div className="mb-8">
          <p className="text-gray-600 mb-1">Please enter your details</p>
          <h1 className="text-3xl font-bold">Welcome back</h1>
        </div>

        <FormProvider {...methods}>
          <form className="space-y-5" onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <InputField
                name={"email"}
                label="Email address"
                type="email"
                placeholder="Enter email"
              />
            </div>

            {/* Password */}
            <div>
              <InputField
                name={"password"}
                label="Password"
                type="password"
                placeholder="Enter password"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...methods.register("rememberMe")} />
                Remember me
              </label>
              <button type="button" className="text-blue-600 hover:underline">
                Forgot password
              </button>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>

            {/* Google button */}
            <button
              type="button"
              className="w-full border py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </form>
        </FormProvider>

        {/* Footer */}
        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};
