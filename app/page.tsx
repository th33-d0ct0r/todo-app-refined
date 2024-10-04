"use client"
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PacmanLoader } from "react-spinners";

export default function Home() {
  const { isLoaded, user } = useUser();
  if (!isLoaded) {
    return (
        <div className="flex flex-col w-[100%] h-[100vh] items-center justify-center">
            <PacmanLoader className="justify-center items-center" color='#FF5631' />
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-[100%] h-[100vh]">
      <h1 className="text-[5vw] font-extrabold text-[#FF5631]">Manage your todos easily.</h1>
      <div className="flex flex-row items-center justify-center gap-5">
        {user ? (
          <Link className="bg-[#FF5631] text-black py-2 px-5 rounded-full" href={"/dashboard"}>Dashboard</Link>
        ) : (
          <div className="flex flex-row items-center justify-center gap-5 mt-4">
            <Link className="border-2 border-[#FF5631] py-2 px-5 text-lg rounded-full text-[#FF5631]" href={"/sign-in"}>Sign In</Link>
            <Link className="bg-[#FF5631] text-black py-2 px-5 rounded-full" href={"/sign-up"}>Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
}