import User from "../../db/models/User.js";

export const getMembers = async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const query = {
      role: "member",
    };

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    const members = await User.find(query).select("name email role");

    return res.status(200).json({
      message: "Members fetched successfully",
      members,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch members",
      error: err.message,
    });
  }
};
