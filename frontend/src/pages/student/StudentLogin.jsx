import { LoginPage } from "../../components/index";

function StudentLogin() {
  const handleSubmit = (name, email, password) => {
    // Handle login logic here
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <LoginPage
      inputCSS="active:border-[#118AB2] focus:border-[#118AB2]"
      loginSectionCSS="from-[#FFE9B5] to-[#FFD166] hover:from-[#ffd166] hover:to-[#ffc845]"
      aLinkCSS="text-[#EF476F] hover:text-[#d63c57]"
      buttonCSS="bg-[#118AB2] hover:bg-[#0f799c] hover:shadow-[4px_4px_16px_1px_rgba(15,121,156,0.4)]"
      imageSrc="student.png"
      imageAlt="Student login image"
      handleSubmit={handleSubmit}
    />
  );
}

export default StudentLogin;
