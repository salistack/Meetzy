import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdminBlogsPage = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    title: '',
    dateFrom: '',
    dateTo: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch filtered blog statistics
  const fetchBlogStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs/admin/blogs', { params: filters });
      setTotalCount(response.data.totalCount || 0);
      setCategoryCounts(response.data.categoryCounts || {});
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error fetching blog data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogStats();
  }, [filters]);

  const handleGeneratePDF = async () => {
    const input = document.getElementById('blog-stats');
    
    if (!input) {
      console.error("Could not find element with ID 'blog-stats'");
      return;
    }

    // Create a simplified version for PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = '800px';
    pdfContainer.style.padding = '20px';
    pdfContainer.style.backgroundColor = '#ffffff';
    
    // Add title
    const title = document.createElement('h1');
    title.textContent = 'Blog Statistics Report';
    title.style.fontSize = '24px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '20px';
    title.style.color = '#000000';
    pdfContainer.appendChild(title);

    // Add total count
    const totalCountEl = document.createElement('p');
    totalCountEl.textContent = `Total Blogs: ${totalCount}`;
    totalCountEl.style.fontSize = '18px';
    totalCountEl.style.marginBottom = '15px';
    totalCountEl.style.color = '#000000';
    pdfContainer.appendChild(totalCountEl);

    // Add category counts
    const categoriesTitle = document.createElement('h2');
    categoriesTitle.textContent = 'Category Breakdown:';
    categoriesTitle.style.fontSize = '20px';
    categoriesTitle.style.fontWeight = 'bold';
    categoriesTitle.style.marginBottom = '10px';
    categoriesTitle.style.color = '#000000';
    pdfContainer.appendChild(categoriesTitle);

    Object.entries(categoryCounts).forEach(([category, count]) => {
      const categoryEl = document.createElement('p');
      categoryEl.textContent = `${category}: ${count}`;
      categoryEl.style.fontSize = '16px';
      categoryEl.style.marginBottom = '5px';
      categoryEl.style.color = '#000000';
      pdfContainer.appendChild(categoryEl);
    });

    // Add blogs list
    const blogsTitle = document.createElement('h2');
    blogsTitle.textContent = 'Blog List:';
    blogsTitle.style.fontSize = '20px';
    blogsTitle.style.fontWeight = 'bold';
    blogsTitle.style.marginTop = '20px';
    blogsTitle.style.marginBottom = '10px';
    blogsTitle.style.color = '#000000';
    pdfContainer.appendChild(blogsTitle);

    if (blogs.length > 0) {
      blogs.forEach(blog => {
        const blogEl = document.createElement('div');
        blogEl.style.marginBottom = '10px';
        blogEl.style.paddingBottom = '10px';
        blogEl.style.borderBottom = '1px solid #dddddd';
        
        const titleEl = document.createElement('p');
        titleEl.textContent = blog.title;
        titleEl.style.fontWeight = 'bold';
        titleEl.style.color = '#000000';
        blogEl.appendChild(titleEl);
        
        const metaEl = document.createElement('p');
        metaEl.textContent = `by ${blog.author?.name || 'Unknown Author'} - ${blog.category}`;
        metaEl.style.color = '#555555';
        blogEl.appendChild(metaEl);
        
        pdfContainer.appendChild(blogEl);
      });
    } else {
      const noBlogsEl = document.createElement('p');
      noBlogsEl.textContent = 'No blogs found matching the filters.';
      noBlogsEl.style.color = '#555555';
      pdfContainer.appendChild(noBlogsEl);
    }

    // Add to DOM temporarily
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    document.body.appendChild(pdfContainer);

    try {
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: true,
        useCORS: true
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('blog-statistics.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      document.body.removeChild(pdfContainer);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Admin Dashboard</h1>

      {/* Filter Section */}
      <div className="bg-blue-100 p-6 rounded-lg shadow-md mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            placeholder="Search by title"
            className="p-3 border rounded-md w-full sm:w-1/2 md:w-1/4"
          />
          <input
            type="text"
            name="author"
            value={filters.author}
            onChange={handleFilterChange}
            placeholder="Search by author"
            className="p-3 border rounded-md w-full sm:w-1/2 md:w-1/4"
          />
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="p-3 border rounded-md w-full sm:w-1/2 md:w-1/4"
          />
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="p-3 border rounded-md w-full sm:w-1/2 md:w-1/4"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-3 border rounded-md w-full sm:w-1/2 md:w-1/4"
          >
            <option value="">All Categories</option>
            <option value="Loneliness">Loneliness</option>
            <option value="Health">Health</option>
            <option value="Travel">Travel</option>
            <option value="Education">Education</option>
          </select>
        </div>
      </div>

      {/* Blog Stats Section */}
      {loading ? (
        <div className="text-center text-gray-600">Loading blog statistics...</div>
      ) : (
        <div id="blog-stats" className="bg-blue-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Blog Statistics</h2>
          <p className="mb-4 text-lg text-blue-900">Total Blogs: <span className="font-bold">{totalCount}</span></p>

          {/* Category-wise Blog Count */}
          <div className="space-y-2 mb-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <p key={category} className="text-lg text-blue-800">
                {category}: <span className="font-medium text-blue-600">{count}</span>
              </p>
            ))}
          </div>

          {/* Filtered Blogs List */}
          <h3 className="text-xl font-semibold text-blue-700 mb-3">Filtered Blogs</h3>
          {blogs.length > 0 ? (
            <ul className="space-y-2">
              {blogs.map((blog) => (
                <li key={blog._id} className="flex justify-between items-center text-lg text-blue-900 border-b pb-2">
                  <span className="font-semibold">{blog.title}</span>
                  <span className="text-blue-600">by {blog.author?.name || 'Unknown Author'}</span>
                  <span className="text-blue-700">- {blog.category}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No blogs found matching the filters.</p>
          )}

          {/* PDF Download Button */}
          <button
            onClick={handleGeneratePDF}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBlogsPage;