import React from "react";

export const EventCard = ({event}) =>{
      if (!event) return null;

  const { id, question, deadline } = event || {};
  if (!id || !question || !deadline) return null;


    const timeLeft = new Date(deadline) - new Date();
    const isOpen = timeLeft > 0;


    return (
    <>
         <a
      href={`/events/${id}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition hover:shadow-md hover:border-gray-300 no-underline"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{question}</h3>
      <div className="text-sm text-gray-500 mb-3">
        <span className="block">⏰ Deadline: {new Date(deadline).toLocaleString()}</span>
        <span className={`block mt-1 font-medium ${isOpen ? "text-green-600" : "text-red-500"}`}>
          🔐 Status: {isOpen ? "Open" : "Closed"}
        </span>
      </div>
    </a>
    </>
)
}