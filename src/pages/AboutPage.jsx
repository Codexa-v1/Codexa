"use client"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header";
import TeamCard from "@/components/TeamCard"
import { FiMail, FiPhone, FiCheckCircle } from "react-icons/fi"

const team = [
  {
    name: "Kutlwano",
    role: "Full Stack Developer",
    email: "kutlwanomoubetsi@planit.com",
    phone: "+1 555-123-4567",
  },
  {
    name: "Ntando",
    role: "UI/UX Designer",
    email: "ntando@planit.com",
    phone: "+1 555-987-6543",
  },
  {
    name: "Given",
    role: "Project Manager",
    email: "given@planit.com",
    phone: "+1 555-555-5555",
  },
  {
    name: "Molemo",
    role: "Backend Developer",
    email: "molemo@planit.com",
    phone: "+1 555-222-3333",
  },
  {
    name: "Ntobeko",
    role: "Frontend Developer",
    email: "ntobeko@planit.com",
    phone: "+1 555-333-4444",
  },
]

const features = [
  "Vendor & Venue Management",
  "Guest List & RSVP Tracking",
  "Budget Management",
  "Schedule Planning",
  "Document Management",
  "Floor Plan Upload",
]

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-700 to-teal-900 bg-clip-text text-transparent">
            About PlanIt
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            PlanIt is your all-in-one event planning platform, designed to help you organize, manage, and execute
            memorable events with ease. From vendor and venue management to guest lists and exportable reports, PlanIt
            streamlines every aspect of your event workflow.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <FiCheckCircle className="text-teal-600 text-xl flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-teal-700 to-teal-900 bg-clip-text text-transparent">
            Meet the Team
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our dedicated team of professionals working together to make your event planning experience seamless.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <TeamCard key={idx} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-700 to-teal-900 bg-clip-text text-transparent">
              Contact Us
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              For support or inquiries, reach out to our team. We are committed to making your event planning experience
              seamless and enjoyable!
            </p>
            <div className="space-y-4">
              <a
                href="mailto:support@planit.com"
                className="flex items-center gap-3 text-gray-700 hover:text-teal-700 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors duration-200">
                  <FiMail className="text-teal-700" />
                </div>
                <span className="font-medium">codexa3@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
