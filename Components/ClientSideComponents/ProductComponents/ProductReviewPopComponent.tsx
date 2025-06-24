"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { reviewAllDataApi, ReviewToggleUpdatedApi } from "@/apis/ratingApi";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface LogoutPopupProps {
  isOpenInfoPopup: boolean;
  setIsInfoPopup: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
  isParentProductId: any;
}
const ProductReviewPopComponent: React.FC<LogoutPopupProps> = ({
  isOpenInfoPopup,
  setIsInfoPopup,
  setIsOpen,
  isParentProductId,
}) => {
  const updated_by = useSelector((state: any) => state?.user?.details?.id);
  const token = useSelector((state: any) => state?.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isReviews, setReviews] = useState<[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(4);

  const fetchReview = async () => {
    try {
      const response = await reviewAllDataApi({
        product: isParentProductId,
        current_page: currentPage,
        page_size: pageSize,
        token: token,
      });
      setReviews(response?.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };
  useEffect(() => {
    fetchReview();
  }, [isParentProductId]);

  const activeHandler = async (data: any, isActive: boolean) => {
    const response = await ReviewToggleUpdatedApi(
      data?.id,
      isParentProductId,
      isActive,
      updated_by,
      token
    );
    if (response?.status === 200) {
      fetchReview();
    } else if (response?.data?.detail === "Invalid token") {
      dispatch(clearUserDetails());
      toast.error("Session Expired, Please Login Again");
      router.push("/");
    }
  };
  return (
    <Transition.Root show={isOpenInfoPopup} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={() => setIsInfoPopup(false)}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>
        <div
          className='fixed inset-0 z-999'
          onClick={(event) => event.stopPropagation()}
        >
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all lg:max-w-5xl w-full'>
                <div className='bg-white py-4'>
                  <div className='overflow-x-auto lg:max-w-6xl w-full'>
                    <table className='w-full border-collapse'>
                      <thead className='border-b-[2px] border-[#577C8E] text-[#577C8E] lg:text-lg'>
                        <tr>
                          <th className='p-4 text-center'>Name</th>
                          <th className='p-4 text-center'>Date</th>
                          <th className='p-4 text-center'>Rating</th>
                          <th className='p-4 text-center w-32'>Is Active</th>
                          <th className='p-4 text-center'>Review</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isReviews.map((data: any, index: any) => (
                          <tr key={index} className='border-b'>
                            <td className='p-4 text-center'>
                              {data?.created_by}
                            </td>
                            <td className='p-4 capitalize text-center'>
                              {data?.created_at}
                            </td>
                            <td className='p-4 text-center'>
                              {data?.rating} / 5
                            </td>
                            <td className='p-4 text-center'>
                              <Switch
                                checked={data.is_active}
                                onChange={() =>
                                  activeHandler(data, !data.is_active)
                                }
                                className={`${
                                  data.is_active
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                } relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-200 ease-in-out`}
                              >
                                <span
                                  className={`${
                                    data.is_active
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  } inline-block w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out`}
                                />
                              </Switch>
                            </td>
                            <td className='p-4 text-center'>{data?.review}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {isReviews.length === 0 && (
                      <div className='text-center p-4'>No Review available</div>
                    )}
                  </div>
                </div>
                <div
                  className='absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold'
                  onClick={() => {
                    setIsOpen(false);
                    setIsInfoPopup(false);
                  }}
                >
                  <button>
                    <RxCross2 size={20} />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ProductReviewPopComponent;
