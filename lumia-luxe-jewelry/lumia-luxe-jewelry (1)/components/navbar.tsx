"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { cartAPI } from "@/lib/api"

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user: authUser, logout } = useAuth()

  useEffect(() => {
    // Sync auth user with local state
    if (authUser) {
      setUser({
        name: authUser.name || 'User',
        email: authUser.email || ''
      })
    } else {
      setUser(null)
    }
  }, [authUser])

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        // Check if user is authenticated (has token)
        const token = localStorage.getItem('token')
        
        if (!token) {
          setCartCount(0)
          return
        }

        // Fetch cart count from API
        const response = await cartAPI.get()
        
        if (response.success && response.data) {
          const count = response.data.totalItems || 0
          console.log("🛒 Navbar cart count:", count)
          setCartCount(count)
        } else {
          setCartCount(0)
        }
      } catch (error) {
        console.error("Error fetching cart count:", error)
        setCartCount(0)
      }
    }

    fetchCartCount()

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartCount()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
    
    // Clear cart data
    localStorage.removeItem("cart")
    localStorage.removeItem("cartCount")
    
    // Call auth logout
    logout()
    
    // Reset state
    setUser(null)
    setCartCount(0)
    setShowUserMenu(false)
    
    // Optional: Show message
    alert("Logged out successfully!")
  }

  return (
    <nav className="fixed top-10 w-full bg-white/98 backdrop-blur-md z-[1001] border-b border-[#D5B895] px-[5%] py-4 shadow-[0_2px_10px_rgba(213,184,149,0.1)]">
      <div className="flex justify-between items-center max-w-[1400px] mx-auto gap-16">
        <Link href="/" className="font-serif text-[32px] font-bold text-[#2D2B28] no-underline">
          LUMIA{" "}
          <span className="bg-gradient-to-br from-[#D5B895] to-[#C0A060] bg-clip-text text-transparent">LUXE</span>
          <div className="font-cursive text-base text-[#C0A060]">by WN</div>
        </Link>

        <ul className="flex gap-9 items-center list-none max-md:hidden">
          <li>
            <Link
              href="/"
              className="text-[#2D2B28] no-underline font-medium transition-all duration-300 hover:text-[#C0A060] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#D5B895] after:to-[#C0A060] after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="#collections"
              className="text-[#2D2B28] no-underline font-medium transition-all duration-300 hover:text-[#C0A060] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#D5B895] after:to-[#C0A060] after:transition-all after:duration-300 hover:after:w-full"
            >
              Collections
            </Link>
          </li>
          <li>
            <Link
              href="#shop"
              className="text-[#2D2B28] no-underline font-medium transition-all duration-300 hover:text-[#C0A060] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#D5B895] after:to-[#C0A060] after:transition-all after:duration-300 hover:after:w-full"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="text-[#2D2B28] no-underline font-medium transition-all duration-300 hover:text-[#C0A060] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#D5B895] after:to-[#C0A060] after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="text-[#2D2B28] no-underline font-medium transition-all duration-300 hover:text-[#C0A060] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-[#D5B895] after:to-[#C0A060] after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </Link>
          </li>
        </ul>

        <div className="flex gap-5 items-center">
          <div
            className="relative"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <span className="text-[#2D2B28] text-xl cursor-pointer transition-colors duration-300 hover:text-[#C0A060]">
              👤
            </span>
            {showUserMenu && (
              <div className="absolute top-8 right-0 bg-white border border-[#D5B895] rounded-lg py-2.5 min-w-[150px] shadow-[0_5px_15px_rgba(0,0,0,0.1)]">
                {user ? (
                  <>
                    <div className="block px-5 py-2.5 text-[#2D2B28] no-underline transition-all duration-300">
                      Hello, {user.name}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-5 py-2.5 text-[#2D2B28] no-underline transition-all duration-300 hover:bg-[#F9F6F2] hover:text-[#C0A060]"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-5 py-2.5 text-[#2D2B28] no-underline transition-all duration-300 hover:bg-[#F9F6F2] hover:text-[#C0A060]"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-5 py-2.5 text-[#2D2B28] no-underline transition-all duration-300 hover:bg-[#F9F6F2] hover:text-[#C0A060]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-5 py-2.5 text-[#2D2B28] no-underline transition-all duration-300 hover:bg-[#F9F6F2] hover:text-[#C0A060]"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-5 py-2.5 text-[#2D2B28] no-underline transition-all duration-300 hover:bg-[#F9F6F2] hover:text-[#C0A060]"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          <Link
            href="/wishlist"
            className="text-[#2D2B28] text-xl cursor-pointer transition-colors duration-300 hover:text-[#C0A060] no-underline"
          >
            ❤️
          </Link>
          
          <Link
            href="/cart"
            className="text-[#2D2B28] text-xl cursor-pointer transition-colors duration-300 hover:text-[#C0A060] relative no-underline"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white rounded-full w-[18px] h-[18px] text-[11px] flex items-center justify-center font-semibold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="hidden max-md:flex flex-col gap-1.5 cursor-pointer">
          <span className="w-6 h-0.5 bg-[#C0A060] rounded-sm"></span>
          <span className="w-6 h-0.5 bg-[#C0A060] rounded-sm"></span>
          <span className="w-6 h-0.5 bg-[#C0A060] rounded-sm"></span>
        </div>
      </div>
    </nav>
  )
}