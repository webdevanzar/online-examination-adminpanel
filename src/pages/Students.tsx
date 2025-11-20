import { useState } from "react";
import UpdateUserPopup from "../components/UpdateUserPopup";

interface User {
  profile: string;
  username: string;
  email: string;
  phone?: string;
}

export const Students: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([
    {
      profile: "/mnt/data/Screenshot (109).png",
      username: "NewSuperf",
      email: "anzarsha3222@gmail.com",
      phone: "09961057130",
    },
    {
      profile: "/mnt/data/Screenshot (109).png",
      username: "noor",
      email: "noor@gmail.com",
      phone: "—",
    },
    {
      profile: "/mnt/data/Screenshot (109).png",
      username: "NewSuper",
      email: "anzarsha3333@gmail.com",
      phone: "09961057130",


    },
    {
      profile: "/mnt/data/Screenshot (109).png",
      username: "NewSuper",
      email: "anzarsha3333@gmail.com",
      phone: "09961057130",

      
    },

    {
      profile: "/mnt/data/Screenshot (109).png",
      username: "NewSuper",
      email: "anzarsha3333@gmail.com",
      phone: "09961057130",

      
    },
    {
      profile: "/mnt/data/Screenshot (109).png",
      username: "NewSuper",
      email: "anzarsha3333@gmail.com",
      phone: "09961057130",

      
    },
    {
      profile: "/mnt/data/Screenshot (109).png",
      username: "NewSuper",
      email: "anzarsha3333@gmail.com",
      phone: "09961057130",

      
    },
  ]);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // delete user
  const deleteUser = (email: string) => {
    setUsers((prev) => prev.filter((u) => u.email !== email));
  };

  return (
    <>
      {/* 🌈 Gradient Background */}
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-10">

        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 font-serif drop-shadow-md">
            User Management
          </h2>
          <p className="text-gray-600 mt-2 text-lg font-serif">
            Manage and monitor all system users
          </p>
        </div>

        {/* 🔍 Search Box */}
        <div className="bg-white p-5 rounded-2xl shadow-xl mb-6 border border-gray-200">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 outline-none 
                       focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* 🧊 User Table Card */}
        <div className="bg-white p-6 max-w-[100vw] overflow-x-auto rounded-2xl shadow-xl border border-gray-200">
          <div className="max-h-[70vh] overflow-auto">
          <table className="bg-white p-6 max-w-[100vw] overflow-x-auto rounded-2xl shadow-xl border border-gray-200 min-w-full w-full border-collapse text-left">
          
        

            <thead>
              <tr className="bg-linear-to-br from-blue-400 to-blue-900 text-white">
                <th className="p-3 text-sm">SL No</th>
                <th className="p-3 text-sm">Profile</th>
                <th className="p-3 text-sm">Username</th>
                <th className="p-3 text-sm">Email</th>
                <th className="p-3 text-sm">Contact</th>
                <th className="p-3 text-sm text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-purple-50 transition-all duration-200"
                >
                  <td className="p-3 font-semibold">{i + 1}</td>
                  

                  <td className="p-3">
                    <img
                      src={u.profile}
                      alt="profile"
                      className="h-12 w-12 rounded-full border object-cover 
                                 shadow-sm ring-2 ring-purple-200"
                    />
                  </td>

                  <td className="p-3 font-semibold text-gray-800">{u.username}</td>

                  <td className="p-3 text-gray-600">{u.email}</td>

                  <td className="p-3 text-gray-700">
                    {u.phone ? u.phone : "—"}
                  </td>

                  {/* Buttons */}
                  <td className="p-3 flex gap-3 justify-center">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-4 py-1 bg-blue-500 text-white rounded-lg 
                                 hover:bg-blue-600 shadow-md transition"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => deleteUser(u.email)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg 
                                 hover:bg-red-600 shadow-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 py-6">No users found.</p>
          )}
        </div>
      </div>
      

      {/* Popup */}
      {selectedUser && (
        <UpdateUserPopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={(data) => {
            setUsers((prev) =>
              prev.map((u) =>
                u.email === selectedUser.email ? { ...u, ...data } : u
              )
            );
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
};
