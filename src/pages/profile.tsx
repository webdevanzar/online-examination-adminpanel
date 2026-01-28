import {
  Mail,
  Camera,
  Save,
  Trash2,
  Edit,
  Upload,
  User,
  ArrowLeft,
  Shield,
  ShieldCheck,
} from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

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
    (s: RootState) => s.auth,
  );

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(
    undefined,
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
    [fullName, email],
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

  const inputClasses =
    "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClasses = "block text-sm font-bold text-slate-700 mb-2 ml-1";

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl shadow-slate-200/50 rounded-4xl overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="bg-slate-900 p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#3b82f6_0%,transparent_50%)] opacity-20" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                  Account Settings
                </h1>
                <p className="text-slate-400 font-medium">
                  Manage your administrator profile and preferences
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all backdrop-blur-md border border-white/10"
              >
                <ArrowLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10">
            <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
              {/* Avatar Section */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <Camera size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 leading-none">
                    Profile Picture
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                  <div className="relative group">
                    <div
                      className="w-32 h-32 rounded-4xl bg-white border-2 border-slate-200 shadow-xl overflow-hidden flex items-center justify-center group-hover:border-blue-500 transition-all cursor-pointer"
                      onClick={() =>
                        document.getElementById(fileInputId)?.click()
                      }
                    >
                      <img
                        src={
                          selectedImageUrl ||
                          profileImage ||
                          (fullName
                            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                fullName,
                              )}&background=random&size=128`
                            : "")
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <ShieldCheck
                        size={12}
                        className="absolute left-1 text-white opacity-0 group-has-checked:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={32} className="text-white" />
                      </div>
                    </div>
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
                  </div>

                  <div className="flex flex-col gap-3 flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                      {selectedFile ? (
                        <button
                          type="button"
                          onClick={handleUploadSelectedImage}
                          disabled={isUploading}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 disabled:opacity-60 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {isUploading ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Upload size={18} />
                          )}
                          Complete Upload
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(true);
                            document.getElementById(fileInputId)?.click();
                          }}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-700 font-bold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-[0.98]"
                        >
                          <Camera size={18} />
                          Change Photo
                        </button>
                      )}

                      {(profileImage || selectedImageUrl) && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-red-600 font-bold border-2 border-red-50 hover:bg-red-50 transition-all active:scale-[0.98]"
                        >
                          <Trash2 size={18} />
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                      Recommended: Square JPG/PNG. Maximum file size 5MB.
                    </p>
                  </div>
                </div>
              </section>

              {/* Personal Details Section */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <User size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 leading-none">
                    Personal Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ring-1 ring-slate-100 p-8 rounded-4xl bg-white shadow-sm transition-all hover:shadow-md">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className={labelClasses}>Full Name</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        className={`${inputClasses} pl-11`}
                        placeholder="Alexander Pierce"
                        {...register("fullName")}
                        disabled={!isEditing}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs font-bold text-red-500 ml-1">
                        {errors.fullName.message as string}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className={labelClasses}>Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        className={`${inputClasses} pl-11`}
                        placeholder="admin@example.com"
                        {...register("email")}
                        disabled={!isEditing}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-xs font-bold text-red-500 ml-1">
                        {errors.email.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-100">
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.button
                      key="edit-trigger"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
                    >
                      <Edit size={20} />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <motion.div
                      key="edit-actions"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          reset(defaultValues);
                          setSelectedImageUrl(undefined);
                          setSelectedFile(null);
                          setIsEditing(false);
                        }}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-600 font-black border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-[0.98]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating || (!isDirty && !selectedImageUrl)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 disabled:opacity-60 disabled:scale-100 shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isUpdating ? (
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Save size={20} />
                        )}
                        Save Changes
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Security Alert Hook */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 font-bold bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white">
          <Shield size={16} />
          <p className="text-xs uppercase tracking-widest">
            Secure Administrator Environment
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
