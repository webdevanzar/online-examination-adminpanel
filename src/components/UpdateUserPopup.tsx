import  { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "./InputField";

interface UserData {
  username: string;
  email: string;
  phone: string;
  profile: string | File;
}

interface UpdateUserPopupProps {
  user: UserData;
  onClose: () => void;
  onUpdate: (data: UserData) => void;
}

const UpdateUserPopup = ({ user, onClose, onUpdate }: UpdateUserPopupProps) => {
  const [formData, setFormData] = useState<UserData>({
    username: user.username,
    email: user.email,
    phone: user.phone,
    profile: user.profile,
  });

  const [preview, setPreview] = useState<string>(
    typeof user.profile === "string" ? user.profile : ""
  );

  type FormValues = {
    username: string;
    email: string;
    phone: string;
  };

  const methods = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
  });

  // Handle Image Upload
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Update User
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={preview}
            alt="profile"
            className="w-24 h-24 rounded-full border object-cover mb-2"
          />
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>

        {/* Inputs */}
        <FormProvider {...methods}>
          <div className="grid gap-3">
            <InputField
              name={"username"}
              label="Username"
              placeholder="Username"
              rules={{ required: "Username is required" }}
            />

            <InputField
              name={"email"}
              label="Email"
              type="email"
              placeholder="Email"
              rules={{ required: "Email is required" }}
            />

            <InputField
              name={"phone"}
              label="Phone Number"
              placeholder="Phone"
              rules={{ required: "Phone is required" }}
            />
          </div>
        </FormProvider>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              const values = methods.getValues();
              onUpdate({ ...formData, ...values });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserPopup;
