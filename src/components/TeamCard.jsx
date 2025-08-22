import React from "react";

const TeamCard = ({ name, role, email, phone }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-200">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-3xl font-bold text-green-800">{name.split(' ')[0][0]}</span>
    </div>
    <h3 className="text-xl font-bold text-green-900 mb-2">{name}</h3>
    <p className="text-green-700 font-semibold mb-2">{role}</p>
    <p className="text-gray-700 mb-1">
      <span className="font-semibold">Email:</span> <a href={`mailto:${email}`} className="text-green-700 underline">{email}</a>
    </p>
    <p className="text-gray-700">
      <span className="font-semibold">Phone:</span> {phone}
    </p>
  </div>
);

export default TeamCard;
