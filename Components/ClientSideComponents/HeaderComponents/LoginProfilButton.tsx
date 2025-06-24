"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import { MdLogout, MdManageAccounts } from "react-icons/md";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LogoutPopup from "../LoginComponents/LogoutPopup";;

type Props = { currentDateTime: any };

const LoginProfilButton = ({ currentDateTime }: Props) => {
    const [isOpenPopup, setIsOpenPopup] = useState(false);

    const token = useSelector((state: any) => state?.user?.token);
    const userId = useSelector((state: any) => state?.user?.details?.id);
    const userDetails = useSelector((state: any) => state?.user?.details);
    const router = useRouter();
    const [isOpenLoginPopup, setIsLoaginPopup] = useState<boolean>(false);
    const [isOpenLogoutPopup, setIsLogoutPopup] = useState<boolean>(false);

    // console.log("token", token, "tokentokentoken", userId);
    // console.log("userDetails", userDetails);


    return (
        <div className="items-center justify-end gap-3 relative">
            {userId ? (
                <div
                    className=""
                    onMouseEnter={() => {
                        setIsOpenPopup(!isOpenPopup);
                    }}
                    onMouseLeave={() => {
                        setIsOpenPopup(!isOpenPopup);
                    }}
                >
                    <div>
                        <div className="w-full flex flex-row items-center justify-between md:-my-3 md:-mx-3  -mx-5 -my-2 md:gap-2 gap-2">
                            <div>
                                {userDetails?.imageUrl ? (
                                    <>
                                        <Avatar
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${userDetails?.firstName}`}
                                            maxInitials={2}
                                            size="43"
                                            round={true}
                                            style={{ color: "black" }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Avatar
                                            maxInitials={2}
                                            size="43"
                                            round={true}
                                            style={{ color: "black" }}

                                            name={userDetails?.firstName as string}
                                        />

                                    </>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <p className=" capitalize text-lg font-semibold ">{userDetails?.firstName}{userDetails?.lastName}</p>
                                <h2 className="text-sm ">{currentDateTime}</h2>
                            </div>
                        </div>
                    </div>
                    {isOpenPopup && (
                        <div
                            className={`absolute bg-white text-black mt-3 border-[0.5px] border-ref-secondary rounded shadow-lg  transition-transform duration-1000 ease-in-out z-50 md:-left-4 -left-28 ${isOpenPopup
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4"
                                }`}
                        >
                            <div className="flex flex-row items-center justify-center gap-1 mx-10 my-1 border-b-[0.5px] border-b-black p-2">
                                <div>
                                    {userDetails?.imageUrl ? (
                                        <>
                                            <Avatar

                                                src={`${userDetails?.imageUrl}`}
                                                maxInitials={2}
                                                size="30"
                                                round={true}
                                                style={{ color: "black" }}
                                            />
                                        </>
                                    ) : (
                                        <Avatar
                                            name={userDetails?.firstName as string}
                                            maxInitials={2}
                                            size="30"
                                            round={true}
                                            style={{ color: "black" }}

                                        />
                                    )}
                                </div>
                                <p className="truncate md:max-w-[100px] capitalize" title={userDetails?.firstName}>
                                    {userDetails?.firstName}
                                </p>
                            </div>
                            <ul className="md:p-3  p-2 md:text-[14px] text-sm flex flex-col items-start justify-start gap-2">
                                <Link href="/profile">
                                    <li className="flex flex-row items-center justify-center gap-2 cursor-pointer">
                                        <div>
                                            <MdManageAccounts size={20} />
                                        </div>
                                        <p className="md:text-[14px] text-sm font-semiBold">
                                            Profile
                                        </p>
                                    </li>
                                </Link>
                                <li className="flex flex-row items-center justify-center gap-2 cursor-pointer" onClick={() => { setIsLogoutPopup(true); }}>
                                    <div><MdLogout size={20} /></div>
                                    <p className="md:text-[14px] text-sm font-semiBold">Logout</p>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <Link href="/login">
                    {/* <div>
                        <div className="md:my-0 md-mx-0 -my-2 -mx-4 md:px-4 text-md"> Login</div>
                    </div> */}
                </Link>
            )}

            {isOpenLogoutPopup ? (
                <> <LogoutPopup
                    isLogoutDialogOpen={isOpenLogoutPopup}
                    setIsLogoutDialogOpen={setIsLogoutPopup}
                    setIsOpen={setIsLogoutPopup}
                />
                </>
            ) : null}
        </div>
    );
};

export default LoginProfilButton;
