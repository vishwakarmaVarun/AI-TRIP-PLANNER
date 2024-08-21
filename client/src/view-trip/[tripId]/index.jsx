import DailyPlaceToVisit from "@/components/custom/DailyPlaceToVisit";
import Footer from "@/components/custom/Footer";
import Hotels from "@/components/custom/Hotels";
import InfoSection from "@/components/custom/InfoSection";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewTrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null); // Initialize as null to differentiate from an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      getTripData();
    }
  }, [tripId]);

  const getTripData = async () => {
    try {
      const docRef = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTrip(docSnap.data());
      } else {
        toast({ description: "No such data found" });
      }
    } catch (error) {
      toast({ description: "Failed to fetch trip data. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">No trip data available</div>
      </div>
    );
  }

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {/* Information Section */}
      <InfoSection trip={trip} />

      {/* Recommended Hotels */}
      <Hotels trip={trip} />

      {/* Daily Plan */}
      <DailyPlaceToVisit trip={trip} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ViewTrip;
