// src/components/LoginComponent.tsx

"use client";

import React, { useContext, useEffect, useState } from "react";
import { showToastMessage, useEmailValidation } from "../../utils/utils";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Input,
  Spacer,
} from "@nextui-org/react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";

const LoginComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const isInvalidEmail = useEmailValidation(email);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isLoading, setIsLoading] = useState(false);

  const roles = ["ActivityManager","ProjectManager", "Admin", "Customer", "Worker"];
  const [role, setRole] = useState("Admin");
  const router = useRouter();
  const { isAuthenticated, loading, login } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard"); // Redirect authenticated users away from login page
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      email: email,
      password: e.currentTarget.password.value,
      role: role, // Include the selected role
    };
    if (email && e.currentTarget.password.value) {
      try {
        await login(data);
        if (rememberMe) {
          // Set remember me functionality if needed
          localStorage.setItem(
            "rememberMeTime",
            JSON.stringify(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
          );
        }
        showToastMessage({
          type: "success",
          message: "Login Successful",
          position: "top-right",
        });
        // Redirection handled by useEffect after isAuthenticated updates
      } catch (error: any) {
        setIsLoading(false);
        showToastMessage({
          type: "error",
          message: error.response?.data?.message || "Login failed",
          position: "top-right",
        });
      }
    } else {
      setIsLoading(false);
      showToastMessage({
        type: "error",
        message: "Email and password are required",
        position: "top-right",
      });
    }
  };

  if (loading) {
    // Show a loading indicator
    return (
      <div className="flex h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="py-10 lg:py-20 flex flex-col justify-evenly items-center rounded-3xl px-12 lg:px-24"
        style={{ border: "1px solid #788BA5" }}
      >
        <div>
          <h3 className="text-xl lg:text-2xl py-2 font-bold text-center">
            Login with your work email
          </h3>
          <h3 className="text-sm py-2 text-[#788BA5]">
            Use your work email to log in to your team workspace.
          </h3>
        </div>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            value={email}
            type="text"
            variant="underlined"
            isInvalid={!isInvalidEmail}
            isRequired={true}
            color={!isInvalidEmail ? "danger" : "success"}
            placeholder="Email"
            onValueChange={setEmail}
          />
          <Input
            variant="underlined"
            placeholder="Password"
            className="pb-3"
            id="password"
            required
            endContent={
              isVisible ? (
                <IoEye onClick={toggleVisibility} className="cursor-pointer" />
              ) : (
                <IoEyeOff
                  onClick={toggleVisibility}
                  className="cursor-pointer"
                />
              )
            }
            type={isVisible ? "text" : "password"}
          />
          <Autocomplete
            label="Select your role"
            defaultSelectedKey={role}
            variant="underlined"
            onSelectionChange={(e: any) => setRole(e)}
            className="max-w-full bg-[#F6F8FB]"
          >
            {roles.map((role: any) => (
              <AutocompleteItem
                className="bg-[#F6F8FB]"
                key={role}
                value={role}
              >
                {role}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <div className="flex justify-between items-center">
            <Checkbox
              color="default"
              className="text-[#788BA5]"
              isSelected={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              size="sm"
            >
              Remember me
            </Checkbox>
            <div className="text-center mt-2 text-xs text-[#788BA5]">
              {/* <UnderDevelopment>Forgot Password?</UnderDevelopment> */}
            </div>
          </div>

          <Spacer y={4} />
          <Button
            className="text-white w-full flex justify-center rounded bg-[#117DF9] py-2"
            color="primary"
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
      {/* <div className="flex w-11/12 justify-center items-center">
        <UnderDevelopment>
          <Image
            src="/microsoft.png"
            width={30}
            height={30}
            alt="login with microsoft"
            className="cursor-pointer"
          />
        </UnderDevelopment>
      </div> */}
    </>
  );
};

export default LoginComponent;
