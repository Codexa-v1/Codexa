import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import TeamCard from "../components/TeamCard";

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
        name: "Freddo",
        role: "Testing Specialist",
        email: "freddo@planit.com",
        phone: "+1 555-111-2222",
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
    }
];

export default function About() {
    return (
        <div>
            <LandingNavbar />
            <section className="min-h-screen bg-white py-16 px-4 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-green-900 mb-6">About PlanIt</h1>
                <p className="max-w-2xl text-lg text-gray-700 mb-10 text-center">
                    PlanIt is your all-in-one event planning platform, designed to help you organize, manage, and execute memorable events with ease. From vendor and venue management to guest lists and exportable reports, PlanIt streamlines every aspect of your event workflow.
                </p>
                        <section className="w-full max-w-4xl mb-12">
                            <h2 className="text-2xl font-semibold text-green-800 mb-8 text-center">Meet the Team</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {team.map((member, idx) => (
                                                <TeamCard key={idx} {...member} />
                                            ))}
                                        </div>
                        </section>
                <section className="w-full max-w-2xl">
                    <h2 className="text-2xl font-semibold text-green-800 mb-4">Contact Us</h2>
                    <p className="text-gray-700 mb-2">For support or inquiries, reach out to our team at <a href="mailto:support@planit.com" className="text-green-700 underline">support@planit.com</a> or call +1 555-000-0000.</p>
                    <p className="text-gray-700">We are committed to making your event planning experience seamless and enjoyable!</p>
                </section>
            </section>
                {/* Footer */}
                <footer className="bg-teal-800 text-white py-16 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="md:col-span-2">
                                <h3 className="text-2xl font-bold mb-4">PlanIt</h3>
                                <p className="text-teal-100 leading-relaxed">
                                    The ultimate platform for planning memorable events.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                                <ul className="space-y-2 text-teal-100">
                                    <li>
                                        <a
                                            href="/about"
                                            className="hover:text-white transition-colors duration-200"
                                        >
                                            About
                                        </a>
                                    </li>
                                    <li>
                                                            <button
                                                                type="button"
                                                                className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer"
                                                                onClick={() => {
                                                                    window.location.href = '/#hero';
                                                                }}
                                                            >
                                                                Features
                                                            </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-teal-700 mt-12 pt-8 text-center text-teal-100">
                            <p>&copy; 2025 PlanIt. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
