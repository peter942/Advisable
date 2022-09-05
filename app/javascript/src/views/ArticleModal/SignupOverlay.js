import React from "react";
import Button from "src/components/Button";
import { Link, useLocation } from "react-router-dom";
import GridLines from "src/components/GridLines";

export default function SignupOverlay() {
  const location = useLocation();
  return (
    <div className="grid absolute z-20 place-items-center w-full h-full bg-transparent-white-90 rounded-t-[32px]">
      <div className="overflow-hidden bg-white rounded-xl shadow-2xl w-[500px]">
        <div className="overflow-hidden relative p-10 bg-blue-100 bg-gradient-to-br from-indigo-900 to-violet-900">
          <GridLines color="rgb(255 255 255 / .1)" highlight="#FFFFFF" />
          <div className="relative z-10">
            <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-white">
              Explore 100s of full case studies for free
            </h1>
            <p className="text-lg text-indigo-50 max-w-[400px]">
              Access our library of SaaS growth projects from leading marketers.
            </p>
          </div>
        </div>
        <div className="p-10">
          <Link to="/clients/join" className="block mb-4">
            <Button size="lg" className="w-full">
              Get full access
            </Button>
          </Link>
          <Link
            to="/login"
            variant="underlined"
            state={{
              from: {
                pathname: location.pathname,
              },
            }}
          >
            <Button size="lg" variant="outlined" className="w-full">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
