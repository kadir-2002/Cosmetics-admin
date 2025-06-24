"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import AllFiltersComponents from "./AllFiltersComponents";
import SortableItem from "./SortableItem";
import SummaryDataComponent from "./SummaryDataComponent";
import LineChart from "./LineChart";
import {
  dashboardAllDataApi,
  dashboardSettingApi,
  dashboardTabDataApi,
} from "@/apis/dashboardApi";
import TopSellingProducts from "./Topsellingproduct";
import OrderSummary from "./OrderSummary";
import UserComponent from "./UserComponent";
import LatestPaymentTransactions from "./LatestPaymentTransactions";
import TopCustomers from "./TopCustomersComponent";
import LowStockProductComonent from "./LowStockProductComonent";
import LeastsellingproductsCompoent from "./LeastsellingproductsCompoent";
import UnsolvedProductCompnent from "./UnsolvedProductCompnent";
import ProductDataComponent from "./ProductDataComponent";
import { RxCross1 } from "react-icons/rx";
import RecentOrdersDataComponent from "./RecentOrdersDataComponent";
import RevenueTaxDistributionPieChart from "./RevenueTaxDistributionPieChart";
import OrderSaleBarGraphComponent from "./OrderSaleBarGraphComponent";
import { clearUserDetails } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ComponentOption = {
  id: string;
  label: string;
  roles?: string[];
};

type Props = {};

const componentMap = {
  linechart: {
    component: LineChart,
  },
  user_data: {
    component: UserComponent,
  },
  product_data: {
    component: ProductDataComponent,
  },
  order_data: {
    component: OrderSummary,
  },
  order_payment_data: {
    component: RevenueTaxDistributionPieChart,
  },
  top_customers_data: {
    component: TopCustomers,
  },
  recent_payment_transactions_data: {
    component: LatestPaymentTransactions,
  },
  top_selling_products_data: {
    component: TopSellingProducts,
  },
  least_selling_products_data: {
    component: LeastsellingproductsCompoent,
  },
  unsold_products_data: {
    component: UnsolvedProductCompnent,
  },
  low_stock_products_data: {
    component: LowStockProductComonent,
  },
  order_sale_graph: {
    component: OrderSaleBarGraphComponent,
  },
  recent_orders_data: {
    component: RecentOrdersDataComponent,
  },
};

