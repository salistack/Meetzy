import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const CreateFeed = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    feeling: "",
    location: "",
    YourName: "",
  });

  const [errors, setErrors] = useState({});
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (name === "title") {
      if (value.length > 35) {
        newErrors.title = "Title cannot exceed 35 characters.";
      } else if (!/^[A-Za-z0-9\s]+$/.test(value)) {
        newErrors.title = "Title can only contain letters, numbers, and spaces.";
      } else {
        delete newErrors.title;
      }
    }

    if (name === "location") {
      if (!/^[A-Za-z0-9\s,]+$/.test(value)) {
        newErrors.location = "Location can only contain letters, numbers, and commas.";
      } else {
        delete newErrors.location;
      }
    }

    setErrors(newErrors);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Set page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
  
    // Draw red header banner
    doc.setFillColor(220, 53, 69); // Bootstrap 'danger' red
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("Feed Report", margin, 20);
  
    // Draw border around the entire page (except header)
    doc.setDrawColor(150, 150, 150); // Light grey border
    doc.setLineWidth(0.8);
    doc.rect(margin, 35, pageWidth - 2 * margin, pageHeight - 45);
  
    // Set text styles
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
  
    // Info content
    let y = 45;
    const lineHeight = 8;
  
    doc.text(`Title: ${formData.title}`, margin + 5, y);
    y += lineHeight;
    doc.text(`Feeling: ${formData.feeling}`, margin + 5, y);
    y += lineHeight;
    doc.text(`Location: ${formData.location}`, margin + 5, y);
    y += lineHeight;
    doc.text(`Date: ${new Date().toLocaleString()}`, margin + 5, y);
    y += lineHeight;
    doc.text(`Created By: ${formData.YourName}`, margin + 5, y);
    y += lineHeight * 2;
  
    // Divider
    doc.setLineWidth(0.3);
    doc.line(margin + 5, y, pageWidth - margin - 5, y);
    y += lineHeight;
  
    // Content block
    doc.setFontSize(13);
    doc.text("Content:", margin + 5, y);
    y += lineHeight;
    doc.setFontSize(12);
  
    const contentLines = doc.splitTextToSize(formData.content, pageWidth - margin * 2 - 10);
    doc.text(contentLines, margin + 5, y);
  
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Page 1 of 1`, pageWidth - margin - 25, pageHeight - 10);
  
    // Save
    doc.save(`${formData.title}_report.pdf`);
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0 || !formData.title || !formData.content) {
      alert("Please correct the errors before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Feed Created Successfully!");
        setShowDownloadPrompt(true);
      } else {
        alert("Error creating feed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">Create a New Feed</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="Title"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <textarea
              name="content"
              value={formData.content}
              placeholder="Content"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            ></textarea>
          </div>

          {/* Feeling */}
          <div className="space-y-2">
            <select
              name="feeling"
              value={formData.feeling}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Feeling</option>
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
              <option value="excited">Excited</option>
              <option value="angry">Angry</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <input
              type="text"
              name="location"
              value={formData.location}
              placeholder="Location"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <input
              type="text"
              name="YourName"
              value={formData.YourName}
              placeholder="Your Name"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all"
          >
            Create Feed
          </button>
        </form>
      </div>

      {/* Modal for Download */}
      {showDownloadPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-3">Download Feed Summary?</h2>
            <p className="text-gray-600 mb-5">Would you like to download the summary as a PDF before leaving?</p>
            <div className="flex justify-around">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  generatePDF();
                  setShowDownloadPrompt(false);
                  navigate("/user/feeds");
                }}
              >
                Download
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={() => {
                  setShowDownloadPrompt(false);
                  navigate("/user/feeds");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFeed;
