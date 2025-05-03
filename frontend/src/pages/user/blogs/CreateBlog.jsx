import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../Components/Header"; // Make sure the path is correct

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Travel",
  });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  useEffect(() => {
    const words = formData.description.trim().split(/\s+/).filter(Boolean).length;
    const chars = formData.description.length;
    
    setWordCount(words);
    setCharCount(chars);
    setReadingTime(Math.ceil(words / 200)); // Assuming average reading speed of 200 words per minute
  }, [formData.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({...errors, photo: "Image size should not exceed 5MB"});
        return;
      }
      setPhoto(file);
      if (errors.photo) {
        const newErrors = {...errors};
        delete newErrors.photo;
        setErrors(newErrors);
      }
    }
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (name === "title") {
      if (value.length > 100) {
        newErrors.title = "Title cannot exceed 100 characters.";
      } else if (value.length > 0 && !/^[A-Za-z0-9\s.,!?'"()-]+$/.test(value)) {
        newErrors.title = "Title contains invalid characters.";
      } else {
        delete newErrors.title;
      }
    }

    if (name === "category" && !["loneliness", "Health", "Travel", "Education"].includes(value)) {
      newErrors.category = "Please select a valid category.";
    } else {
      delete newErrors.category;
    }

    setErrors(newErrors);
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag) {
      e.preventDefault();
      addTag();
    }
  };

  const applyFormatting = (format) => {
    const textarea = document.getElementById('blog-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.description.substring(start, end);
    let formattedText = '';
    
    switch(format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'heading':
        formattedText = `\n# ${selectedText}\n`;
        break;
      case 'subheading':
        formattedText = `\n## ${selectedText}\n`;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText}\n`;
        break;
      case 'list':
        formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      default:
        formattedText = selectedText;
    }
    
    const newDescription = formData.description.substring(0, start) + formattedText + formData.description.substring(end);
    setFormData({...formData, description: newDescription});
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (Object.keys(errors).length > 0 || !formData.title || !formData.description || !formData.category) {
      alert("Please correct the errors before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      
      if (tags.length > 0) {
        formDataToSend.append("tags", JSON.stringify(tags));
      }

      if (photo) {
        formDataToSend.append("photo", photo);
      }

      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/blogs", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert("Blog Created Successfully!");
        navigate("/blogs");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) {
        alert("Please login to create a blog");
        navigate("/login");
      } else {
        alert("Error creating blog");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMarkdown = (text) => {
    // Simple markdown rendering for preview
    let html = text;
    
    // Headings
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>');
    
    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>');
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-400 pl-4 italic my-4">$1</blockquote>');
    
    // Paragraphs (simple)
    html = html.replace(/\n\n/g, '</p><p class="my-3">');
    
    return `<p class="my-3">${html}</p>`;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Use your Header component */}
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Publish button moved to main content area */}
        <div className="flex justify-end mb-6">
          <button 
            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Writing Toolbar */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex space-x-2">
              <button 
                onClick={() => applyFormatting('bold')} 
                className="p-2 rounded hover:bg-gray-200 transition" 
                title="Bold"
              >
                <span className="font-bold">B</span>
              </button>
              <button 
                onClick={() => applyFormatting('italic')} 
                className="p-2 rounded hover:bg-gray-200 transition" 
                title="Italic"
              >
                <span className="italic">I</span>
              </button>
              <button 
                onClick={() => applyFormatting('heading')} 
                className="p-2 rounded hover:bg-gray-200 transition" 
                title="Heading"
              >
                H1
              </button>
              <button 
                onClick={() => applyFormatting('subheading')} 
                className="p-2 rounded hover:bg-gray-200 transition" 
                title="Subheading"
              >
                H2
              </button>
              <button 
                onClick={() => applyFormatting('quote')} 
                className="p-2 rounded hover:bg-gray-200 transition" 
                title="Quote"
              >
                ""
              </button>
              <button 
                onClick={() => applyFormatting('list')} 
                className="p-2 rounded hover:bg-gray-200 transition" 
                title="List"
              >
                • List
              </button>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setPreviewMode(false)} 
                className={`px-3 py-1 rounded ${!previewMode ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
              >
                Write
              </button>
              <button 
                onClick={() => setPreviewMode(true)} 
                className={`px-3 py-1 rounded ${previewMode ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Title Field */}
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="Title of your blog post"
              onChange={handleChange}
              required
              className="w-full mb-6 text-3xl font-bold border-none focus:outline-none focus:ring-0 placeholder-gray-400"
            />
            {errors.title && <p className="text-red-500 text-sm mb-4">{errors.title}</p>}

            {/* Main Content Area */}
            {!previewMode ? (
              <>
                <textarea
                  id="blog-content"
                  name="description"
                  value={formData.description}
                  placeholder="Tell your story..."
                  onChange={handleChange}
                  required
                  className="w-full min-h-[400px] border-none focus:outline-none focus:ring-0 placeholder-gray-400 resize-none font-serif text-lg"
                  rows="15"
                ></textarea>
                
                <div className="text-sm text-gray-500 flex justify-end mt-2 space-x-4">
                  <span>{wordCount} words</span>
                  <span>{charCount} characters</span>
                  <span>{readingTime} min read</span>
                </div>
              </>
            ) : (
              <div className="preview-container min-h-[400px] font-serif text-lg">
                <h1 className="text-4xl font-bold mb-6">{formData.title || "Untitled Blog Post"}</h1>
                
                {photo && (
                  <div className="my-6">
                    <img src={URL.createObjectURL(photo)} alt="Blog header" className="w-full h-auto rounded-lg object-cover max-h-80" />
                  </div>
                )}
                
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.description) }}
                />
                
                {tags.length > 0 && (
                  <div className="mt-8">
                    <p className="text-sm text-gray-500 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Blog Settings Sidebar */}
        <div className="bg-white rounded-xl shadow-lg mt-6 p-6">
          <h3 className="text-lg font-semibold mb-4">Blog Settings</h3>
          
          <div className="space-y-6">
            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="loneliness">Loneliness</option>
                <option value="Health">Health</option>
                <option value="Travel">Travel</option>
                <option value="Education">Education</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Tags Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (up to 5)</label>
              <div className="flex">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a tag"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-indigo-500"
                  disabled={tags.length >= 5}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={tags.length >= 5 || !currentTag.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                  Add
                </button>
              </div>
              {tags.length >= 5 && <p className="text-amber-600 text-xs mt-1">Maximum 5 tags allowed</p>}
              
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map(tag => (
                  <div key={tag} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span className="text-gray-800 text-sm">#{tag}</span>
                    <button 
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {photo ? (
                  <div className="relative">
                    <img src={URL.createObjectURL(photo)} alt="Preview" className="max-h-48 mx-auto rounded-md" />
                    <button 
                      onClick={() => setPhoto(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-gray-500 mb-2">Drag and drop an image or click to select</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-gray-500"
                    />
                  </>
                )}
              </div>
              {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;