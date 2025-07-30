import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [categories, setCategories] = useState([]);
  const [selectedSize, setSelectedSize] = useState('Tất cả');
  const [selectedColor, setSelectedColor] = useState('Tất cả');
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);

  const fetchWithFallback = async (path, config) => {
    try {
      return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    } catch {
      return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchWithFallback('/api/products');
        setProducts(response.data);
        
        // Lấy danh sách danh mục duy nhất từ sản phẩm
        // Xử lý cả trường hợp category là object hoặc string
        const processedCategories = response.data.map(p => {
          if (typeof p.category === 'object' && p.category !== null) {
            return { id: p.category._id, name: p.category.name };
          } else {
            return { id: p.category, name: p.category };
          }
        }).filter(Boolean);
        
        // Lọc các category trùng lặp dựa trên id
        const uniqueCategories = Array.from(
          new Map(processedCategories.map(item => [item.id, item])).values()
        );
        
        setCategories(uniqueCategories);

        // Lấy danh sách size duy nhất từ sản phẩm
        const allSizes = [];
        response.data.forEach(product => {
          if (product.size && Array.isArray(product.size)) {
            allSizes.push(...product.size);
          }
        });
        const uniqueSizes = [...new Set(allSizes)].filter(Boolean).sort();
        setAvailableSizes(uniqueSizes);

        // Lấy danh sách color duy nhất từ sản phẩm
        const allColors = [];
        response.data.forEach(product => {
          if (product.color && Array.isArray(product.color)) {
            allColors.push(...product.color);
          }
        });
        const uniqueColors = [...new Set(allColors)].filter(Boolean).sort();
        setAvailableColors(uniqueColors);
        
        setError(null);
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lọc sản phẩm theo danh mục, size và color
  const filteredProducts = products.filter(product => {
    // Lọc theo danh mục
    const categoryMatch = selectedCategory === 'Tất cả' || 
      (typeof product.category === 'object' && product.category !== null 
        ? product.category._id === selectedCategory
        : product.category === selectedCategory);

    // Lọc theo size
    const sizeMatch = selectedSize === 'Tất cả' || 
      (product.size && Array.isArray(product.size) && product.size.includes(selectedSize));

    // Lọc theo color
    const colorMatch = selectedColor === 'Tất cả' || 
      (product.color && Array.isArray(product.color) && product.color.includes(selectedColor));

    return categoryMatch && sizeMatch && colorMatch;
  });

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedCategory('Tất cả');
    setSelectedSize('Tất cả');
    setSelectedColor('Tất cả');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== 'Tất cả' || selectedSize !== 'Tất cả' || selectedColor !== 'Tất cả';

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 border-l-4 border-blue-600 pl-4">
        Tất Cả Sản Phẩm
      </h1>
      
      {/* Filter Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="Tất cả">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kích thước</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSize}
              onChange={e => {
                setSelectedSize(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="Tất cả">Tất cả size</option>
              {availableSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedColor}
              onChange={e => {
                setSelectedColor(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="Tất cả">Tất cả màu</option>
              {availableColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-medium"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</span>
            {selectedCategory !== 'Tất cả' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                <button
                  onClick={() => {
                    setSelectedCategory('Tất cả');
                    setCurrentPage(1);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedSize !== 'Tất cả' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Size: {selectedSize}
                <button
                  onClick={() => {
                    setSelectedSize('Tất cả');
                    setCurrentPage(1);
                  }}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedColor !== 'Tất cả' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Màu: {selectedColor}
                <button
                  onClick={() => {
                    setSelectedColor('Tất cả');
                    setCurrentPage(1);
                  }}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Hiển thị {filteredProducts.length} sản phẩm
          {hasActiveFilters && ` (đã lọc từ ${products.length} sản phẩm)`}
        </p>
      </div>
      {currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination
            productsPerPage={productsPerPage}
            totalProducts={filteredProducts.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      ) : (
         <p className="text-center text-gray-500 text-lg">Không có sản phẩm nào để hiển thị.</p>
      )}
    </div>
  );
};
export default ProductsPage;