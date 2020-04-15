const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27019/blogdb");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const AuthorSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  bioDescription: String,
  username: String,
  password: String,
  token: String,
  createdAt: { type: Date, default: Date.now }
});
const Author = mongoose.model("Author", AuthorSchema);

const ArticleSchema = new Schema({
  title: String,
  description: String,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      description: String,
      // author:{type:Schema.Types.ObjectId,ref:'Author'}
      author: String
    }
  ],
  // author:{type:Schema.Types.ObjectId,ref:'Author'}
  author: String
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = {
  addArticle: (authorId, title, description) => {
    console.log("authorId", authorId);
    console.log("title", title);
    console.log("description", description);
    const article = new Article({
      author: authorId,
      title,
      description
    });
    return new Promise((resolve, reject) => {
      article
        .save()
        .then(articleRecord => {
          resolve(articleRecord);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  removeArticle: articleId => {
    return new promise((resolve, reject) => {
      Article.remove({ _id: articleId }, err => {
        if (err) {
          reject(err);
        } else {
          resolve("article removed");
        }
      });
    });
  },
  updateArticle: (articleId, title, description, likes) => {
    return new Promise((resolve, reject) => {
      Article.findOne({ _id: articleId })
        .exec()
        .then(article => {
          if (title) {
            article.title = title;
          }
          if (description) {
            article.description = description;
          }
          if (likes) {
            article.likes++;
          }
          return article.save();
        })
        .then(savedArticle => {
          resolve(savedArticle);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  fetchAllArticles: () => {
    return new Promise((resolve, reject) => {
      Article.find({})
        .then(articles => {
          resolve(articles);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /* fetchArticlesByAuthor: authorId => {
    return new Promise((resolve, reject) => {
      Article.find({ author: authorId })
        .exec()
        .then(articles => {
          resolve(articles);
        })
        .catch(err => {
          reject(err);
        });
    });
  }, */

  addComment: (articleId, description, authorId) => {
    return new Promise((resolve, reject) => {
      Article.findOne({ _id: articleId })
        .exec()
        .then(article => {
          article.comments.push({
            description,
            author: authorId
          });
          return article.save();
        })
        .then(savedArticle => {
          resolve(savedArticle);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  removeComment: (articleId, commentId) => {
    return new Promise((resolve, reject) => {
      Article.findOne({ _id: articleId })
        .exec()
        .then(article => {
          const commentIndex = article.comments.findIndex(comment => {
            return comment._id === commentId;
          });
          article.comments.splice(commentIndex, 1);
          return article.save();
        })
        .then(savedArticle => {
          resolve(savedArticle);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateComment: (articleId, commentId, description) => {
    return new Promise((resolve, reject) => {
      Article.findOne({ _id: articleId })
        .exec()
        .then(article => {
          article.comments = article.comments.map(comment => {
            if (comment._id == commentId) {
              comment.description = description;
            }
            return comment;
          });
          return article.save();
        })
        .then(savedArticle => {
          resolve(savedArticle);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  addUser: (
    firstName,
    lastName,
    email,
    bioDescription,
    username,
    password,
    token
  ) => {
    return new Promise((resolve, reject) => {
      const author = new Author({
        firstName,
        lastName,
        email,
        bioDescription,
        username,
        password,
        token
      });
      author
        .save()
        .then(savedAuthor => {
          resolve(savedAuthor);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetchUsers: userId => {
    return new Promise((resolve, reject) => {
      if (!userId) {
        Author.find({})
          .then(users => {
            resolve(users);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        Author.find({ username: userId })
          .then(users => {
            resolve(users);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  },

  fetchUserInfo: username => {
    return new Promise((resolve, reject) => {
      console.log("username", username);
      Author.findOne({ username })
        .then(author => {
          if (author) {
            resolve(author);
          } else {
            throw "error fetching the author info";
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  updateUser: (authorId, data) => {
    return new Promise((resolve, reject) => {
      console.log("authorId", authorId);
      Author.findOne({ _id: authorId })
        .exec()
        .then(author => {
          const {
            firstName,
            lastName,
            email,
            bioDescription,
            username,
            password
          } = data;

          author.firstName = firstName;
          author.lastName = lastName;
          author.email = email;
          author.bioDescription = bioDescription;
          author.username = username;
          author.password = password;
          return author.save();
        })
        .then(savedAuthor => {
          resolve(savedAuthor);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  removeUser: authorId => {
    return new Promise((resolve, reject) => {
      Author.remove({ _id: authorId })
        .then(() => {
          resolve("User removed");
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  findUserByName: username => {
    return new Promise((resolve, reject) => {
      Author.findOne({ username })
        .then(user => {
          resolve(user);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  fetchArticlesByAuthor: userId => {
    return new Promise((resolve, reject) => {
      Article.find({ author: userId })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