const MainDashboardComponent = (props: Props) => {
  const token = useSelector((state: any) => state?.user?.token);
  const created_by = useSelector((state: any) => state?.user?.details?.id);
  const userDetails = useSelector((state: any) => state?.user);
  const [graphData, setGraphData] = useState<any>(null);
  const [commisionData, setCommisionData] = useState<any>(null);
  const [servicesGraphData, setServicesGraphData] = useState<any>(null);
  const [timeFrame, setTimeFrame] = useState<string>("months");
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const storedStartDate = localStorage.getItem("startDate");
    return storedStartDate ? new Date(storedStartDate) : new Date();
  });

  const [endDate, setEndDate] = useState<Date | null>(() => {
    const storedEndDate = localStorage.getItem("endDate");
    return storedEndDate ? new Date(storedEndDate) : new Date();
  });
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [tabSelectedComponents, setTabsSelectedComponents] = useState<string[]>(
    []
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // We are storing the data in the localStorage because there is requirement if user select the date and open any module page date does not change, after page refresh changed date needs to remain same
  useEffect(() => {
    if (startDate) {
      localStorage.setItem("startDate", startDate.toISOString());
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      localStorage.setItem("endDate", endDate.toISOString());
    }
  }, [endDate]);

  const handleClear = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
  };

  const fetchSequenceComponent = useCallback(async () => {
    try {
      const combinedComponents = [
        ...selectedComponents,
        ...tabSelectedComponents,
      ];
      const transformedData = combinedComponents.reduce(
        (acc: any, value: any, index: number) => {
          acc[value] = index; // Use value as key and index as value
          return acc;
        },
        {}
      );

      const response = await dashboardSettingApi(
        created_by,
        transformedData,
        token
      );
    } catch (error) {
      console.error("Error fetching component sequence:", error);
    }
  }, [created_by, token, tabSelectedComponents, selectedComponents]);

  // useEffect(() => {

  //  if (tabSelectedComponents.length > 0 || selectedComponents.length > 0) {
  //     fetchSequenceComponent();
  //   }
  // }, [tabSelectedComponents, selectedComponents]);

  const dashboardTabData = useCallback(async () => {
    try {
      const response: any = await dashboardTabDataApi(created_by, token);
      if (response?.detail === "Invalid token") {
        if (!tokenErrorShown.current) {
          tokenErrorShown.current = true; // Prevent further toasts
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
        return;
      }
      if (response?.sections) {
        const tabNames = [
          "products_sold",
          "new_customer_count",
          "average_order_value",
          "revenue_data",
        ];
        const tabs = response.sections.filter((section: any) =>
          tabNames.includes(section)
        );
        const components = response.sections.filter(
          (section: any) => !tabNames.includes(section)
        );
        setSelectedComponents(components);
        setTabsSelectedComponents(tabs);
      }
    } catch (error) {
      console.error("Error fetching sequence data:", error);
    }
  }, []);

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    dashboardTabData().then(() => setDataLoaded(true));
  }, []);

  useEffect(() => {
    if (
      dataLoaded &&
      (tabSelectedComponents.length > 0 || selectedComponents.length > 0)
    ) {
      fetchSequenceComponent();
    }
  }, [tabSelectedComponents, selectedComponents, dataLoaded]);

  const tokenErrorShown = useRef(false);
  const fetchAlldataSequence = useCallback(async () => {
    try {
   
      await new Promise((resolve) => setTimeout(resolve, 200));

      const formatDateToLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const formattedStartDate = startDate ? formatDateToLocal(startDate) : null;
      const formattedEndDate = endDate ? formatDateToLocal(endDate) : null;
 
      const response: any = await dashboardAllDataApi(
        created_by,
        formattedStartDate,
        formattedEndDate,
        token
      );
      if (response?.detail === "Invalid token") {
        if (!tokenErrorShown.current) {
          tokenErrorShown.current = true; // Prevent further toasts
          dispatch(clearUserDetails());
          toast.error("Session Expired, Please Login Again");
          router.push("/");
        }
        return;
      }
      if (response) {
        setCommisionData(response);
        setGraphData(response);
      }
    } catch (error) {
      console.error("Error fetching sequence data:", error);
    }
  }, [created_by, startDate, endDate]);

  useEffect(() => {
    fetchAlldataSequence();
  }, [
    created_by,
    tabSelectedComponents,
    selectedComponents,
    startDate,
    endDate,
  ]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSelectedComponents((prevItems) => {
        const oldIndex = prevItems.indexOf(active.id);
        const newIndex = prevItems.indexOf(over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };
  const handleSelectComponent = (componentId: string) => {
    setSelectedComponents((prev) =>
      !prev.includes(componentId) ? [...prev, componentId] : prev
    );
  };

  const handleRemoveComponent = useCallback((componentId: string) => {
    setSelectedComponents((prevComponents) =>
      prevComponents.filter((id) => id !== componentId)
    );
  }, []);

  const handleTimeFrameChange = (time: string) => setTimeFrame(time);
  const today = new Date();

  // const handleStartDateChange = (date: Date | null) => {
  //   if (!date) return;

  //   if (date > today) return;

  //   setStartDate(date);
  // };

  // const handleEndDateChange = (date: Date | null) => {
  //   if (!date) return;

  //   if (startDate && date < startDate) return;

  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   if (date > today) return;
  //   setEndDate(date);
  // };



  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
  
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
  
    if (selectedDate > today) return;
    if (endDate && selectedDate > endDate) {
      const newEndDate = new Date(selectedDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      if (newEndDate <= today) {
        setEndDate(newEndDate);
      } else {
        setEndDate(today);
      }
    }
  
    setStartDate(selectedDate);
  };
  
  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
  
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
  
    if (selectedDate > today) return;
  
    // Auto-adjust startDate if it's after new endDate
    if (startDate && selectedDate < startDate) {
      const newStartDate = new Date(selectedDate);
      newStartDate.setDate(newStartDate.getDate() - 1);
      setStartDate(newStartDate);
    }
  
    setEndDate(selectedDate);
  };
  

  
  const handleYTDClick = () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    setStartDate(oneYearAgo);
    setEndDate(new Date());
  };
  const TabshandleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTabsSelectedComponents((prevItems) => {
        const oldIndex = prevItems.indexOf(active.id);
        const newIndex = prevItems.indexOf(over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  const TabshandleSelectComponent = (componentId: string) => {
    setTabsSelectedComponents((prev) =>
      !prev.includes(componentId) ? [...prev, componentId] : prev
    );
  };

  const TabshandleRemoveComponent = useCallback((componentId: string) => {
    setTabsSelectedComponents((prevComponents) =>
      prevComponents.filter((id) => id !== componentId)
    );
  }, []);

  const componentOptions: ComponentOption[] = [
    {
      id: "order_sale_graph",
      label: "Order Sale Graph",
    },
    {
      id: "user_data",
      label: "User and Customers",
    },
    {
      id: "product_data",
      label: "Product",
    },
    {
      id: "order_data",
      label: "Order Summery",
    },
    {
      id: "order_payment_data",
      label: "Payment Distribution Amount",
    },
    {
      id: "top_customers_data",
      label: "Top Customers",
    },
    {
      id: "recent_payment_transactions_data",
      label: "Recent Payment Transactions",
    },
    {
      id: "top_selling_products_data",
      label: "Top Selling Product",
    },
    {
      id: "least_selling_products_data",
      label: "Least Selling Products",
    },
    {
      id: "unsold_products_data",
      label: "Unsold Products",
    },
    {
      id: "low_stock_products_data",
      label: "Low Stock Products",
    },
    {
      id: "recent_orders_data",
      label: "Recent Orders Data",
    },
  ];

  const getComponentLabel = (componentId: string) => {
    const component = componentOptions.find(
      (option) => option.id === componentId
    );
    return component ? component.label : componentId;
  };

  const getAvailableComponents = () => {
    return componentOptions.filter((option) => {
      if (!option.roles) return true;
      return option.roles.includes(userDetails?.userRole?.toLowerCase());
    });
  };

  return (
    <div className='w-full lg:px-4 px-0 h-auto mb-12'>
      <AllFiltersComponents
        TabshandleSelectComponent={TabshandleSelectComponent}
        TabshandleRemoveComponent={TabshandleRemoveComponent}
        tabSelectedComponents={tabSelectedComponents}
        handleSelectComponent={handleSelectComponent}
        handleRemoveComponent={handleRemoveComponent}
        handleTimeFrameChange={handleTimeFrameChange}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
        handleYTDClick={handleYTDClick}
        timeFrame={timeFrame}
        startDate={startDate}
        endDate={endDate}
        selectedComponents={selectedComponents}
        setOpenDropdown={setOpenDropdown}
        openDropdown={openDropdown}
        componentOptions={getAvailableComponents()}
        handleClear={handleClear}
      />
      {tabSelectedComponents?.length > 0 && (
        <SummaryDataComponent
          graphData={graphData}
          TabshandleDragEnd={TabshandleDragEnd}
          tabSelectedComponents={tabSelectedComponents}
          TabshandleSelectComponent={TabshandleSelectComponent}
          TabshandleRemoveComponent={TabshandleRemoveComponent}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {selectedComponents?.length > 0 && (
        <div className='container mx-auto py-2'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedComponents}
              strategy={rectSortingStrategy}
            >
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full h-full'>
                {selectedComponents?.map((componentId) => {const { component: Component } =componentMap[componentId as keyof typeof componentMap];
                  return (
                    <SortableItem key={componentId} id={componentId}>
                      <div className='bg-white border-[1px] border-gray-200 rounded-lg'>
                        <div className='bg-admin-dashboardprimary flex justify-between items-center rounded-t-lg border border-light-blue p-2'>
                          <h3 className='text-[24px] text-white px-10'>
                            {getComponentLabel(componentId)}
                          </h3>
                          <button
                            onClick={() => handleRemoveComponent(componentId)}
                            className='text-white transition-colors duration-200'>
                            <RxCross1 size={26} />
                          </button>
                        </div>
                        <Component
                          graphData={graphData}
                          servicesGraphData={servicesGraphData}
                          startDate={startDate}
                          endDate={endDate}
                          commisionData={commisionData}
                        />
                      </div>
                    </SortableItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default MainDashboardComponent;
