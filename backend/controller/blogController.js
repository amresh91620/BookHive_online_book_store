const Blog = require("../models/Blog");

/** GET /api/blogs - Public: list published blogs */
exports.getAllBlogs = async (req, res) => {
  try {
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const limit = Math.max(parseInt(req.query.limit, 10) || 9, 1);
    const q = (req.query.q || "").trim();
    const category = (req.query.category || "").trim();
    const isAdmin = req.query.admin === "true";

    const filter = {};
    if (!isAdmin) filter.status = "published";
    if (q) filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { excerpt: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
    ];
    if (category) filter.category = { $regex: category, $options: "i" };

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .select("-content")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.status(200).json({ total, offset, limit, blogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** GET /api/blogs/categories - Public: distinct categories */
exports.getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct("category", { status: "published" });
    res.status(200).json({ categories: categories.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** GET /api/blogs/:id - Public: single blog by id, increments views */
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    if (blog.status !== "published") {
      // allow admin to preview drafts
      const isAdmin = req.query.preview === "true";
      if (!isAdmin) return res.status(404).json({ msg: "Blog not found" });
    }
    blog.views += 1;
    await blog.save();
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** POST /api/blogs - Admin: create blog */
exports.createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, author, status, featured } = req.body;
    if (!title || !excerpt || !content || !category || !author) {
      return res.status(400).json({ msg: "title, excerpt, content, category, author are required" });
    }
    if (!req.file) return res.status(400).json({ msg: "Cover image is required" });

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      category,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean)) : [],
      author,
      status: status || "draft",
      featured: featured === "true" || featured === true,
      coverImage: req.file.path,
    });
    res.status(201).json({ msg: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** PUT /api/blogs/:id - Admin: update blog */
exports.updateBlog = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.coverImage = req.file.path;
    if (updates.featured !== undefined) {
      updates.featured = updates.featured === "true" || updates.featured === true;
    }
    if (updates.tags && typeof updates.tags === "string") {
      updates.tags = updates.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.status(200).json({ msg: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** DELETE /api/blogs/:id - Admin: delete blog */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.status(200).json({ msg: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
