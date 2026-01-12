"use client"

import { Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely stunning jewelry! The quality is exceptional and the designs are so elegant. I receive compliments every time I wear my necklace.",
    image: "/elegant-woman-portrait.png",
    date: "March 2024",
  },
  {
    id: 2,
    name: "Emily Chen",
    rating: 5,
    comment:
      "The craftsmanship is incredible. I bought a ring for my anniversary and my wife was thrilled. Will definitely be ordering more pieces.",
    image: "/professional-woman-portrait.png",
    date: "February 2024",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    rating: 5,
    comment:
      "Luxurious and timeless pieces. The attention to detail is remarkable. Customer service was also excellent throughout my purchase.",
    image: "/sophisticated-woman-portrait.png",
    date: "January 2024",
  },
  {
    id: 4,
    name: "Jessica Williams",
    rating: 5,
    comment:
      "I am in love with my earrings! They are even more beautiful in person. The packaging was also gorgeous. Highly recommend!",
    image: "/happy-woman-portrait.png",
    date: "March 2024",
  },
]

export default function CustomerReviews() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-cream-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl text-gold-dark mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover why thousands of customers trust Lumia Luxe for their finest jewelry pieces
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={review.image || "/placeholder.svg"}
                  alt={review.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-gold-dark">
            <Star className="w-6 h-6 fill-gold text-gold" />
            <span className="text-2xl font-semibold">4.9/5</span>
            <span className="text-gray-600">from 2,500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
