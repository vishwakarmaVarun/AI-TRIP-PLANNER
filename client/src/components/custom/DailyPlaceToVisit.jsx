import React from "react";
import PlanItemCard from "./PlanItemCard";

const DailyPlaceToVisit = ({ trip }) => {
  return (
    <div className="my-4">
      <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">Place to Visit</h2>
      <div>
        {trip?.tripdata?.itinerary.map((itineraryItem, index) => (
          <div key={index} className="mt-4">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">Day {itineraryItem?.day}</h2>
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center">
              {itineraryItem?.plan.map((planItem, index) => (
                <div key={index}>
                  <PlanItemCard planItem={planItem} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyPlaceToVisit;
