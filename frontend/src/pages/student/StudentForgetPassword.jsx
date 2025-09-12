import React from "react";
import PasswordPage from "../../components/PasswordPage";

function StudentForgetPassword() {
  return (
    <PasswordPage
      loginSectionCSS="from-[#FFE9B5] to-[#FFD166]"
      buttonCSS="bg-[#118AB2] hover:bg-[#0f799c] hover:shadow-[4px_4px_16px_1px_rgba(15,121,156,0.4)]"
      imageSrc="student.png"
      imageAlt="Student login image"
      h1CSS="text-[#073B4C]"
      inputCSS="active:border-[#118AB2] focus:border-[#118AB2]"
      aLinkCSS="text-[#EF476F] hover:text-[#ec3762] hover:text-shadow-[0_0_10px_rgba(239,71,111,0.5)]"
      API="student"
    />
  );
}

export default StudentForgetPassword;
