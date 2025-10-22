import React from "react";
import { PasswordPage } from "../../components/index";

function FacultiesForgetPassword() {
  return (
    <PasswordPage
      inputCSS="active:border-[#C4B5FD] focus:border-[#C4B5FD]"
      loginSectionCSS="from-[#C4B5FD] to-[#8B5CF6]"
      h1CSS="text-[#4C1D95] text-shadow-[0px_0px_10px_rgba(124,58,237,0.9)]"
      aLinkCSS="text-[#95D6F4FF] hover:text-shadow-[0px_0_10px_rgba(62,191,250,0.9)]"
      buttonCSS="bg-[#4C1D95] hover:bg-[#4C1D95]/70 hover:shadow-[4px_4px_16px_1px_rgba(97,41,186,0.4)]"
      imageSrc="../../../public/faculty.png"
      imageAlt="Faculty login image"
      loginPageLink="/faculties/login"
      API={"faculty"}
    />
  );
}

export default FacultiesForgetPassword;
