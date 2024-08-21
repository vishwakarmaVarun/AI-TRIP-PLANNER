import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Hero = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20 xl:px-40 gap-6 md:gap-9">
        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl mt-16 md:mt-20 text-center leading-tight">
          <span className="text-blue-600">
            Discover Your Next Trip With AI 🙋‍♂️
          </span>{" "}
          Personalized Itineraries at Your Fingertips
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-500 text-center">
          Your personal trip planner and travel curator, creating custom
          itineraries tailored to your interests and budget.
        </p>
        <Link to={"/create-trip"}>
          <Button>Get Started, It's Free</Button>
        </Link>
        <img
          src="/landingPage.png"
          alt="landing page"
          className="w-full max-w-3xl my-8 md:my-10 mb-16 md:mb-20"
        />
        <div className="-mt-20 mb-20">

        <Footer />
        </div>
      </div>
    </>
  );
};

export default Hero;
