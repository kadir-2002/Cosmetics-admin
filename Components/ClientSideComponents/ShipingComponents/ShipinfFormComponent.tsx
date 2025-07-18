import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BsPuzzleFill } from "react-icons/bs";
import {
  shipingTogggleUpdatedApi,
  shipingUpdatedApi,
  shippingAllDataApi,
} from "@/apis/shipingFormApi";
import { clearUserDetails } from "@/redux/userSlice";

const ShippingFormComponent = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    state: "",
    intra_state_rate: "",
    inter_state_rate: "",
    is_active: false,
  });
  const [existingData, setExistingData] = useState<any>(null);

  const token = useSelector((state: any) => state.user?.token);
  const createdBy = useSelector((state: any) => state.user?.details?.id);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchShippingData = async () => {
    try {
      const res = await shippingAllDataApi(token);
      if (res?.detail === "Invalid or expired token") {
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");
        return;
      }
      if (res?.rates?.length > 0) {
        const data = res.rates[0];
        setExistingData(data);
        setFormData({
          id: data.id.toString(),
          state: data.state,
          intra_state_rate: data.intra_state_rate,
          inter_state_rate: data.inter_state_rate,
          is_active: data.is_active,
        });
      }
    } catch (error) {
      console.error("Error fetching shipping data:", error);
    }
  };

  useEffect(() => {
    fetchShippingData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
  const { id, state, intra_state_rate, inter_state_rate } = formData;

  if (!state || !intra_state_rate || !inter_state_rate) {
    toast.error("All fields are required.");
    return;
  }

  try {
    const res = await shipingUpdatedApi(
      id, // ✅ pass ID directly
      { state, intra_state_rate, inter_state_rate },
      createdBy,
      token
    );

    if (res?.status === 200) {
      toast.success("Shipping details updated successfully!");
      fetchShippingData();
      setIsFormOpen(false);
    } else if (res?.data?.detail === "Invalid token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
  } catch (error) {
    toast.error("Failed to update shipping.");
  }
};


  return (
    <div className='bg-white shadow-md rounded-lg w-full flex flex-col justify-center items-center'>
      <div className='w-full overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead className='bg-admin-secondary text-admin-text-primary lg:text-lg text-sm'>
            <tr>
              <th className='p-3 text-center'>Shipping Settings</th>
              <th className='p-3 text-center'>Manage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='p-3 text-center'>Shipping Configuration</td>
              <td className='p-3 text-center'>
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className='bg-admin-buttonprimary text-white px-4 py-2 rounded-md'
                >
                  Manage
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className='mt-2 flex shadow-lg rounded-md justify-center items-center lg:p-4 p-4 w-full bg-[#F9FAFB]'>
          <div className='lg:ml-12 w-full rounded-md'>
            <div className='grid lg:grid-cols-2 grid-cols-1 gap-5 w-full'>
              {/* State */}
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='text'
                  placeholder='State'
                  value={formData.state}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent'
                  onChange={(e) => handleChange("state", e.target.value)}
                  required
                />
                <label
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  State
                </label>
              </div>

              {/* Intra-State Rate */}
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='number'
                  placeholder='Intra-State Rate'
                  value={formData.intra_state_rate}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent'
                  onChange={(e) => handleChange("intra_state_rate", e.target.value)}
                  required
                />
                <label
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Intra-State Rate
                </label>
              </div>

              {/* Inter-State Rate */}
              <div className='flex bg-[#F3F3F3] p-2 relative w-full h-12 rounded-lg shadow-sm'>
                <BsPuzzleFill color='#A5B7C0' size={26} />
                <input
                  type='number'
                  placeholder='Inter-State Rate'
                  value={formData.inter_state_rate}
                  className='peer bg-[#F3F3F3] focus:outline-none w-full px-4 py-1 text-gray-900 placeholder-transparent'
                  onChange={(e) => handleChange("inter_state_rate", e.target.value)}
                  required
                />
                <label
                  className='absolute left-12 -top-2.5 px-1 rounded-md text-sm text-gray-600 bg-[#F3F3F3] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm'
                >
                  Inter-State Rate
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className='flex justify-center items-center gap-4 w-full mt-6'>
              <button
                type='button'
                onClick={handleUpdate}
                className='bg-admin-buttonprimary text-white px-4 py-2 rounded-md hover:bg-gray-700'
              >
                Save
              </button>
              <button
                onClick={() => setIsFormOpen(false)}
                className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingFormComponent;
