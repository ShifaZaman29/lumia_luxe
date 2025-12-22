"use client"

import { Award, Heart, Sparkles, Shield } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Each piece is crafted with the finest materials and exceptional attention to detail",
  },
  {
    icon: Heart,
    title: "Handcrafted with Love",
    description: "Our artisans pour their passion into every design, creating timeless masterpieces",
  },
  {
    icon: Sparkles,
    title: "Unique Designs",
    description: "Exclusive collections that blend contemporary elegance with classic sophistication",
  },
  {
    icon: Shield,
    title: "Lifetime Guarantee",
    description: "We stand behind our craftsmanship with a comprehensive lifetime warranty",
  },
]

export default function AboutUs() {
  return (
    <section className="py-16 sm:py-20 bg-cream-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-gold-dark mb-6 leading-tight">
              About Lumia Luxe
            </h2>
            
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
              Since our founding, Lumia Luxe has been dedicated to creating extraordinary jewelry that celebrates life's
              most precious moments. Our commitment to excellence and timeless design has made us a trusted name in
              luxury jewelry.
            </p>
            
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-10">
              Every piece in our collection tells a story of craftsmanship, passion, and elegance. We believe that
              jewelry is more than an accessory—it's a reflection of your unique style and the memories you cherish.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column - Image with Badge */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/img.jpeg"
                  alt="Artisan at Lumia Luxe meticulously crafting fine jewelry with precision tools"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f5f5dc'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' fill='%23b59a6a'%3ELumia Luxe Jewelry%3C/text%3E%3C/svg%3E"
                  }}
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Image Caption */}
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="font-great-vibes text-2xl sm:text-3xl mb-2 opacity-0 animate-fadeInUp animation-delay-500">
                  Crafted with Excellence
                </p>
                <p className="text-sm opacity-0 animate-fadeInUp animation-delay-700">
                  Where tradition meets innovation
                </p>
              </div>
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-gold text-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-[180px] sm:max-w-xs transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="relative">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/20 rounded-full animate-ping" />
                <p className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">15+</p>
                <p className="text-xs sm:text-sm font-medium leading-tight opacity-95">
                  Years of Excellence in Jewelry Craftmanship
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-gold/30 rounded-tl-lg" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-gold/30 rounded-bl-lg" />
          </div>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </section>
  )
}