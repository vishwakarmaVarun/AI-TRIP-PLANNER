import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserTripCard = ({ userTrip }) => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!userTrip?.userSelection?.destination?.display_name) return;

      setLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
      const query = userTrip?.userSelection?.destination?.display_name;

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
        setError("Failed to fetch image");
      }

      setLoading(false);
    };

    fetchImage();
  }, [userTrip]);

  return (
    <Link to={`/view-trip/${userTrip?.id}`} className="group">
      <div className="p-4 shadow-lg hover:scale-105 transition-transform duration-200 rounded-xl cursor-pointer bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">Loading image...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <img
            className="h-56 w-full object-cover rounded-xl"
            src={
              image ||
              "https://media.istockphoto.com/id/904172104/photo/weve-made-it-all-this-way-i-am-proud.jpg?s=612x612&w=0&k=20&c=MewnsAhbeGRcMBN9_ZKhThmqPK6c8nCT8XYk5ZM_hdg="
            }
            alt="Destination"
          />
        )}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {userTrip?.userSelection?.destination?.display_name ||
              "Unknown Destination"}
          </h2>
          <p className="text-gray-600">
            {userTrip?.userSelection?.days} Days trip with{" "}
            {userTrip?.userSelection?.budget} Budget
          </p>
        </div>
      </div>
    </Link>
  );
};

export default UserTripCard;
