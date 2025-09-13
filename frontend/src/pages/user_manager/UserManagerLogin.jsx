import { LoginPage } from "../../components/index";

function UserManagerLogin() {
  return (
    <LoginPage
      inputCSS="active:border-[#0EA5E9] focus:border-[#1398C4FF]"
      loginSectionCSS="from-[#C4B5FD] to-[#C4B5FD]"
      aLinkCSS="text-[#C4B5FD] hover:text-[#C4B5FD] hover:text-shadow-[0_0_10px_rgba(245, 243, 255, 0.5)]"
      buttonCSS="bg-[#38BDF8] hover:bg-[#0A9FE0FF] hover:shadow-[4px_4px_16px_1px_rgba(15,121,156,0.4)]"
      imageSrc="userManager.png"
      imageAlt="User Manager login image"
      API="user_manager"
    />
  );
}

export default UserManagerLogin;
