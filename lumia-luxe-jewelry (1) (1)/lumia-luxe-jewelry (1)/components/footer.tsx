import Link from "next/link"

export default function Footer() {
  return (
    <footer id="contact" className="bg-white text-[#2D2B28] pt-16 pb-8 px-[5%] border-t border-[#D5B895]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 max-w-[1200px] mx-auto mb-10">
        <div>
          <h4 className="font-serif text-xl mb-5 text-[#C0A060]">Quick Links</h4>
          <ul className="list-none">
            <li className="mb-2.5">
              <Link href="/" className="text-[#6F6B68] no-underline transition-all duration-300 hover:text-[#C0A060]">
                Home
              </Link>
            </li>
            <li className="mb-2.5">
              <Link
                href="#collections"
                className="text-[#6F6B68] no-underline transition-all duration-300 hover:text-[#C0A060]"
              >
                Collections
              </Link>
            </li>
            <li className="mb-2.5">
              <Link
                href="#shop"
                className="text-[#6F6B68] no-underline transition-all duration-300 hover:text-[#C0A060]"
              >
                Shop
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-5 text-[#C0A060]">Policies</h4>
          <ul className="list-none">
            <li className="mb-2.5">
              <Link href="#" className="text-[#6F6B68] no-underline transition-all duration-300 hover:text-[#C0A060]">
                Terms & Conditions
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="#" className="text-[#6F6B68] no-underline transition-all duration-300 hover:text-[#C0A060]">
                Return Policy
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="#" className="text-[#6F6B68] no-underline transition-all duration-300 hover:text-[#C0A060]">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-5 text-[#C0A060]">Contact Us</h4>
          <ul className="list-none">
            <li className="mb-2.5 text-[#6F6B68]">Email: info@lumialuxe.com</li>
            <li className="mb-2.5 text-[#6F6B68]">Phone: +92 XXX XXXXXXX</li>
            <li className="mb-2.5 text-[#6F6B68]">Gujranwala, Punjab, PK</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-5 text-[#C0A060]">Follow Us</h4>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="w-10 h-10 bg-gradient-to-br from-[#D5B895] to-[#C0A060] rounded-full flex items-center justify-center transition-transform duration-300 hover:-translate-y-1"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gradient-to-br from-[#D5B895] to-[#C0A060] rounded-full flex items-center justify-center transition-transform duration-300 hover:-translate-y-1"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gradient-to-br from-[#D5B895] to-[#C0A060] rounded-full flex items-center justify-center transition-transform duration-300 hover:-translate-y-1"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-[#D5B895] text-[#6F6B68]">
        <p>© 2025 Lumia Luxe by WN. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
