import React from "react";
import { Link } from "react-router";

export default function QuickAccess() {
  const items = [
    [
      {
        title: "Student",
        bgCss:
          "bg-[#118AB2] hover:bg-[#0f799c] hover:shadow-[4px_4px_16px_1px_rgba(15,121,156,0.4)]",
        page: "/student/login",
      },
      {
        title: "Faculties",
        bgCss:
          "bg-[#4C1D95] hover:bg-[#4C1D95]/70 hover:shadow-[4px_4px_16px_1px_rgba(97,41,186,0.4)]",
        page: "/faculties/login",
      },
    ],
    [
      {
        title: "User Manager",
        bgCss:
          "bg-[#38BDF8] hover:bg-[#0A9FE0FF] hover:shadow-[4px_4px_16px_1px_rgba(15,121,156,0.4)]",
        page: "/user-manager/login",
      },
      {
        title: "Library Manager",
        bgCss:
          "bg-[#6EE7B7] hover:bg-[#5CC198FF] hover:shadow-[4px_4px_16px_1px_rgba(7,59,76,0.4)]",
        page: "/library-manager/login",
      },
    ],
    [
      {
        title: "Admin",
        bgCss:
          "bg-[#3B96FFFF] hover:bg-[#55A3FCFF] hover:shadow-[4px_4px_16px_1px_rgba(7,59,76,0.4)]",
        page: "/admin/login",
      },
    ],
  ];

  return (
    <div className="bg-[#BB4430] text-[#FFFCF2] min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-semibold mb-10 hover:text-shadow-[0px_0px_30px] text-shadow-[#00b6c3] hover:underline hover:underline-offset-10 transition-all duration-300 ease-in-out cursor-default">
        Quick Access
      </h1>
      <div className=" bg-[#F3DFA2] text-black p-10 rounded-2xl shadow-[0px_0px_20px_10px_rgba(0,0,0,0.25)] w-full max-w-xl  transition-all duration-300 ease-in-out">
        <div className="flex flex-col gap-8">
          {items.map((row, i) => (
            <div key={i} className="flex justify-between gap-10">
              {row.map((label, j) => (
                <Link
                  key={j}
                  to={label.page}
                  className={`w-full bg-[#231F20] text-[#FBF2C0] py-3 rounded-xl text-lg font-medium hover:${label.bgCss} ease-in-out duration-400 transition-all shadow-md cursor-pointer w-fit px-6 text-center text-xl`}
                >
                  {label.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
