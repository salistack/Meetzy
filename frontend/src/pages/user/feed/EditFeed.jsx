import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditFeed = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    feeling: "",
    location: "",
  });

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/feeds/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/feeds/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Feed updated successfully!");
        navigate("/user/feeds");
      } else {
        alert("Failed to update feed");
      }
    } catch (error) {
      console.error("Error updating feed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">Edit Feed</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg"
          />
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Content"
            required
            className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg"
          ></textarea>
          <select
            name="feeling"
            value={formData.feeling}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg"
          >
            <option value="">Select Feeling</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="excited">Excited</option>
            <option value="angry">Angry</option>
          </select>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="w-full px-4 py-2 bg-transparent border border-white/50 text-white rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg"
          >
            Update Feed
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFeed;
