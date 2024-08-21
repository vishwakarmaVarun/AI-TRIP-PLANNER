import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PlanItemCard = ({ planItem }) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      if (!planItem?.place_name) return;

      const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
      const query = planItem.place_name;

      try {
        const response = await axios.get(
          `https://api.pexels.com/v1/search`,
          {
            headers: {
              Authorization: apiKey
            },
            params: {
              query: query,
              per_page: 1
            }
          }
        );
        const photo = response.data.photos[0];
        setImage(photo ? photo.src.original : '');
      } catch (error) {
        console.error(`Failed to fetch image for ${planItem.place_name}`, error);
        setImage('https://media.istockphoto.com/id/904172104/photo/weve-made-it-all-this-way-i-am-proud.jpg?s=612x612&w=0&k=20&c=MewnsAhbeGRcMBN9_ZKhThmqPK6c8nCT8XYk5ZM_hdg='); // Fallback image
      }
    };

    fetchImage();
  }, [planItem]);

  return (
    <Link to={`https://www.google.com/maps/search/?api=1&query=${planItem?.place_name}`} target="_blank">
      <div className="border rounded-xl p-3 mt-3 flex gap-4 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer">
        <img
          loading="lazy"
          src={image}
          alt={planItem?.place_name}
          className="w-32 h-32 object-cover rounded"
        />
        <div className="flex flex-col justify-between">
          <h2 className="font-bold text-base sm:text-lg lg:text-xl">
            {planItem?.place_name}
          </h2>
          <h2 className="text-xs sm:text-sm lg:text-base text-gray-500">
            {planItem?.place_details}
          </h2>
          <h2 className="text-xs sm:text-sm lg:text-base font-medium text-orange-600 mt-1">
            🕑 Timing: {planItem?.time}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default PlanItemCard;

