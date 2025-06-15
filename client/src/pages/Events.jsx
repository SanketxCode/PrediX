import { useState } from "react";
import { EventCard } from "../components/EventCard"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function  Events   (){

    const [events,setEvents] = useState([]);
    const navigate = useNavigate();

    const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
     console.log(`${BACKEND_BASE_URL}/api/markets`);

    useEffect(() =>{
       const fetchEvents = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/markets`);
      const data = await response.json();
      console.log(data);
      
      if (data) {
        setEvents(data);
      } else {
        console.error('Unexpected response from backend ', data);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  fetchEvents();
    },[])



    return(
         <div 
         className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
          📊 Trending Prediction Markets
        </h1>
        {events.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No events found. Check back later!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map((event) => (
               <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="cursor-pointer"
              >
              <EventCard key={event.id} event={event} />
                  </div>

            ))}
          </div>
        )}
      </div>
    </div>
    )
}

