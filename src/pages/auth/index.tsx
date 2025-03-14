import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import React from "react";

function Auth() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {/* <RegisterForm /> */}
      <LoginForm/>
    </div>
  );
}

export default Auth;
