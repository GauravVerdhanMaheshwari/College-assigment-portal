import React from "react";

function FacultiesForgetPassword() {
  return (
    <PasswordPage
      loginSectionCSS="from-[#D0E2FF] to-[#A9C9FF]"
      buttonCSS="bg-[#073B4C] hover:bg-[#062f3a] hover:shadow-[4px_4px_16px_1px_rgba(7,59,76,0.4)]"
      imageSrc="faculty.png"
      imageAlt="Faculty login image"
      h1CSS="text-[#118AB2]"
      inputCSS="active:border-[#073B4C] focus:border-[#073B4C]"
      aLinkCSS="text-[#06D6A0] hover:text-[#05c68a] hover:text-shadow-[0_0_10px_rgba(6,214,160,0.5)]"
      API="faculty"
    />
  );
}

export default FacultiesForgetPassword;
