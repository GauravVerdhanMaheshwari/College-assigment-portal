import { LoginPage } from "../../components/index";

function UserManagerLogin() {
  return (
    <LoginPage
      inputCSS="active:border-[#0EA5E9] focus:border-[#1398C4FF]"
      loginSectionCSS="from-[#C4B5FD] to-[#C4B5FD]"
      aLinkCSS="text-[#0A9FE0FF] hover:text-[#0A9FE0FF] hover:text-shadow-[0_0_10px_rgba(10,159,224,0.5)]"
      buttonCSS="bg-[#38BDF8] hover:bg-[#0A9FE0FF] hover:shadow-[4px_4px_16px_1px_rgba(15,121,156,0.4)]"
      imageSrc="user_manager.png"
      imageAlt="User Manager login image"
      API="user-managers"
      h1CSS="text-[#0EA5E9] text-shadow-[0_0_10px_rgba(14,165,233,0.5)]"
      forgetPasswordLink="/user-manager-forget-password"
    />
  );
}

export default UserManagerLogin;
