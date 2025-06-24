import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";

interface RoleFilterpopupComponentProps {
  role: any;
  isOpenRoleFilterPopup: boolean;
  SetIsOpenRoleFilterPopup: (value: boolean) => void;
  setIsOpens: (value: boolean) => void;
  handlefilter: (value: any) => void;
  isfiltervalue: any,
}

const RoleFilterpopupComponent: React.FC<RoleFilterpopupComponentProps> = ({
  role,
  isOpenRoleFilterPopup,
  SetIsOpenRoleFilterPopup,
  setIsOpens,
  handlefilter,
  isfiltervalue
}) => {
  return (
    <Transition.Root show={isOpenRoleFilterPopup} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => SetIsOpenRoleFilterPopup(false)}
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
              <Dialog.Panel className="flex relative transform overflow-y-auto rounded-lg max-h-[400px]  bg-white text-center shadow-xl transition-all lg:max-w-md w-full">
                <div
                  className="cursor-pointer top-0 right-0 absolute flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold"
                  onClick={() => SetIsOpenRoleFilterPopup(false)}>
                  <RxCross2 size={20} />
                </div>
                <div className="bg-white text-center w-full">
                  <div className="flex items-start justify-between border-b-[2px] text-[#577C8E] p-4">
                    <div className="w-full lg:text-xl text-xl font-semibold">
                      Select Role
                    </div>

                  </div>
                  <div
                    className="w-full hover:bg-blue-100 text-lg py-2 cursor-pointer border-b-[1px]"
                    onClick={() => {
                      handlefilter("");
                      SetIsOpenRoleFilterPopup(false);
                    }}
                  >
                    All
                  </div>

                  <div className="">
                    {role.map((data: any, index: any) => (
                      <div
                        key={index}
                        className={`w-full text-lg py-2 cursor-pointer border-b-[1px] ${isfiltervalue?.name === data.name ? "bg-gray-200" : "hover:bg-blue-100"
                          }`}
                        onClick={() => {
                          handlefilter(data);
                          SetIsOpenRoleFilterPopup(false); // Close the popup after selection
                        }}
                      >
                        {data.name}
                      </div>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default RoleFilterpopupComponent;
