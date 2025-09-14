import { LoginPage } from "../../components/index";

function StudentLogin() {
  return (
    <LoginPage
      inputCSS="active:border-[#118AB2] focus:border-[#118AB2]"
      h1CSS={"text-[#073B4C] text-shadow-[2px_2px_5px_rgba(7,59,76,0.5)]"}
      loginSectionCSS="from-[#FFE9B5] to-[#FFD166]"
      aLinkCSS="text-[#EF476F] hover:text-[#d63c57] hover:text-shadow-[0_0_10px_rgba(239,71,111,0.5)]"
      buttonCSS="bg-[#118AB2] hover:bg-[#0f799c] hover:shadow-[4px_4px_16px_1px_rgba(15,121,156,0.4)]"
      imageSrc="student.png"
      imageAlt="Student login image"
      API="students"
      forgetPasswordLink="/student-forget-password"
    />
  );
}

export default StudentLogin;
