"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";

interface LogoutPopupProps {
  role: any; 
  isOpenInfoPopup: boolean;
  setIsInfoPopup: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
}
// Define this function outside or in a utils file
// export const formatIST = (utcDateStr: string | undefined): string => {
//   if (!utcDateStr) return '';
//   return new Date(utcDateStr).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
// };

const monthMap: Record<string, number> = {
  Jan: 0, January: 0,
  Feb: 1, February: 1,
  Mar: 2, March: 2,
  Apr: 3, April: 3,
  May: 4,
  Jun: 5, June: 5,
  Jul: 6, July: 6,
  Aug: 7, August: 7,
  Sep: 8, Sept: 8, September: 8,
  Oct: 9, October: 9,
  Nov: 10, November: 10,
  Dec: 11, December: 11,
};

function buildDateIST(
  yearStr: string,
  monthStr: string,
  dayStr: string,
  hourStr: string,
  minuteStr: string,
  ampm: string
): Date {
  const year = Number(yearStr);
  const month = monthMap[monthStr];
  const day = Number(dayStr);
  let hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (ampm.toUpperCase() === 'PM' && hour < 12) {
    hour += 12;
  } else if (ampm.toUpperCase() === 'AM' && hour === 12) {
    hour = 0;
  }

  // IST is UTC +5:30, so to get UTC Date, subtract 5:30
  // Create Date in UTC by subtracting offset:
  // new Date(Date.UTC(year, month, day, hour, minute)) creates a UTC date
  // subtract 5h30m to get UTC from IST input

  // IST offset in minutes:
  const IST_OFFSET = 5 * 60 + 30;

  // Get UTC time by subtracting IST offset in minutes
  const utcDate = new Date(Date.UTC(year, month, day, hour, minute));
  utcDate.setMinutes(utcDate.getMinutes() - IST_OFFSET);

  return utcDate;
}

export const formatIST = (input?: string): string => {
  if (!input) return '';

  const trimmed = input.trim();

  // Check if ISO string with TZ info
  const isISOWithTZ = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[\+\-]\d{2}:\d{2})/.test(trimmed);

  let date: Date;

  if (isISOWithTZ) {
    date = new Date(trimmed);
  } else {
    // Normalize AM/PM spacing and case
    let cleaned = trimmed
      .replace(/\b(am|pm)\b/i, (m) => m.toUpperCase())
      .replace(/(\d)(AM|PM)/, '$1 $2')
      .replace(/\s+at\s+/i, ', ');

    const regex = /^(?:(\w+),?\s)?(\d{1,2})\s([A-Za-z]+)\s(\d{4}),?\s(\d{1,2}):(\d{2})\s?(AM|PM)$/;
    const match = cleaned.match(regex);

    if (!match) {
      const regexNoWeekday = /^(\d{1,2})\s([A-Za-z]+)\s(\d{4})\s(\d{1,2}):(\d{2})\s?(AM|PM)$/;
      const match2 = cleaned.match(regexNoWeekday);

      if (!match2) return 'Invalid date';

      const [_, day, monthStr, year, hourStr, minuteStr, ampm] = match2;
      date = buildDateIST(year, monthStr, day, hourStr, minuteStr, ampm);
    } else {
      const [_, weekday, day, monthStr, year, hourStr, minuteStr, ampm] = match;
      date = buildDateIST(year, monthStr, day, hourStr, minuteStr, ampm);
    }
  }

  if (isNaN(date.getTime())) return 'Invalid date';

  // Format in IST timezone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleString('en-IN', options);
};

const OrderInfoComponent: React.FC<LogoutPopupProps> = ({
  role,
  isOpenInfoPopup,
  setIsInfoPopup,
  setIsOpen,
}) => {
  return (
    <Transition.Root show={isOpenInfoPopup} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsInfoPopup(false)}   >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"   
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-999" onClick={(event) => event.stopPropagation()}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 lg:max-w-4xl w-full">
                <div className="bg-white px-6 py-4">
                  <div className="px-6 py-2">
                    <div className="grid grid-cols-1">
                      <div className="flex gap-2 border-b-[1px] py-2">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Created At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]"> {formatIST(role?.createdAt)}</div>
                      </div>
                      <div className="flex gap-2 border-b-[1px] py-2">
                        <div className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Updated At:</div>
                        <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]"> {formatIST(role?.updatedAt)}</div>
                      </div> 
                        {/* <div  className="text-lg text-[#577C8E] font-semibold  w-[40%] lg:w-[20%] flex items-center justify-between">Updated By:</div> */}
                        {/* <div className="text-lg text-gray-900  lg:w-[80%] w-[60%]">{role?.order_info?.updated_by}</div> */}
                     
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 cursor-pointer flex justify-center items-center bg-red-600 w-16 h-8 text-white font-semibold"  onClick={() => {
                      setIsOpen(false);
                      setIsInfoPopup(false);
                    }}>
                  <button
                   
                  >
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

export default OrderInfoComponent;
