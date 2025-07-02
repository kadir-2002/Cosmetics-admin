"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { addresCreateApi, addressApi, customerAddresDeleteApi, updateAddresApi } from "@/apis/customerApi";
import RoleDeletePopUpComponent from "../RoleFormComponents/RoleDeleteComponent";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { clearUserDetails } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
interface AddAddressComponents {
    isopenaddres: boolean;
    setIsopenAddre: (value: boolean) => void;
    user: any;
    token: string
}

const AddAddressComponent: React.FC<AddAddressComponents> = ({
    isopenaddres,
    setIsopenAddre,
    user,
    token,
}) => {
    const [isaddres, setIsaddres] = useState([])
    const [isOpenDeletePopup, setIsLogoutPopup] = useState<boolean>(false);
    const [selectedRoleId, setSelectCustomerid] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [newUser, setNewUser] = useState({ id: "", address: "", locality: "", city: "", state: "", country: "", zipcode: "", });
    const [openForm, setOpenForm] = useState<boolean>(false)
    const created_by = useSelector((state: any) => state?.user?.details?.id);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleCreateOrUpdateadddres = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { id, address, locality, city, state, country, zipcode, } = newUser
        if (!address.trim() || !city.trim() || !state.trim() || !zipcode.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }
        try {
            let response;
            if (isEdit) {
                response = await updateAddresApi(id, user, address, locality, city, state, country, zipcode, created_by);
                if (response?.status === 200) {
                    toast.success("Customer Address Updated Successfully");
                    setIsEdit(false);
                } else {
                    toast.error("Failed to update customer address.");
                }
            } else {
                response = await addresCreateApi(
                    user, address, locality, city, state, country, zipcode, created_by
                );
                if (response?.status === 201) {
                    toast.success("Address Created Successfully");
                } else if (response?.status === 400) {
                    toast.error("Failed to create customer address.");
                } else {
                    toast.error("Failed to create customer address.");
                }
            }
            if (response?.status === 200 || response?.status === 201) {
                loadAddress();
                setNewUser({ id: "", address: "", locality: "", city: "", state: "", country: "", zipcode: "", });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please check your input.");
        }
    };
    const handleDelete = async (id: string) => {
        setSelectCustomerid(id);
        setIsLogoutPopup(true);
    };

    const handleEdit = (users: { id: string; address: string; locality: string; city: string; state: string; country: string; zipcode: string; }) => {
        setOpenForm(true)
        setNewUser({
            id: users?.id,
            address: users.address,
            locality: users.locality,
            city: users.city,
            state: users.state,
            country: users.country,
            zipcode: users.zipcode,
        });
        setIsEdit(true);
        // console.log("users.id", users.id)
    };
    const handlecCancleEdit = () => {
        setIsEdit(false);
        setNewUser({ id: "", address: "", locality: "", city: "", state: "", country: "", zipcode: "" });

    }

    const handleDeleteConform = async (id: string) => {
        try {
            const response = await customerAddresDeleteApi(id, user);
            if (response?.success) {
                toast.success("Addres deleted successfully");
                setIsLogoutPopup(false);
                loadAddress();
            } else {
                console.error("Unexpected response format:", response);
            }
        } catch (error) {
            console.error("Failed to delete role:");
        }
    };

    const loadAddress = async () => {
        if (user) {
            const response = await addressApi(user, token);
            if (response?.status === 401) {
                dispatch(clearUserDetails());
                toast.error("Session Expired, Please Login Again")
                router.push("/");
                return;
            }
            if (response?.body.addresses) {
                setIsaddres(response?.body.addresses);
            }
        }
    };
    useEffect(() => {
        loadAddress();
    }, [user]);
    const handleopenform = () => {
        setOpenForm(!openForm)
    }
    return (
        <Transition.Root show={isopenaddres} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setIsopenAddre(false)}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div
                    className="fixed inset-0 z-999"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >

                            <Dialog.Panel className="flex relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all max-w-5xl w-full">
                                <div className="absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold" onClick={() => {
                                    setIsopenAddre(false);
                                }}>
                                    <button>
                                        <RxCross2 size={20} />
                                    </button>
                                </div>
                                <div className="w-full overflow-auto">
                                    <div className="mx-auto bg-white shadow-lg rounded-lg p-6 w-full">
                                        <div className="flex justify-between items-center mb-4 ">
                                            <h2 className="lg:text-2xl text-xl text-[#577C8E] font-bold"> Address</h2>
                                        </div>

                                        <table className="w-full mt-6 w-7xl ">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="p-2">Address</th>
                                                    <th className="p-2">Locality</th>
                                                    <th className="p-2">City</th>
                                                    <th className="p-2">State</th>
                                                    <th className="p-2">Country</th>
                                                    <th className="p-2">Zipcode</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isaddres.map((item: any, index: any) => (
                                                    <tr key={index} className="text-left">
                                                        <td className=" p-2">{item.address}</td>
                                                        <td className=" p-2">{item.locality}</td>
                                                        <td className=" p-2">{item.city}</td>
                                                        <td className=" p-2">{item.state}</td>
                                                        <td className=" p-2">{item.country}</td>
                                                        <td className=" p-2">{item.zipcode}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* {isOpenDeletePopup && (
                                        <RoleDeletePopUpComponent
                                            isOpenDeletePopup={isOpenDeletePopup}
                                            handleDeleteConform={() => handleDeleteConform(selectedRoleId)}
                                            setIsLogoutDialogOpen={setIsLogoutPopup}
                                            setIsOpen={setIsLogoutPopup}
                                        />
                                    )} */}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default AddAddressComponent;
