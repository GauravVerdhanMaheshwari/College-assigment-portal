import React from "react";
import { PasswordPage } from "../../components/index";

function AdminForgetPassword() {
  return (
    <PasswordPage
      loginSectionCSS="from-[#A7F3D0] to-[#34D399]"
      buttonCSS="bg-[#3B96FFFF] hover:bg-[#55A3FCFF] hover:shadow-[4px_4px_16px_1px_rgba(7,59,76,0.4)]"
      imageSrc="admin.png"
      imageAlt="Admin login image"
      h1CSS="text-[#4D7BFAFF] text-shadow-[0_0_10px_rgba(30,58,138,0.5)]"
      inputCSS="active:border-[#3B96FFFF] focus:border-[#55A3FCFF]"
      aLinkCSS="text-[#3B96FFFF] hover:text-[#55A3FCFF] hover:text-shadow-[0_0_10px_rgba(59,150,255,0.5)]"
      API="admin"
      loginPageLink="/admin-login"
    />
  );
}

export default AdminForgetPassword;
