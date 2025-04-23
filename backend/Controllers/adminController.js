const getAdminStats = async (req, res) => {
  try {
    const stats = {
      userRegistrations: [
        { date: '2023-05-01', count: 12 },
        { date: '2023-05-02', count: 19 },
        { date: '2023-05-03', count: 8 },
      ],
      blogPosts: [
        { date: '2023-05-01', count: 5 },
        { date: '2023-05-02', count: 8 },
        { date: '2023-05-03', count: 3 },
      ],
      totalUsers: 145,
      totalBlogs: 89,
      reportedBlogs: 7,
      activeGroups: 12,
    };
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

module.exports = { getAdminStats };
