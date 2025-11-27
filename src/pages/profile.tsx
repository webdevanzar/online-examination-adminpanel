import { Mail, Camera, Save, X, Trash2, Edit, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  useAdminProfileUpdate,
  useAddAdminProfileImage,
  useDeleteAdminProfileImage,
} from "../services/auth";
import { toast } from "sonner";

// Only allow name and email on client; image is handled as FormData file
const ClientUpdateSchema = z.object({
  fullName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

type FormValues = z.infer<typeof ClientUpdateSchema> & {
  profileImage?: FileList;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { fullName, email, profileImage } = useSelector(
    (s: RootState) => s.auth
  );

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(
    undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputId = "profileImageInput";

  const { mutate: updateProfile, isPending: isUpdating } =
    useAdminProfileUpdate();
  const { mutate: addProfileImage, isPending: isUploading } =
    useAddAdminProfileImage();
  const { mutate: deleteProfileImage, isPending: isDeleting } =
    useDeleteAdminProfileImage();

  const defaultValues = useMemo(
    () => ({
      fullName: fullName || "",
      email: email || "",
    }),
    [fullName, email]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(ClientUpdateSchema),
    defaultValues,
  });

  const {
    ref: profileImageFieldRef,
    onChange: profileImageRHFOnChange,
    ...profileImageRegister
  } = register("profileImage");

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    let hasChanges = false;

    if (values.fullName && values.fullName !== fullName) {
      formData.append("fullName", values.fullName);
      hasChanges = true;
    }
    if (values.email && values.email !== email) {
      formData.append("email", values.email);
      hasChanges = true;
    }
    const files = values.profileImage;
    if (files && files.length > 0) {
      formData.append("profileImage", files[0]);
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    updateProfile(formData, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setSelectedImageUrl(undefined);
        setSelectedFile(null);
        setFileInputKey((k) => k + 1);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed (JPEG, PNG, etc.)");
      setFileInputKey((k) => k + 1);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      setFileInputKey((k) => k + 1);
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedImageUrl(url);
    // mark form dirty with file and enter edit mode
    setValue("profileImage", e.target.files as FileList, { shouldDirty: true });
    setSelectedFile(file);
    setIsEditing(true);
  };

  const handleUploadSelectedImage = () => {
    if (!selectedFile) {
      toast.info("Please select an image first");
      return;
    }
    const fd = new FormData();
    fd.append("profileImage", selectedFile);
    addProfileImage(fd, {
      onSuccess: () => {
        toast.success("Profile image uploaded");
        setSelectedImageUrl(undefined);
        setSelectedFile(null);
        setIsEditing(false);
        setFileInputKey((k) => k + 1);
      },
    });
  };

  const handleRemoveImage = () => {
    if (
      !window.confirm("Are you sure you want to delete your profile image?")
    ) {
      return;
    }

    deleteProfileImage(undefined, {
      onSuccess: () => {
        toast.success("Profile image deleted successfully");
        setSelectedImageUrl(undefined);
        setSelectedFile(null);
        setFileInputKey((k) => k + 1);
      },
      onError: () => {
        toast.error("Failed to delete profile image");
      },
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Profile</h1>
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <form
            className="p-6 md:p-8 space-y-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Avatar */}
            <div className="flex items-start gap-6">
              <div>
                <img
                  src={
                    selectedImageUrl ||
                    profileImage ||
                    (fullName
                      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          fullName
                        )}`
                      : "")
                  }
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border border-gray-200 shadow-sm bg-white cursor-pointer hover:ring-2 hover:ring-blue-500"
                  onClick={() => document.getElementById(fileInputId)?.click()}
                />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={fileInputId}
                  key={fileInputKey}
                  {...profileImageRegister}
                  onChange={(e) => {
                    profileImageRHFOnChange(e);
                    handleFileChange(e);
                  }}
                  ref={(e) => {
                    profileImageFieldRef(e);
                  }}
                />
                {selectedImageUrl || profileImage ? (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 w-max"
                  >
                    <Trash2 size={16} /> Delete Profile Image
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      document.getElementById(fileInputId)?.click();
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 w-max"
                    aria-label="Upload profile image"
                  >
                    <Camera size={16} /> Upload Image
                  </button>
                )}
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleUploadSelectedImage}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 w-max"
                  >
                    <Upload size={16} /> Upload Selected Image
                  </button>
                )}
                <p className="text-xs text-gray-500">JPEG/PNG up to 5MB.</p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Your full name"
                  {...register("fullName")}
                  disabled={!isEditing}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fullName.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="you@example.com"
                    {...register("email")}
                    disabled={!isEditing}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Edit size={18} /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      reset(defaultValues);
                      setSelectedImageUrl(undefined);
                      setSelectedFile(null);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating || (!isDirty && !selectedImageUrl)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
