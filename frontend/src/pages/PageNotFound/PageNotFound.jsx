import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  const links = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjNnbTkzcjRsdHlxNjhobXphbGtjaHZkeW5rZnpiNGZhYnZtaG9rZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/12HZukMBlutpoQ/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjNnbTkzcjRsdHlxNjhobXphbGtjaHZkeW5rZnpiNGZhYnZtaG9rZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jTnGaiuxvvDNK/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bjdncG53YzI0ZWg2cDR4bm5xNGs2dXc1a3c2dzRsZTZwampkMDdvNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT1z8Fz2YP7Tcc5Nwa/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bjdncG53YzI0ZWg2cDR4bm5xNGs2dXc1a3c2dzRsZTZwampkMDdvNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ray4IqT73lQhh24qKq/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnB1MHBlanJmc283YzRlN3Jlb25vNWF2ZTV2emFtMHIxMmI3dDMzaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kKeJ4JuNkaEZbkPOOL/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnB1MHBlanJmc283YzRlN3Jlb25vNWF2ZTV2emFtMHIxMmI3dDMzaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/H4DjXQXamtTiIuCcRU/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnB1MHBlanJmc283YzRlN3Jlb25vNWF2ZTV2emFtMHIxMmI3dDMzaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1ViLp0GBYhTcA/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3a3J6bDZ0N256bmhzaWUwbTJla3B6bjR6M3Y1Z2hkMnc0bmVxbGdkaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fJnPKA5tS7Dri/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dGZyaTdmbXY2Z240ODRqeGg4anlsOTNsaG1rZ3JoYXd4MTBveGJsaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Df0JB6yixeNqg/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MGw0ajZkbnczenR4cTk3b3kwZHE4OTZ6NTRrNjV4ZmM1OG5ya2tsZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/OmK8lulOMQ9XO/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHBmNmQ2dTNobzNuMWF1dTludWc3eXhkczA1eTM3bXc1Z2R2ZWFieCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/wr7oA0rSjnWuiLJOY5/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2JzZnpndDlwdmwxZnV4M3ZjZjJtcWdlajUwNjV0M3F5MjZmZXRzZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MDJ9IbxxvDUQM/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2JzZnpndDlwdmwxZnV4M3ZjZjJtcWdlajUwNjV0M3F5MjZmZXRzZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nR4L10XlJcSeQ/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2JzZnpndDlwdmwxZnV4M3ZjZjJtcWdlajUwNjV0M3F5MjZmZXRzZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8vQSQ3cNXuDGo/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2JzZnpndDlwdmwxZnV4M3ZjZjJtcWdlajUwNjV0M3F5MjZmZXRzZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2zUn8hAwJwG4abiS0p/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cDZ5MnNlbm80OHkwMTNpNTViancxeWlkdzdsMTRqYWh0bmtxMmM2dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MWSRkVoNaC30A/giphy.gif",
  ];

  const randomGif = links[Math.floor(Math.random() * links.length)];

  return (
    <div className="h-[100vh] w-full flex flex-col items-center justify-center text-center p-6 bg-purple-400 text-white">
      <h1 className="text-6xl font-bold mb-4 animate-bounce">404</h1>
      <p className="text-4xl mb-4 font-semibold">
        Oops! This page doesn't exist.
      </p>
      <p className="text-2xl mb-2">But here's a cat to cheer you up 🐱</p>
      <p className="text-2xl mb-6">Refresh the page to see another cat! 🔄</p>

      <img
        src={randomGif}
        alt="Funny Cat"
        className="w-[300px] border-4 border-white rounded-xl shadow-lg max-w-[300px] hover:scale-105 transition-transform duration-300 ease-in-out"
      />

      <Link
        to="/"
        className="text-white bg-purple-700 hover:bg-purple-900 focus:ring-4 focus:outline-none focus:ring-purple-500 hover:ring-2 font-medium rounded-lg text-lg px-5 py-2.5 text-center my-6 transition-all duration-200 ease-in-out"
      >
        Go Back
      </Link>
    </div>
  );
}

export default PageNotFound;
