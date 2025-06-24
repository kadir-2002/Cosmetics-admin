import React from "react";

const LimitedStock = () => {
  const products = [
    {
      name: "Nike Shoe",
      category: "Shoes",
      quantity: 2056,
      image: "https://via.placeholder.com/40", // Replace with actual image URL
    },
    {
      name: "Puma Hoodie",
      category: "Clothes",
      quantity: 3500,
      image: "https://via.placeholder.com/40", // Replace with actual image URL
    },
    {
      name: "Fastrack Watch",
      category: "Watch",
      quantity: 4586,
      image: "https://via.placeholder.com/40", // Replace with actual image URL
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mx-auto">
      {/* Header */}
      <h2 className="text-lg font-semibold text-orange-500 mb-4">Limited Stock</h2>

      {/* Table Header */}
      <div className="flex justify-between text-sm font-medium text-gray-500 mb-3">
        <span>Products</span>
        <span>Quantity</span>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex justify-between items-center">
            {/* Product Info */}
            <div className="flex items-center space-x-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
              </div>
            </div>
            <span className="font-semibold text-gray-800">{product.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LimitedStock;
