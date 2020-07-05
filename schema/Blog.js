const collections = ["/blogs", "/comments", "/claps", "/users"];

const blogs = [
  {
    id: 1,
    title: "this is a blog title",
    body: "this is a sample blog body",
    author: "sovan",
    authorId: 12121,
    comments: 0,
    claps: 0,
  },
];

const users = [
  {
    id: 12121,
    name: "sovan",
    image: "/path/to/default/image",
    fullName: "sovan shahi",
    memberSince: "2020 March 12th",
    blogs: 12,
    role: "general",
  },
];

const comments = [
  {
    id: "comment-id",
    body: "comment-body",
    blogId: "id_of_blog_this_comment_houses_in",
    upvotes: 0,
  },
];

const likes = [
  {
    blogId: "blog-id",
    userid: "uid",
  },
];
