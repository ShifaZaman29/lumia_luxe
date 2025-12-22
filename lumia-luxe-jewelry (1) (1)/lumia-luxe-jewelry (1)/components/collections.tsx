import Image from "next/image"

const collections = [
  { name: "Rings 💍", type: "rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600" },
  {
    name: "Hand Cuffs",
    type: "handcuffs",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
  },
  { name: "Bracelets", type: "bracelets", image: "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=600" },
  {
    name: "Pendants 💎",
    type: "pendants",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
  },
  {
    name: "Earrings ✨",
    type: "earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600",
  },
  { name: "Chains", type: "chains", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600" },
  { name: "Combo Sets 🎁", type: "combo", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600" },
]

export default function Collections() {
  return (
    <section id="collections" className="py-24 px-[5%] bg-white">
      <h2 className="font-serif text-5xl text-center mb-16 text-[#2D2B28]">Shop by Collection</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 max-w-[1400px] mx-auto">
        {collections.map((collection) => (
          <div
            key={collection.type}
            className="relative overflow-hidden rounded-2xl cursor-pointer h-[350px] border border-[#D5B895] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(213,184,149,0.3)] group"
          >
            <Image
              src={collection.image || "/placeholder.svg"}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(45,43,40,0.9)] to-transparent p-8 text-white">
              <h3 className="font-serif text-3xl mb-1">{collection.name}</h3>
              <p className="text-[#D5B895] text-sm">View Collection →</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
