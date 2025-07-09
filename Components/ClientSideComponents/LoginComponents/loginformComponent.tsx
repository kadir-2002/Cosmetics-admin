"use client";
import {
  loginApi,
  otpSendApi,
  otpVerifyApi,
  ResetPassWordApi,
} from "@/apis/loginApi";
import { saveUserDetails } from "@/redux/userSlice";
import Image from "next/image";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const LoginFormComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetPass, setResetPass] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "password") setPassword(value);
    else if (name === "otp") setOtp(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginApi(username, password);
      if (response?.status === 200) {
        toast.success("Login Successfully");
        dispatch(
          saveUserDetails({
            details: response?.data?.user,
            token: response?.data?.token,
            userId: response,
          })
        );
      } else if (response?.data?.message === "Invalid credentials") {
        toast.error("Invalid login credentials");
      } else if (response?.data?.message === "User not found") {
        toast.error("User is deleated Please contact support");
      } else if (response?.data?.message === "User not active") {
        toast.error("User is deactivated Please contact support");
      } else if (response?.data?.message === "Invalid login credentials") {
        toast.error("Invalid login credentials");
      }else if (response?.data?.message === "User is suspended") {
        toast.error("User is deactivated Please contact support");
      } 
    } catch (err: any) {
      console.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleForgetPass = () => setResetPass(true);

  const handleBackToLogin = () => {
    setResetPass(false);
    setOtpSent(false);
    setUsername("");
    setPassword("");
    setOtp("");
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await otpSendApi(username);
      if (response?.body?.message === "User not found") {
        toast.error("User not found");
      } else if (response?.body?.message === "User not active") {
        toast.error("User is deactivated Please contact support");
      } else {
        toast.success("OTP sent successfully!");
        setOtpSent(true);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (password === "") {
      toast.error("Enter New Password");
      return;
    } else if (otp === "") {
      toast.error("Enter OTP");
      return;
    }
    try {
      setLoading(true);
      const verifyResponse = await otpVerifyApi(username, otp);
      if (verifyResponse?.data?.message === "OTP verified") {
        const resetResponse = await ResetPassWordApi(username, otp, password);
        console.log("Password Reset Response:", resetResponse);
        if (resetResponse?.data?.message === "Password reset successfully") {
          toast.success("Password reset successfully! Please login.");
          handleBackToLogin();
        } else {
          toast.error("Failed to reset password. Please try again.");
        }
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification or password reset:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid lg:grid-cols-2 grid-cols-1 justify-center items-center w-full h-full lg:px-8 bg-admin-primary'>
      <div className='flex flex-col w-full lg:h-[86%] lg:w-[80%] h-full  bg-white shadow-2xl lg:-mt-28 lg:rounded-b-3xl'>
        <div className='flex h-40 w-[250px] relative'>
          <Image
            src='/cosmeticLogo.png'
            alt='logo'
            fill={true}
            className='h-full w-full  absolute object-contain'
          />
        </div>
        <div className='flex flex-col w-full h-full justify-center px-4'>
          <div className='w-full flex flex-col justify-center items-center'>
            <div className='flex flex-col lg:w-[86%]'>
              {isResetPass ? (
                <form className='w-full mx-auto'>
                  <h1 className='text-3xl font-bold mb-2 text-left'>
                    Reset Password
                  </h1>
                  <p className='text-gray-600 mb-8 text-xl'>
                    Enter your email to reset your password
                  </p>
                  <div className='flex justify-between gap-3'>
                    <input
                      id='username'
                      name='username'
                      type='email'
                      placeholder='Enter your email'
                      className='w-full p-4 mb-4 rounded-lg shadow-md border-[1px] h-16'
                      value={username}
                      onChange={handleInputChange}
                      required
                    />
                    {otpSent ? (
                      <div
                        onClick={handleSendOtp}
                        className='bg-[#577C8E] h-16 text-white text-center flex justify-center items-center rounded-lg hover:bg-white border-[2px] lg:w-[160px] w-[120px] border-[#577C8E] hover:text-[#577C8E] disabled:opacity-50 lg:text-lg text-sm font-semibold shadow-md'
                      >
                        {loading ? "Sending OTP..." : "Resend OTP"}
                      </div>
                    ) : null}
                  </div>
                  {!otpSent ? (
                    <button
                      type='button'
                      onClick={handleSendOtp}
                      className='w-full p-4 bg-[#577C8E] text-white rounded-lg hover:bg-white border-[2px] border-[#577C8E] hover:text-[#577C8E] disabled:opacity-50  text-xl font-semibold shadow-md'
                      disabled={loading}
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  ) : (
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col gap-4'>
                        <input
                          id='otp'
                          name='otp'
                          type='text'
                          placeholder='Enter OTP'
                          className='w-full p-4 rounded-lg shadow-md border-[1px]'
                          value={otp}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className='relative flex flex-col gap-4'>
                        <input
                          id='password'
                          name='password'
                          type={showPassword ? "text" : "password"}
                          placeholder='Enter New Password'
                          className='w-full p-4 rounded-lg shadow-md border-[1px]'
                          value={password}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type='button'
                          className='absolute right-3 top-4 text-gray-600'
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <FaEyeSlash size={30} color='#577C8E' />
                          ) : (
                            <FaEye size={30} color='#577C8E' />
                          )}
                        </button>
                      </div>
                      <button
                        type='button'
                        onClick={handleVerifyOtp}
                        className='w-full p-4 bg-[#577C8E] text-white rounded-lg hover:bg-white border-[2px] border-[#577C8E] hover:text-[#577C8E] disabled:opacity-50 lg:text-2xl text-xl font-semibold shadow-md'
                        disabled={loading}
                      >
                        {loading ? "Verifying..." : "Reset Password"}
                      </button>
                    </div>
                  )}
                  <div className='text-center mt-4'>
                    <button
                      type='button'
                      className='text-purple-500 font-medium'
                      onClick={handleBackToLogin}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className='w-full mx-auto'>
                  <h1 className='text-6xl font-bold mb-2 text-left'>Login</h1>
                  <p className='text-gray-600 mb-8 text-xl'>
                    Welcome Back! Please Login to Your Account
                  </p>
                  <div className='flex flex-col gap-4'>
                    <label
                      htmlFor='username'
                      className='text-xl text-[#577C8E]'
                    >
                      Email
                    </label>
                    <input
                      id='username'
                      name='username'
                      type='text'
                      placeholder='Enter your email'
                      className='w-full p-4 mb-4 rounded-lg shadow-md border-[1px]'
                      value={username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-4'>
                    <label
                      htmlFor='password'
                      className='text-xl text-[#577C8E]'
                    >
                      Password
                    </label>
                    <div className='relative mb-4 flex justify-center items-center'>
                      <input
                        id='password'
                        name='password'
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter your password'
                        className='w-full p-4 mb-4 rounded-lg shadow-md border-[1px]'
                        value={password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-4 text-gray-600'
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FaEyeSlash size={30} color='#577C8E' />
                        ) : (
                          <FaEye size={30} color='#577C8E' />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='flex justify-end items-end mb-6'>
                    <a
                      href='#'
                      className='text-purple-500 text-sm'
                      onClick={(e) => {
                        e.preventDefault();
                        handleForgetPass();
                      }}
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full p-4 bg-admin-primary text-white rounded-lg hover:bg-white border-[2px] border-[#213E5A] hover:text-[#213E5A] disabled:opacity-50 lg:text-2xl text-xl font-semibold shadow-md'
                  >
                    {loading ? "Logging in..." : "LOGIN"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='h-40  lg:w-[80%] hidden text-white lg:flex lg:flex-col justify-center'>
        <h1 className='text-7xl w-full text-center'>Welcome Back</h1>
        <img src='Businessman.png' alt='img' />
      </div>
    </div>
  );
};

export default LoginFormComponent;
