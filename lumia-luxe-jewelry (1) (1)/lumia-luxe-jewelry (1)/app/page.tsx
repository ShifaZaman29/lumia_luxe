import AnnouncementBar from "@/components/announcement-bar"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Collections from "@/components/collections"
import HotProducts from "@/components/hot-products"
import CustomerReviews from "@/components/customer-reviews"
import AboutUs from "@/components/about-us"
import Footer from "@/components/footer"
import WhatsAppFloat from "@/components/whatsapp-float"

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <HotProducts />
      <Collections />
      <CustomerReviews />
      <AboutUs />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
