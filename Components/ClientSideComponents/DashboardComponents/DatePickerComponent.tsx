import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendar } from "react-icons/ci";
type Props = {
  startDate: Date | null;
  endDate: Date | null;
  handleStartDateChange: (date: Date | null) => void;
  handleEndDateChange: (date: Date | null) => void;
  handleYTDClick: () => void;
};

const EnhancedDatePickerComponent: React.FC<Props> = ({
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange,
  handleYTDClick,
}) => {


  
  return (
    <div className="w-full lg:max-w-[27rem]">
      <div className="grid lg:grid-cols-2 grid-cols-2 gap-4 lg:items-end justify-center items-center">
        <div className="w-full">
          <div className="relative z-9">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              placeholderText="Select start date"
              dateFormat="yyyy/MM/dd"
              className="w-full pl-12 pr-4 text-lg py-2.5 border font-semibold border-light-blue text-black rounded-lg bg-light-blue focus:outline-none"
              popperClassName="custom-popper"
              popperPlacement="bottom-end"
            />
            <div className="absolute left-5 top-[49%] transform -translate-y-1/2 text-black">
              <CiCalendar size={20} className="text-black " />
            </div>
          </div>
        </div>
        <div className="w-full">
          {/* <label className="block text-sm font-medium text-gray-700">
            End Date
          </label> */}
          <div className="relative z-9">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              placeholderText="Select end date"
              dateFormat="yyyy/MM/dd"
              className="w-full pl-12 text-lg  pr-4 py-2.5 font-semibold border border-light-blue text-black rounded-lg bg-light-blue
                focus:outline-none"
              calendarClassName="custom-calendar"
              popperClassName="custom-popper"
              popperPlacement="bottom-start"
            />
            <div className="absolute left-5 top-[49%] transform -translate-y-1/2 text-black">
              <CiCalendar size={20} className="text-black" />
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .custom-calendar .react-datepicker {
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .custom-calendar .react-datepicker__header {
          background-color: #CEE4FF;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        .custom-calendar .react-datepicker__day--selected {
          background-color: #CEE4FF !important;
          color: black !important;
        }
        .custom-calendar .react-datepicker__day:hover {
          background-color: #CEE4FF !important;
        }
      `}</style>
    </div>
  );
};

export default EnhancedDatePickerComponent;
