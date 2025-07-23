"use client"
import { catagoryDataApi, productAllDataApi, tagDataApi } from "@/apis/productApi"
import ProductAllDataComponent from "@/Components/ClientSideComponents/ProductComponents/ProductAllDataComponent"
import ProductFormComponent from "@/Components/ClientSideComponents/ProductComponents/ProductFormComponent"
import { useSearchParams } from "next/navigation"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { clearUserDetails } from "@/redux/userSlice"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface SubCategory {
  id: number | string
  name: string
}

interface Category {
  id: number
  name: string
  subcategories: SubCategory[]
}

interface VariantSpecifications {
  [key: string]: string[]
}

const Page: React.FC = () => {
  const userDetails = useSelector((state: any) => state?.user?.details?.id)
  const [searchText, setSearchText] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [products, setProducts] = useState<any[]>([])
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isProductID, setProductID] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isTagData, setTagData] = useState([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [initSubCategories, setInitSubCategories] = useState<SubCategory[]>([])
  const [ordering, setOrdering] = useState("")
  const [isActiveInactiveFitlerPopup, setIsActiveInactiveFilterPopup] = useState<boolean>(false)
  const [isfiltervalue, setfiltervalue] = useState<string>("")
  const [iscaegoryvalue, setcategoryvalue] = useState<string>("")
  const [variantSpecifications, setVariantSpecifications] = useState<VariantSpecifications>({})
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalCount, setTotalCount] = useState<number>(0)


  // FIXED: Added tag_list to initial state
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    SKU: "",
    description: "",
    category: "",
    sub_catogry: "",
    base_price: "",
    selling_price: "",
    base_and_selling_price_difference_in_percent: "",
    stock: "",
    is_active: false,
    is_new_arrival: false,
    minimum_order_quantity: "",
    variants: { attribute: "", value: "" },
    low_stock_threshold: 5,
    weight: "",
    length: "",
    width: "",
    height: "",
    product_details: "",
    care_instruction: "",
    seo_title: "",
    seo_description: "",
    seo_keyword: "",
    warranty: "",
    delivery_or_installation_tips: "",
    material: "",
    weight_bearing_number: "",
    is_stackable: false,
    stackable_pieces_number: "",
    tag_list: [], // FIXED: Added this line
  })

  const searchParams = useSearchParams()
  const status = searchParams.get("is_active") || ""
  const isActive = status === "true" ? true : status === "false" ? false : undefined
  const is_stock = searchParams.get("is_in_stock") || ""
  const isStock = is_stock === "true" ? true : is_stock === "false" ? false : undefined
  const productIdString = searchParams.get("id") || ""
  const productId = productIdString ? Number.parseInt(productIdString, 10) : undefined
  const threshold = searchParams.get("threshold") || ""
  const isThreshold = threshold === "true" ? true : threshold === "false" ? false : undefined
  const isFromDashboard = !!(productIdString || status || is_stock)
  
  const token = useSelector((state: any) => state?.user?.token)
  const dispatch = useDispatch()
  const router = useRouter()
  const topRef = useRef<HTMLDivElement | null>(null)
  const [filterCategory, setFilterCategory] = useState<any>("")
  const [filterSubCategory, setFilterSubCategory] = useState<any>("")

  useEffect(() => {
    if (isActive === true) {
      setfiltervalue("Active")
    } else if (isActive === false) {
      setfiltervalue("Inactive")
    } else {
      setfiltervalue("")
    }
  }, [isActive, status])

  const isActivefilter = isfiltervalue === "Active" ? true : isfiltervalue === "Inactive" ? false : undefined

  // FIXED: Updated handleopenform to include tag_list
  const handleopenform = () => {
    setOpenForm(!openForm)
    setIsEdit(false)
    setVariantSpecifications({})
    setNewUser({
      id: "",
      name: "",
      description: "",
      SKU: "",
      category: "",
      sub_catogry: "",
      base_price: "",
      selling_price: "",
      base_and_selling_price_difference_in_percent: "",
      stock: "",
      is_active: false,
      is_new_arrival: false,
      minimum_order_quantity: "",
      variants: { attribute: "", value: "" },
      low_stock_threshold: 5,
      weight: "",
      length: "",
      width: "",
      height: "",
      product_details: "",
      care_instruction: "",
      seo_title: "",
      seo_description: "",
      seo_keyword: "",
      warranty: "",
      delivery_or_installation_tips: "",
      material: "",
      weight_bearing_number: "",
      is_stackable: false,
      stackable_pieces_number: "",
      tag_list: [], // FIXED: Added this line
    })
  }

  // FIXED: Updated handleEdit to properly set tag_list
  const handleEdit = (product: any) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setOpenForm(true)
    setProductID(product?.id)

    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }

    setVariantSpecifications(product?.variant_specifications)

    const selectedCategory = categories.find((category) => category.id === product?.category?.id)
    let updatedSubCategories: SubCategory[] = []
    let initialSubCategoryValue: string

    if (selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0) {
      updatedSubCategories = [{ id: "parent-category-only", name: "Root" }, ...selectedCategory.subcategories]

      if (product?.subcategoryId) {
        initialSubCategoryValue = product.subcategoryId
      } else {
        initialSubCategoryValue = "parent-category-only"
      }
    } else {
      updatedSubCategories = []
      initialSubCategoryValue = ""
    }

    setSubCategories(updatedSubCategories)
    setInitSubCategories(selectedCategory?.subcategories || [])

    // FIXED: Added proper tag_list handling
    console.log("Product data for editing:", product)
    console.log("Product tags:", product?.tags)
    console.log("Product tag_list:", product?.tag_list)

    setNewUser({
      id: product?.id,
      name: product?.name,
      SKU: product?.SKU,
      description: product?.description,
      category: product?.category?.id,
      sub_catogry: initialSubCategoryValue,
      base_price: product?.basePrice,
      selling_price: product?.sellingPrice,
      base_and_selling_price_difference_in_percent: product?.priceDifferencePercent,
      stock: product?.stock,
      is_active: product?.isActive,
      is_new_arrival: product?.isNewArrival,
      minimum_order_quantity: product?.minimum_order_quantity,
      variants: product?.variants,
      low_stock_threshold: product?.low_stock_threshold,
      weight: product?.weight,
      length: product?.length,
      width: product?.width,
      height: product?.height,
      product_details: product?.productDetails,
      care_instruction: product?.care_instruction,
      seo_title: product?.seoTitle,
      seo_description: product?.seoDescription,
      seo_keyword: product?.seoKeyword,
      warranty: product?.warranty,
      delivery_or_installation_tips: product?.delivery_or_installation_tips,
      material: product?.material,
      weight_bearing_number: product?.weight_bearing_number,
      is_stackable: product?.is_stackable,
      stackable_pieces_number: product?.stackable_pieces_number,
      // FIXED: Handle different possible tag data structures
      tag_list: product?.tags?.map((tag: any) => tag.id) || product?.tag_list || [],
    })

    setIsEdit(true)
  }

  const handleActiveFilter = (all: any) => {
    setIsActiveInactiveFilterPopup(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, tagResponse] = await Promise.all([catagoryDataApi(token), tagDataApi(token)])
        
        if(categoryResponse.body.message === "Invalid or expired token"){
        dispatch(clearUserDetails());
        toast.error("Session Expired, Please Login Again");
        router.push("/");      
        }
        const fetchedCategories = categoryResponse?.body?.categories
        const fetchedTags = tagResponse?.results

        if (fetchedCategories && fetchedTags) {
          setCategories(fetchedCategories)
          setTagData(fetchedTags)

          if (fetchedCategories.length > 0) {
            const firstCategory = fetchedCategories[0]
            setNewUser((prev: any) => ({
              ...prev,
              category: firstCategory.id,
              sub_catogry: "",
            }))
            setFilterCategory(firstCategory.id.toString())

            const subCats = firstCategory.subcategories || []
            if (subCats.length > 0) {
              const subCategoriesWithRootOption: SubCategory[] = [
                { id: "parent-category-only", name: "Root" },
                ...subCats,
              ]
              setSubCategories(subCategoriesWithRootOption)
              setFilterSubCategory("parent-category-only")
            } else {
              setSubCategories([])
              setFilterSubCategory("")
            }
          }
        } else if (
          categoryResponse?.body.message === "Invalid or expired token" ||
          tagResponse?.body.message === "Invalid or expired token"
        ) {
          dispatch(clearUserDetails())
          toast.error("Session Expired, Please Login Again")
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value
    setFilterCategory(categoryId)

    const selected = categories.find((cat: any) => cat.id === Number.parseInt(categoryId))
    const subCats = selected?.subcategories || []

    if (subCats.length > 0) {
      const subCategoriesWithRootOption: SubCategory[] = [{ id: "parent-category-only", name: "Root" }, ...subCats]
      setSubCategories(subCategoriesWithRootOption)
      setFilterSubCategory("parent-category-only")
    } else {
      setSubCategories([])
      setFilterSubCategory("")
    }
  }

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterSubCategory(e.target.value)
  }

  const fetchProducts = async () => {
    try {
      if (filterCategory) {
        const paramsToSend: any = {
          threshold: isThreshold,
          id: productId,
          is_in_stock: isStock,
          is_active: isActive,
          search: searchText,
          token: token,
          ordering: ordering,
          filterValue: isActivefilter,
          page: currentPage.toString(), // ✅ FIXED: Convert to string
          page_size: 10, // ✅ FIXED: Add page_size parameter
        }

        if (!isFromDashboard && searchText === "") {
          if (filterSubCategory === "parent-category-only") {
            paramsToSend.iscaegoryvalue = filterCategory
          } else if (filterSubCategory) {
            paramsToSend.issubcaegoryvalue = filterSubCategory
          } else {
            paramsToSend.iscaegoryvalue = filterCategory
          }

          paramsToSend.page = currentPage
        }
        const response = await productAllDataApi(paramsToSend)

        if (response?.body?.products) {
          setProducts(response?.body?.products)
          setTotalPages(response.body.totalPages)
          setTotalCount(response.body.totalCount)
        } else if (response?.body?.message === "Invalid or expired token") {
          dispatch(clearUserDetails())
          toast.error("Session Expired, Please Login Again")
          router.push("/")
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  useEffect(() => {
    if (filterCategory) {
      fetchProducts()
    }
  }, [searchText, currentPage, status, isActive, productId, ordering, isfiltervalue, filterSubCategory, filterCategory])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchText, isfiltervalue])

  return (
    <>
      {userDetails ? (
        <div className="lg:p-4 flex flex-col justify-center items-center" ref={topRef}>
          <ProductFormComponent
            setSearchText={setSearchText}
            searchText={searchText}
            productdata={fetchProducts}
            setNewUser={setNewUser}
            newUser={newUser}
            handleopenform={handleopenform}
            openForm={openForm}
            isEdit={isEdit}
            isProductID={isProductID}
            setIsEdit={setIsEdit}
            setOpenForm={setOpenForm}
            categories={categories}
            setSubCategories={setSubCategories}
            subCategories={initSubCategories}
            setCategories={setCategories}
            variantSpecifications={variantSpecifications}
            setVariantSpecifications={setVariantSpecifications}
            setCurrentPage={setCurrentPage}
            isTagData={isTagData}
          />

          {!isFromDashboard && searchText === "" && (
            <div className="flex gap-5 mb-7">
              <div className="bg-admin-secondary px-2 rounded-md">
                <select
                  name="Category"
                  className="p-3 rounded-md bg-admin-secondary w-full text-white font-semibold text-lg h-12 focus:outline-none overflow-y-auto"
                  value={filterCategory}
                  onChange={handleCategoryChange}
                  required
                >
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id} className="bg-white text-black">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-admin-secondary px-2 rounded-md">
                <select
                  name="sub_catogry"
                  className="p-3 bg-admin-secondary w-full text-white font-semibold text-lg h-12 focus:outline-none"
                  value={filterSubCategory}
                  onChange={handleSubCategoryChange}
                  disabled={subCategories.length === 0}
                >
                  {subCategories.length > 0 ? (
                    subCategories.map((subCategory: any) => (
                      <option key={subCategory.id} value={subCategory.id} className="bg-white text-black">
                        {subCategory.name}
                      </option>
                    ))
                  ) : (
                    <option value="" className="bg-white text-black">
                      No subcategories
                    </option>
                  )}
                </select>
              </div>
            </div>
          )}

          <ProductAllDataComponent
            products={products}
            productdata={fetchProducts}
            handleEdit={handleEdit}
            variantSpecifications={variantSpecifications}
            ordering={ordering}
            setOrdering={setOrdering}
            setIsActiveInactiveFilterPopup={setIsActiveInactiveFilterPopup}
            isActiveInactiveFitlerPopup={isActiveInactiveFitlerPopup}
            isfiltervalue={isfiltervalue}
            setfiltervalue={setfiltervalue}
            setcategoryvalue={setcategoryvalue}
            iscaegoryvalue={iscaegoryvalue}
            handleActiveFilter={handleActiveFilter}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            currentPage={currentPage} 
            searchParams={searchParams}/>
        </div>
      ) : null}
    </>
  )
}

export default Page
