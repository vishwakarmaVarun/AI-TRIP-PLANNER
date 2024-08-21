import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { IoIosSend } from "react-icons/io";
import axios from "axios";

const InfoSection = ({ trip }) => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!trip?.userSelection?.destination?.display_name) return;

      setLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
      const query = trip.userSelection.destination.display_name;

      try {
        const response = await axios.get(`https://api.pexels.com/v1/search`, {
          headers: {
            Authorization: apiKey,
          },
          params: {
            query: query,
            per_page: 1,
          },
        });

        const photo = response.data.photos[0];
        setImage(photo ? photo.src.medium : "");
      } catch (error) {
        setError("Failed to fetch image. Please try again later.");
      }

      setLoading(false);
    };

    fetchImage();
  }, [trip]);

  return (
    <div className="p-4 md:p-10 lg:p-16">
      {loading ? (
        <p>Loading image...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <img
          className="h-96 w-full object-cover rounded-xl"
          src={
            image ||
            "https://media.istockphoto.com/id/904172104/photo/weve-made-it-all-this-way-i-am-proud.jpg?s=612x612&w=0&k=20&c=MewnsAhbeGRcMBN9_ZKhThmqPK6c8nCT8XYk5ZM_hdg="
          }
          alt={`Destination: ${trip?.userSelection?.destination?.display_name}`}
        />
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-5">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">
            {trip?.userSelection?.destination?.display_name}
          </h2>
          <div className="flex flex-wrap gap-4">
            <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-500 text-sm">
              📅 {trip?.userSelection?.days} Day
            </h2>
            <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-500 text-sm">
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-500 text-sm">
              🧑‍🤝‍🧑 {trip?.userSelection?.travelCompanion} Travelers
            </h2>
          </div>
        </div>
        <Button aria-label="Send trip details">
          <IoIosSend size={18} />
        </Button>
      </div>
    </div>
  );
};

export default InfoSection;
