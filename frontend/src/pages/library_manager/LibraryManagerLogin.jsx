import React from "react";
import { LoginPage } from "../../components/index";

function LibraryManagerLogin() {
  return (
    <>
      <LoginPage
        loginSectionCSS="from-[#38BDF8] to-[#8B5CF6]"
        buttonCSS="bg-[#6EE7B7] hover:bg-[#5CC198FF] hover:shadow-[4px_4px_16px_1px_rgba(7,59,76,0.4)]"
        imageSrc="/library_manager.png"
        imageAlt="Library Manager login image"
        h1CSS="text-[#1E3A8A] text-shadow-[0_0_10px_rgba(30,58,138,0.5)]"
        inputCSS="active:border-[#6EE7B7] focus:border-[#5CC198FF]"
        aLinkCSS="text-[#FDE68A] hover:text-[#FFE26DFF] hover:text-shadow-[0_0_10px_rgba(250, 210, 50,0.5)]"
        API="library-managers"
        forgetPasswordLink="/libraryManager/forgetPassword"
        pageAbout="Library Manager"
        redirectLink="/libraryManager"
      />
    </>
  );
}

export default LibraryManagerLogin;
