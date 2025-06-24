"use client";
import TabsComponentSelector from "./TabsComponentSelector";
import GraphComponentSelector from "./GraphComponentSelector";
import EnhancedDatePickerComponent from "./DatePickerComponent";


type Props = {
  handleSelectComponent: any;
  handleRemoveComponent: any;
  handleTimeFrameChange: any;
  handleStartDateChange: any;
  handleEndDateChange: any;
  handleYTDClick: any;
  timeFrame: string;
  startDate: any;
  endDate: any;
  selectedComponents: any;
  setOpenDropdown: any;
  openDropdown: boolean;
  TabshandleSelectComponent: any;
  TabshandleRemoveComponent: any;
  tabSelectedComponents: any;
  componentOptions: any;
  handleClear: any
};

type Deal = {};

const AllFiltersComponents = ({
  TabshandleSelectComponent,
  tabSelectedComponents,
  handleSelectComponent,
  handleEndDateChange,
  handleStartDateChange,
  handleYTDClick,
  startDate,
  endDate,
  selectedComponents,
  componentOptions,
  handleClear
}: Props) => {


  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };



  return (
    <div className="flex flex-col gap-6 container mx-auto">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 justify-between items-center">
        <div className="flex w-full lg:w-[50%] gap-4">
          <div className="w-full">
            <TabsComponentSelector
              selectedComponents={tabSelectedComponents}
              onSelectComponent={TabshandleSelectComponent}
            />
          </div>
          <div className="lg:w-[600px] w-full">
            <GraphComponentSelector
              selectedComponents={selectedComponents}
              onSelectComponent={handleSelectComponent}
              componentOptions={componentOptions}
            />
          </div>
        </div>

        <div className="w-full flex lg:flex-row flex-col gap-3 justify-start lg:items-center items-start z-10">
          <EnhancedDatePickerComponent
            startDate={startDate}
            endDate={endDate}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
            handleYTDClick={handleYTDClick}
          />


          <div className="flex  justify-center items-center px-1">
            {!(isToday(startDate) && isToday(endDate)) && (
              <button
                onClick={handleClear}
                className="px-4 py-2 w-[120px] bg-admin-buttonprimary text-white rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AllFiltersComponents;
