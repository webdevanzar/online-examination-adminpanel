import { useState } from "react";

export const Signup = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
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
                className="absolute -top-2 -left-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow"
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
              <div className="
                w-24 h-24 rounded-full 
                flex items-center justify-center 
                overflow-hidden shadow-md
                bg-gray-300
              ">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm">Upload</span>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="mb-8 text-center md:text-left">
          <p className="text-gray-600 mb-1">Create your account</p>
          <h1 className="text-3xl font-bold">Sign up</h1>
        </div>

        {/* Form */}
        <form className="space-y-5">

          {/* Username + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Password + Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
          >
            Sign up
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

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};
