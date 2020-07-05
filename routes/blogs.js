const app = require("express");
const router = app.Router();
const { fStore } = require("../fiyabase/index");
// const jwt = require("jsonwebtoken");
const {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogsByAuthor,
  postCommentToBlog,
  getCommentsByBlog,
  likeBlog,
  unLikeBlog,
} = require("../controllers/blogControllers");

const { authorizeToken } = require("../middlewares/authorizeToken");

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", authorizeToken, createBlog);
router.get("/author/:authorId", getBlogsByAuthor);
router.post("/:id/comment", authorizeToken, postCommentToBlog);
router.get("/:id/comments", getCommentsByBlog);
//likes
router.get("/:id/like", authorizeToken, likeBlog);
router.get("/:id/unLike", authorizeToken, unLikeBlog);

module.exports = router;
