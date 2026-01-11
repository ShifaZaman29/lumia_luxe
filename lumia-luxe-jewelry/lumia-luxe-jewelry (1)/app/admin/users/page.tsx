"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { adminAPI } from "@/lib/api"
import Link from "next/link"

interface User {
  _id: string
  name: string
  email: string
  role: string
  phone?: string
  createdAt: string
}

export default function AdminUsers() {
  const router = useRouter()
  const { user: currentUser, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        alert("Please login to access admin panel")
        router.push("/admin/login")
      } else if (currentUser.role !== "admin") {
        alert("Access denied. Admin only!")
        router.push("/")
      } else {
        fetchUsers()
      }
    }
  }, [currentUser, authLoading, router])

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers()
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error: any) {
      console.error("Error fetching users:", error)
      alert(error.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    if (updating) return
    if (userId === currentUser?._id) {
      alert("You cannot change your own role!")
      return
    }

    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return
    }

    setUpdating(userId)
    try {
      const response = await adminAPI.updateUserRole(userId, newRole)
      if (response.success) {
        alert("User role updated!")
        fetchUsers()
      }
    } catch (error: any) {
      console.error("Error updating role:", error)
      alert(error.message || "Failed to update role")
    } finally {
      setUpdating(null)
    }
  }

  const deleteUser = async (userId: string) => {
    if (userId === currentUser?._id) {
      alert("You cannot delete your own account!")
      return
    }

    if (!confirm("Are you sure you want to delete this user? This action cannot be undone!")) {
      return
    }

    try {
      const response = await adminAPI.deleteUser(userId)
      if (response.success) {
        alert("User deleted!")
        fetchUsers()
      }
    } catch (error: any) {
      console.error("Error deleting user:", error)
      alert(error.message || "Failed to delete user")
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F2] flex items-center justify-center">
        <div className="text-xl text-[#6F6B68]">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F6F2]">
      {/* Header */}
      <div className="bg-white border-b border-[#D5B895]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl text-[#2D2B28]">Manage Users</h1>
            <p className="text-[#6F6B68]">View and manage user accounts</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-6 py-2 bg-[#D5B895] text-white rounded-full hover:bg-[#C0A060] transition-all no-underline"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Total Users</div>
            <div className="font-serif text-4xl text-[#2D2B28]">{users.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Admin Users</div>
            <div className="font-serif text-4xl text-[#C0A060]">
              {users.filter((u) => u.role === "admin").length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Regular Users</div>
            <div className="font-serif text-4xl text-[#2D2B28]">
              {users.filter((u) => u.role === "user").length}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-[#D5B895] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9F6F2]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2B28]">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2B28]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2B28]">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2B28]">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2B28]">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2D2B28]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-[#D5B895]">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#2D2B28]">{user.name}</div>
                      {user._id === currentUser?._id && (
                        <span className="text-xs text-[#C0A060]">(You)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#6F6B68]">{user.email}</td>
                    <td className="px-6 py-4 text-[#6F6B68]">{user.phone || "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6F6B68]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user._id !== currentUser?._id && (
                          <>
                            <button
                              onClick={() =>
                                updateUserRole(user._id, user.role === "admin" ? "user" : "admin")
                              }
                              disabled={updating === user._id}
                              className="px-4 py-2 bg-[#D5B895] text-white rounded-lg hover:bg-[#C0A060] transition-all text-sm disabled:opacity-50"
                            >
                              {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                            </button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}