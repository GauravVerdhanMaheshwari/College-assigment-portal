import React from "react";
import PasswordPage from "../../components/PasswordPage";

function UserManagerForgetPassword() {
  return (
    <PasswordPage
      loginSectionCSS="from-[#E0F2FE] to-[#93C5FD]"
      buttonCSS="bg-[#38BDF8] hover:bg-[#0A9FE0FF] hover:shadow-[30px_156px_212px_0.4px_rgba(15,121,156,0.4)]"
      imageSrc="userManager.png"
      imageAlt="User Manager login image"
      h1CSS="text-[#0EA5E9]"
      inputCSS="active:border-[#0EA5E9] focus:border-[#1398C4FF]"
      aLinkCSS="text-[#C4B5FD] hover:text-[#C4B5FD] hover:text-shadow-[0_0_10px_rgba(245, 243, 255, 0.5)]"
      API="user_manager"
    />
  );
}

export default UserManagerForgetPassword;
