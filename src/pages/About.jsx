import React from "react";
import LandingNavbar from "../Components/LandingNavbar";

export default function About() {
  return (
    <div>
        <LandingNavbar />
        <section className="min-h-screen bg-white py-16 px-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-green-900 mb-6">About PlanIt</h1>
        <p className="max-w-2xl text-lg text-gray-700 mb-10 text-center">
            PlanIt is your all-in-one event planning platform, designed to help you organize, manage, and execute memorable events with ease. From vendor and venue management to guest lists and exportable reports, PlanIt streamlines every aspect of your event workflow.
        </p>
        <section className="w-full max-w-2xl mb-12">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Meet the Team</h2>
            <ul className="space-y-4">
            <li>
                <span className="font-bold">Bill Gates</span> - Full Stack Developer<br />
                Email: billgates@planit.com | Phone: +1 555-123-4567
            </li>
            <li>
                <span className="font-bold">Ntando Mkhize</span> - UI/UX Designer<br />
                Email: ntando@planit.com | Phone: +1 555-987-6543
            </li>
            <li>
                <span className="font-bold">Given Mak</span> - Project Manager<br />
                Email: givenmak@planit.com | Phone: +1 555-555-5555
            </li>
            </ul>
        </section>
        <section className="w-full max-w-2xl">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-2">For support or inquiries, reach out to our team at <a href="mailto:support@planit.com" className="text-green-700 underline">support@planit.com</a> or call +1 555-000-0000.</p>
            <p className="text-gray-700">We are committed to making your event planning experience seamless and enjoyable!</p>
        </section>
        </section>
    </div>
  );
}
