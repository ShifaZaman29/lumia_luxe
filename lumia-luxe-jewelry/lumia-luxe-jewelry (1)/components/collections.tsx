import Image from "next/image"
import Link from "next/link"

const collections = [
  {
    name: "Rings ",
    type: "rings",
    image: "https://img.drz.lazcdn.com/static/pk/p/10b1d6394fbc65f938bdea4b65176140.jpg_960x960q80.jpg_.webp",
    href: "/collections/rings"
  },
  {
    name: "Hand Cuffs",
    type: "handcuffs",
    image: "https://i.pinimg.com/1200x/1e/56/a6/1e56a692aab9279da74e39fbb0b6e3c9.jpg",
    href: "#shop"
  },
  { 
    name: "Bracelets", 
    type: "bracelets", 
    image: "https://www.franklymydearstore.com/cdn/shop/files/632d32b6-348d-4eaf-8683-cfa192e782a3.jpg?crop=region&crop_height=1365&crop_left=0&crop_top=341&crop_width=1365&v=1761094356&width=1365",
    href: "/collections/bracelets"
  },
  {
    name: "Pendants ",
    type: "pendants",
    image: "https://timelesssparkling.in/cdn/shop/files/IMG_4208.jpg?v=1749874438&width=1946",
    href: "#shop"
  },
  {
    name: "Earrings ",
    type: "earrings",
    image: "https://m.media-amazon.com/images/I/51+Y+wKSdYL._AC_UY1100_.jpg",
    href: "#shop"
  },
  { 
    name: "Chains", 
    type: "chains", 
    image: "https://img.kwcdn.com/product/fancy/02d95112-3318-406c-8742-1064194e46dd.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp",
    href: "#shop"
  },
  { 
    name: "Combo Sets ", 
    type: "combo", 
    image: "https://robinsonsjewelers.com/cdn/shop/articles/how-to-maintain-the-shine-of-gold-jewelry_6103416707716641383_20241218.jpg?v=1736584579&width=600",
    href: "#shop"
  },
]

export default function Collections() {
  return (
    <section id="collections" className="py-24 px-[5%] bg-white">
      <h2 className="font-serif text-5xl text-center mb-16 text-[#2D2B28]">Shop by Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
        {collections.map((collection) => (
          <Link 
            key={collection.type} 
            href={collection.href}
            className="block group"
          >
            <div className="relative overflow-hidden rounded-2xl cursor-pointer h-[350px] border border-[#D5B895] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(213,184,149,0.25)]">
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="font-serif text-3xl mb-2">{collection.name}</h3>
                <div className="flex items-center gap-2 text-[#D5B895] font-medium">
                  <span>View Collection</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}