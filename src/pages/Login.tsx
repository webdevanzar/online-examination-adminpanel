export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        
        <div className="mb-8">
          <p className="text-gray-600 mb-1">Please enter your details</p>
          <h1 className="text-3xl font-bold">Welcome back</h1>
        </div>

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
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
            Sign in
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
}
