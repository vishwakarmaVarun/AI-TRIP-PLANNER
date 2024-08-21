import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelsList,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { chatSession } from "@/services/AIModal";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    destination: {},
    days: "",
    budget: "",
    travelCompanion: "",
  });

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { toast } = useToast();

  const handleQueryChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: value,
              format: "json",
              addressdetails: 1,
              limit: 5,
            },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        toast({
          description:
            "Failed to fetch location suggestions. Please try again.",
        });
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
    setFormData({ ...formData, destination: suggestion });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBudgetSelect = (budget) => {
    setFormData({ ...formData, budget });
  };

  const handleTravelCompanionSelect = (travelCompanion) => {
    setFormData({ ...formData, travelCompanion });
  };

  const handleGenerateTrip = async () => {
    if (
      !formData.destination ||
      !formData.days ||
      !formData.budget ||
      !formData.travelCompanion
    ) {
      toast({
        description: "Please fill all the details to generate the trip!",
      });
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData.destination.display_name
    )
      .replace("{totalDays}", formData.days)
      .replace("{travelCompanion}", formData.travelCompanion)
      .replace("{budget}", formData.budget);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      await saveAITripData(result?.response?.text());
    } catch (error) {
      toast({
        description: "Failed to generate trip. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAITripData = async (tripData) => {
    try {
      setLoading(true);
      const docID = Date.now().toString();
      await setDoc(doc(db, "AITrips", docID), {
        userSelection: formData,
        tripdata: JSON.parse(tripData),
        userEmail: currentUser?.email,
        id: docID,
      });
      navigate(`/view-trip/${docID}`);
    } catch (error) {
      toast({
        description: "Failed to save trip data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10">
      <h2 className="text-2xl sm:text-3xl font-bold">
        Tell us your travel preferences ⛺🌴
      </h2>
      <p className="mt-2 text-slate-500 text-base sm:text-lg">
        Provide some basic information, and our trip planner will generate a
        customized itinerary based on your preferences.
      </p>
      <div className="mt-10 flex flex-col gap-6">
        <div>
          <h2 className="text-lg sm:text-xl mb-2 font-semibold">
            What is your destination of choice?
          </h2>
          <Input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search for a place"
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          {suggestions.length > 0 && (
            <ul className="w-full border border-gray-300 rounded-md max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSelect(suggestion)}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl mb-2 font-semibold">
            How many days are you planning your trip?
          </h2>
          <Input
            name="days"
            value={formData.days}
            onChange={handleInputChange}
            placeholder="Ex. 3"
            type="number"
          />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl mb-3 font-semibold">
            What is your budget?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleBudgetSelect(item.title)}
                className={`flex flex-col gap-1 p-4 border-2 text-center border-gray-300 rounded-lg hover:shadow-lg cursor-pointer ${
                  formData.budget === item.title
                    ? "border-gray-800 shadow-xl"
                    : ""
                }`}
              >
                <h2 className="text-2xl sm:text-3xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl mb-3 font-semibold">
            Who do you plan on traveling with?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SelectTravelsList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleTravelCompanionSelect(item.people)}
                className={`flex flex-col gap-1 p-4 border-2 text-center border-gray-300 rounded-lg hover:shadow-lg cursor-pointer ${
                  formData.travelCompanion === item.people
                    ? "border-gray-800 shadow-xl"
                    : ""
                }`}
              >
                <h2 className="text-2xl sm:text-3xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="my-3 flex justify-end">
          <Button disabled={loading} onClick={handleGenerateTrip}>
            {loading ? (
              <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
            ) : (
              "Generate Trip 🌟"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
