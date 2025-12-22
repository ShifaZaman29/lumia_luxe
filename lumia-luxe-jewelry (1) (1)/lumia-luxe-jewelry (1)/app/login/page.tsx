"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      
      // Get user data from localStorage to check role
      const userData = localStorage.getItem("user")
      
      if (!userData) {
        throw new Error("User data not found")
      }

      const user = JSON.parse(userData)
      
      // Check if user is admin - redirect to admin dashboard
      if (user.role === "admin") {
        alert("Welcome Admin!")
        router.push("/admin/dashboard")
      } else {
        // Regular user - redirect to home
        alert("Login successful!")
        router.push("/")
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
      alert(err.message || "Invalid email or password!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F6F2] via-white to-[#F9F6F2] flex items-center justify-center p-5">
      <div className="bg-white p-12 rounded-2xl shadow-[0_10px_40px_rgba(213,184,149,0.2)] max-w-[450px] w-full border border-[#D5B895]">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-[#2D2B28] mb-2.5">Welcome Back</h1>
          <p className="text-[#6F6B68] text-sm">Login to your Lumia Luxe account</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-[#2D2B28] font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={loading}
              className="w-full px-5 py-3 border border-[#D5B895] rounded-full text-sm outline-none transition-all duration-300 focus:border-[#C0A060] focus:shadow-[0_0_10px_rgba(213,184,149,0.2)] disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-[#2D2B28] font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={loading}
              className="w-full px-5 py-3 border border-[#D5B895] rounded-full text-sm outline-none transition-all duration-300 focus:border-[#C0A060] focus:shadow-[0_0_10px_rgba(213,184,149,0.2)] disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-4 py-4 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 mt-2.5 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(192,160,96,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 text-[#6F6B68] text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#C0A060] no-underline font-semibold">
            Sign Up
          </Link>
        </div>

        <div className="text-center mt-5">
          <Link href="/" className="text-[#C0A060] no-underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}