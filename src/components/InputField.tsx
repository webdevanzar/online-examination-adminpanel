import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { Path } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  rules?: object;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const InputField = <T extends FieldValues>({
  name,
  label,
  rules = {},
  type = "text",
  placeholder = "",
  disabled = false,
  className = "",
}: InputFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const { control } = useFormContext<T>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <div className="relative">
            <input
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value || "" )} // Force empty string instead of undefined
              type={type === "password" && showPassword ? "text" : type}
              placeholder={placeholder}
              disabled={disabled}
              className={`mt-1 block w-full px-3 py-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:border-blue-500 ${
                disabled ? "bg-gray-100 cursor-not-allowed" : ""
              } ${className}`}
            />

            {type === "password" && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>  
            )}
          </div>
          {error && (
            <span className="absolute left-10 -bottom-2 px-2 bg-white text-red-500 text-[10px]">
              {error.message || "This field is required"}
            </span>
          )}
        </div>
      )}
    />
  );
};
