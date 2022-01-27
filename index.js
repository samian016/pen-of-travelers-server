const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config();
const app = express();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const { query } = require("express");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xh4av.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log(
      "Server and Database connection succesfully!");
    const jaguar = client.db("BlogX");
    const users = jaguar.collection("users");
    const blogs = jaguar.collection("blogs");
    // const orders = jaguar.collection("orders");
    const reviews = jaguar.collection("reviews");
















    // deleting Blogs
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogs.deleteOne(query);
      res.json(result);
    });


    // app.delete("/product/delete/:id", async (req, res) => {
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = { _id: ObjectId(id) };
    //   const result = await packages.deleteOne(query);
    //   res.json(result);
    // });



    // app.get("/reviews", async (req, res) => {
    //   const review = reviews.find({});
    //   const result = await review.toArray();
    //   res.send(result);
    // });

    // app.get("/reviews", async (req, res) => {
    //   console.log("object");
    //   const cursor = reviews.find({});
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });




    //////////////////////////////////////////////////////////////////
    ///////////////////    DONE  DONE  DONE    ///////////////////////
    //////////////////////////////////////////////////////////////////




    // getting Approved blogs



    app.get("/blogs/approved", async (req, res) => {
      const page = req.query.page;
      const coursor = blogs.find({ isApproved: true });
      const count = await coursor.count();
      // console.log(page);
      let result;
      if (page) {
        result = await coursor.skip((page-1)*10).limit(10).toArray();

      }
      else {
        result = await coursor.toArray();

      }
      // console.log(result.length);
      res.send({ count, result });
    });



    //getting all packages
    app.get("/blogs", async (req, res) => {
      const coursor = blogs.find({ isApproved: false });
      const result = await coursor.toArray();
      // console.log(result.length);
      res.send(result);
    });



    //add a new package
    app.post("/blogs", async (req, res) => {
      const order = req.body;
      const result = await blogs.insertOne(order);
      res.send(result);
    });





    // this is for inserting users value to data base
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await users.insertOne(user);
      res.send(result);
    });
    // is is to update users from googel
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await users.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // finding admin or not
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await users.findOne(query);
      let isAdmin = false;
      if (user?.isAdmin) {
        // console.log(user.isAdmin);
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const reviewBack = await reviews.insertOne(review);
      res.send(reviewBack);
    });



    app.put("/make/admin", async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email };
      const updateDoc = { $set: { isAdmin: true } };
      const result = await users.updateOne(filter, updateDoc);
      res.json(result);
    });

    // //updating the status of a order
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: false };
      const updateDoc = {
        $set: {
          isApproved: status.status,
        },
      };
      const result = await blogs.updateOne(filter, updateDoc, options);
      // console.log('updating', id,status.status)
      // console.log(result);
      res.json(result);
    });


    app.get("/reviews", async (req, res) => {
      const review = reviews.find({});
      const result = await review.toArray();
      res.send(result);
    });




  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("BlogX-Master is Running");
});
app.listen(port, () => {
  console.log("BlogX-Master is Running on PORT:", port);
});
