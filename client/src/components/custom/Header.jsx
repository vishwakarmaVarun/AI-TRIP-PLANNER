import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../ui/use-toast";
import { signOutUserSuccess } from "@/redux/user/userSlice";
import { FaPlus } from "react-icons/fa6";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const handleDropdownToggle = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropDownOpen(false);
    }
  };

  useEffect(() => {
    if (dropDownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropDownOpen]);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout");
      const data = await response.json();

      if (!response.ok) {
        toast({ title: "Failed to sign out", description: data.message });
        return;
      }

      localStorage.clear();
      dispatch(signOutUserSuccess());
    } catch (error) {
      toast({ title: "Failed to Sign Out", description: error.message });
    }
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-10 lg:px-20 py-3 shadow-md">
      <img className="w-32 md:w-40" src="/logo.png" alt="logo" />
      {currentUser ? (
        <div
          className="relative flex items-center gap-2 md:gap-3"
          ref={dropdownRef}
        >
          <Link to={"/create-trip"} title="Create Trip">
            <Button
              variant="outline"
              className="flex items-center gap-1 rounded-full border-2 border-black"
            >
              <FaPlus className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Create Trip</span>
            </Button>
          </Link>
          <Link to={"/my-trip"} title="My Trip">
            <Button
              variant="outline"
              className="rounded-full border-2 border-black"
            >
              My Trip
            </Button>
          </Link>
          <div>
            <img
              title="Profile"
              onClick={handleDropdownToggle}
              className="w-8 h-8 sm:w-0 sm:h-0 rounded-full cursor-pointer"
              src={currentUser.avatar}
              alt="profile"
            />
            <Button
              title="Profile"
              onClick={handleDropdownToggle}
              className="hidden sm:flex items-center space-x-2"
            >
              <img
                className="w-8 h-8 md:w-9 md:h-9 rounded-full"
                src={currentUser.avatar}
                alt="profile"
              />
              <span className="hidden sm:block">Profile</span>
            </Button>
          </div>
          {dropDownOpen && (
            <div className="absolute top-12 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 text-gray-700">{currentUser.email}</div>
              <span
                onClick={handleSignOut}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Sign Out
              </span>
            </div>
          )}
        </div>
      ) : (
        <Link to={"/sign-in"}>
          <Button>Sign In</Button>
        </Link>
      )}
    </div>
  );
};

export default Header;
