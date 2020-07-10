const { fStore, admin } = require("../fiyabase/index");
const blogsRef = fStore.collection("/blogs");
const commentsRef = fStore.collection("/comments");
const usersRef = fStore.collection("/users");
const clapsRef = fStore.collection("/claps");

const createBlog = (req, res) => {
  //assuming validation is done on client
  const { title, body } = req.body;
  const { data: user } = req.user;
  // if (exp && exp < Math.floor(Date.now() / 1000)) {
  //   return res.status(408).json({ msg: "session has expired" });
  // }
  blogsRef
    .add({
      title,
      body,
      author: user.name,
      authorId: user.uid,
      claps: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
    })
    .then((doc) => {
      console.log(`doc registered with id ${doc.id}`);
      // console.log(doc);
      return res.status(201).json({ docRef: doc.id });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
};

const getBlogs = (req, res) => {
  const myBlogs = [];
  blogsRef
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        myBlogs.push({ ...doc.data(), blogId: doc.id });
        // myBlogs.push({ ...doc.data() });
      });
      return res.status(200).json({ blogs: myBlogs });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

const getCommentsByBlog = (req, res) => {
  const { id } = req.params;
  const blogComments = [];
  commentsRef
    .where("blogId", "==", id)
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        const { avatar, body, commentator, upvotes, userId } = doc.data();
        const userData = {
          avatar,
          body,
          user: commentator,
          upvotes,
          userId,
        };
        blogComments.push(userData);
      });
      return res.status(200).json({ comments: blogComments });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
};

const getBlogById = (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 2 } = req.query;
  let blog = {};
  blogsRef
    .doc(`${id}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ msg: "blog not found" });
      }
      blog = doc.data();
      console.log("blog id: ", id);
      commentsRef
        .where("blogId", "==", id)
        // .orderBy("createdAt","DESC")
        .get()
        .then((docs) => {
          docs.forEach((doc) =>
            console.log("this comment references blog ", doc.data())
          );
        })
        .catch((err) => console.log(err));
      return commentsRef.where("blogId", "==", id).get();
    })
    .then((docs) => {
      docs.forEach((doc) =>
        console.log("blog id refenrenced by comment ", doc.data())
      );

      const mycomments = [];
      if (!docs.empty) {
        docs.forEach((doc) => {
          console.log(doc.data());
          mycomments.push({ ...doc.data(), id: doc.id });
        });
        // console.log("no comments found");
      }
      return res.status(200).json({ ...blog, comments: mycomments });
    });
};

const getBlogsByAuthor = (req, res) => {
  const { authorId } = req.params;
  blogsRef
    .where("authorId", "==", authorId)
    .get()
    .then((docs) => {
      if (docs.empty) return res.status(200).json({ blogs: [] });
      const myblogs = [];
      docs.forEach((doc) => {
        myblogs.push(doc.data());
      });
      return res.status(200).json({ blogs: myblogs });
    });
};

const postCommentToBlog = (req, res) => {
  const { data: user } = req.user;
  // if (exp && exp < Math.floor(Date.now() / 1000)) {
  //   return res.status(408).json({ msg: "session has expired" });
  // }
  const { id } = req.params;
  const { body } = req.body;
  console.log("the body is", body);
  let userImage = "";
  let commentData = {};
  blogsRef
    .doc(`${id}`)
    .get()
    .then((doc) => {
      if (!doc.exists)
        return res.status(404).json({ msg: "blog not available to comment" });
      blogsRef
        .doc(`${doc.id}`)
        .update({ commentCount: doc.data().commentCount + 1 });
      usersRef
        .doc(`${user.uid}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            userImage = doc.data().avatar;
          }
        })
        .catch((err) => res.json({ err }));
      commentData = {
        body,
        upvotes: 0,
        blogId: id,
        commentator: user.name,
        userId: user.uid,
        avatar: userImage,
        createdAt: new Date().toISOString(),
      };
      return commentsRef.add({ ...commentData });
    })
    .then((doc) => {
      console.log("comment created for given blog ", id);
      res.status(201).json({ data: { ...commentData, id: doc.id } });
    })
    .catch((err) => res.status(500).json({ err }));
};

const hasLikedBlog = () => {};

const likeBlog = (req, res) => {
  const { data: user } = req.user;
  // if (exp && exp < Math.floor(Date.now() / 1000)) {
  //   console.log("session has expired!");
  //   return res.status(408).json({ msg: "session has expired" });
  // }
  // console.log("user from like: ", user);

  const { id } = req.params;
  let clapCount;
  clapsRef
    //getting all likes from a particular blog
    .where("blogId", "==", id)
    .where("clappedBy", "==", user.uid)
    // .limit(1)
    .get()
    .then((docs) => {
      if (docs.empty) {
        console.log("doc is empty");
        return blogsRef.doc(`${id}`).get();
      }
      docs.forEach((doc) => console.log(doc.data()));
      console.log("i should not run when doc is empty");
      throw new Error("blog already liked!");
    })
    .then((doc) => {
      console.log("am i running?");
      clapCount = doc.data().claps;
      return blogsRef.doc(`${id}`).update({
        claps: (clapCount += 1),
      });
    })
    .then(() => {
      console.log("successfully clapped");
      const clap = {
        blogId: id,
        clappedBy: user.uid,
      };
      return clapsRef.add(clap);
    })
    .then(() => {
      console.log("liked!");
      res.status(201).json({ msg: "successfully liked!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const unLikeBlog = (req, res) => {
  // const user = req.user;
  const { data: user } = req.user;
  // if (exp && exp < Math.floor(Date.now() / 1000)) {
  //   return res.status(408).json({ msg: "session has expired" });
  // }
  const { id } = req.params;
  let clapCount;
  let clapId;
  clapsRef
    //getting all likes from a particular blog
    .where("blogId", "==", id)
    .where("clappedBy", "==", user.uid)
    // .limit(1)
    .get()
    .then((docs) => {
      if (docs.empty) {
        throw new Error("cannot unlike what is not liked! :)");
      }
      docs.forEach((doc) => (clapId = doc.id));
      return blogsRef.doc(`${id}`).get();
    })
    .then((doc) => {
      console.log("am i running?");
      clapCount = doc.data().claps;
      return blogsRef.doc(`${id}`).update({
        claps: (clapCount -= 1),
      });
    })
    .then(() => {
      clapsRef.doc(`${clapId}`).delete();
      console.log("disliked!");
      res.status(200).json({ msg: "successfully disliked!" });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogsByAuthor,
  postCommentToBlog,
  getCommentsByBlog,
  likeBlog,
  unLikeBlog,
};
