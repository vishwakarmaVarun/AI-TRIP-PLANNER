import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserTripCard from "./components/UserTripCard";

const MyTrip = () => {
  const [userTrips, setUserTrips] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserTrip = async () => {
      if (!currentUser) {
        navigate("/sign-in");
      }
      setUserTrips([]);
      const q = query(
        collection(db, "AITrips"),
        where("userEmail", "==", currentUser.email)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        setUserTrips((prevVal) => [...prevVal, doc.data()]);
      });
    };
    getUserTrip();
  }, [currentUser, navigate]);

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-64 px-5 mt-10">
      <h2 className="md:text-3xl text-xl font-semibold">My Trips</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-5 mt-10">
        {userTrips.length > 0 ? userTrips.map((userTrip, index) => (
          <UserTripCard key={index} userTrip={userTrip} />
        )) : [1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="h-56 w-full bg-slate-200 animate-pulse rounded-xl"></div>
        ))}
      </div>
    </div>
  );
};

export default MyTrip;
