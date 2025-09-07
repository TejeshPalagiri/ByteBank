import { useForm } from "react-hook-form";
import * as UserService from "../services/rest/user.service";
import { saveDataInLocalstorage } from "@/services/shared.service";
import { useNavigate } from "react-router-dom";
import { saveUserSessionStatus, saveMiscTokens, getUserSessionStatus } from "@/services/cookies.service";
import { getAllSpaces } from "@/services/rest/space.service";
import { useEffect } from "react";

export default function Login() {
    useEffect(() => {
        const sessionStatus = getUserSessionStatus();
        if(sessionStatus) {
            navigate("/file-upload");
        }
    }, [])
    const navigate = useNavigate();
    async function handleLogin(data: any) {
        const result: any = await UserService.login(data?.email, data?.password);
        saveUserSessionStatus(result?.success);
        if(result?.success === true) {
            const userDetails: any = await UserService.getCurrentUserDetails();
            if(userDetails?.success === true) {
                console.log("User details: ", userDetails?.data);
                saveDataInLocalstorage("USER_DETAILS", userDetails?.data);
            }
            const spaceDetails: any = await getAllSpaces();
            if(spaceDetails?.success === true) {
                const spaces = spaceDetails?.data || [];
                const space = spaces[0] || null;
                if(space?._id) {
                    saveMiscTokens("SPACE", space?._id);
                }
                saveDataInLocalstorage("SPACE_DETAILS", spaceDetails?.data);
            }
            navigate("/file-upload");
        }
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    return (
        <div className="flex items-center justify-center min-h-screen bg-purple-100 font-mono">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">
                    Login
                </h2>
                <p className="text-center text-gray-600">Hi, Welcome back 👋</p>
                {/* <button
          className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FcGoogle className="inline-block w-5 h-5 mr-2" />
          Login with Google
        </button> */}
                <div className="relative flex items-center justify-center w-full">
                    <span className="absolute px-2 text-gray-500 bg-white">
                        or Login with Email
                    </span>
                    <hr className="w-full mt-3 border-gray-300" />
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address",
                                    },
                                })}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                                placeholder="E.g. johndoe@email.com"
                            />
                            {errors.email && (
                                <span className="mt-2 text-xs text-red-600">
                                    {errors.root?.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password must be at least 8 characters long",
                                    },
                                })}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <span className="mt-2 text-xs text-red-600">
                                    {errors.root?.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="remember-me"
                                className="block ml-2 text-sm text-gray-900"
                            >
                                Remember Me
                            </label>
                        </div>
                        <div className="text-sm">
                            <a
                                href="#"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Forgot Password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Not registered yet?{" "}
                        <a
                            href="#"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Create an account ↗
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
