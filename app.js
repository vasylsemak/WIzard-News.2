const express = require("express");
const morgan = require("morgan");
const postList = require("./views/postList");
const postDetails = require("./views/postDetails");
const client = require('./db');

const app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  try {
    const data = await client.query('SELECT * FROM posts;');
    res.send(postList(data.rows));
  } catch (error) {
    throw new Error(error);
  }
});

app.get("/posts/:id", async (req, res) => {
  const post = await client.query(
    `SELECT * FROM posts WHERE  id=${req.params.id}`
  );
  res.send(postDetails(post.rows[0]));
});

app.get('/all', async (req, res) => {
  const data = await client.query(
    'SELECT postId, COUNT(*) as upvotes_total FROM upvotes GROUP BY postId ORDER BY postId;'
  );
  console.log('--->', data.rows);
  res.send(data.rows);
})

const PORT = 1337;
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
