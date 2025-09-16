import React from "react";

function Hero({ user, userRole, userObjectName, heroBgColor, heroImg }) {
  if (!user) return null; // safeguard

  const date = new Date();
  const hours = date.getHours();

  let greeting;
  if (hours < 12) {
    greeting = "Good Morning";
  } else if (hours < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const currentDate = date.toLocaleDateString();

  return (
    <div
      className={`flex flex-row gap-4 flex-grow items-center justify-center h-full mx-20 mt-2 bg-gradient-to-t ${heroBgColor} border border-gray-300 rounded-3xl py-10 px-30 shadow-lg`}
    >
      <div className="flex flex-col flex-1 items-start ml-10">
        <p className="text-4xl text-white mb-3 font-bold">
          WELCOME BACK {user.name} ({userRole})!
        </p>
        <p className="text-xl text-gray-200 italic mb-2">
          Logged in as: <span className="font-semibold">{userObjectName}</span>
        </p>
        <p className="text-3xl text-white">
          {greeting}, it's {time} on {currentDate}.
        </p>
      </div>
      <div className="flex flex-1 flex-col mr-10 items-end">
        <div className="mb-4 w-100 h-56">
          <img
            src={heroImg}
            alt={`Image of ${heroImg}`}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
