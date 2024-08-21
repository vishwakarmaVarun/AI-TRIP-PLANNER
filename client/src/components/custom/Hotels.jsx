import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Hotels = ({ trip }) => {
  const [hotelImages, setHotelImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelImages = async () => {
      if (!trip?.tripdata?.hotel_options) {
        setLoading(false);
        return;
      }

      const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
      const hotelImagePromises = trip.tripdata.hotel_options.map(
        async (hotel) => {
          try {
            const response = await axios.get(
              `https://api.pexels.com/v1/search`,
              {
                headers: {
                  Authorization: apiKey,
                },
                params: {
                  query: hotel.hotel_name,
                  per_page: 1,
                },
              }
            );
            const photo = response.data.photos[0];
            return photo ? photo.src.original : "";
          } catch (error) {
            console.error(
              `Failed to fetch image for ${hotel.hotel_name}`,
              error
            );
            return "";
          }
        }
      );

      try {
        const images = await Promise.all(hotelImagePromises);
        setHotelImages(images);
      } catch (error) {
        console.error("Failed to fetch hotel images", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelImages();
  }, [trip]);

  return (
    <div className="p-5">
      <h2 className="font-bold text-xl mt-5">Hotel Recommendations</h2>
      {loading ? (
        <p>Loading hotels...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {trip?.tripdata?.hotel_options.map((hotelItem, index) => (
            <Link
              key={index}
              to={`https://www.google.com/maps/search/?api=1&query=${hotelItem?.hotel_name},${hotelItem?.hotel_address}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${hotelItem?.hotel_name} on Google Maps`}
            >
              <div className="hover:scale-105 transition-transform duration-200 cursor-pointer">
                <div
                  className="relative overflow-hidden"
                  style={{ height: "200px", width: "100%" }}
                >
                  <img
                    src={
                      hotelImages[index] ||
                      "https://media.istockphoto.com/id/904172104/photo/weve-made-it-all-this-way-i-am-proud.jpg?s=612x612&w=0&k=20&c=MewnsAhbeGRcMBN9_ZKhThmqPK6c8nCT8XYk5ZM_hdg="
                    }
                    alt={hotelItem?.hotel_name || "Hotel"}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="my-2">
                  <h2 className="font-semibold text-lg">
                    {hotelItem?.hotel_name}
                  </h2>
                  <h2 className="text-sm text-gray-500">
                    📍 {hotelItem?.hotel_address}
                  </h2>
                  <h2 className="text-sm text-gray-500">
                    💰 {hotelItem?.price}
                  </h2>
                  <h2 className="text-sm text-gray-500">
                    ⭐ {hotelItem?.rating}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hotels;
