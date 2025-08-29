import Post from "../models/post.model.js";

// Get all posts (with author info)

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profilePicture role") // include role here
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const { content, image } = req.body;

    const newPost = new Post({
      content,
      image: image || "",
      author: req.user.id, // backend sets author
    });

    await newPost.save();

    const populatedPost = await newPost.populate(
      "author",
      "username profilePicture role"
    );

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author can delete
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get posts count for analytics
export const getPostsCount = async (req, res) => {
  try {
    const count = await Post.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get post analytics (if you want more detailed info)
export const getPostAnalytics = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const recentPosts = await Post.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.json({
      totalPosts,
      recentPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
