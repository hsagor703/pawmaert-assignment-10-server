const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.a1rdcep.mongodb.net/?appName=Cluster0`;

app.get("/", (req, res) => {
  res.send("pawmart assignment server is running");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("pawmart-assignment");
    const listingCollection = db.collection("listing");
    const orderCollection = db.collection("order-info");

    // get all listing
    app.get("/allListing", async (req, res) => {
      const cursor = await listingCollection.find().toArray();
      res.send(cursor);
    });

    // get 6 latest list
    app.get("/latestList", async (req, res) => {
      const result = await listingCollection
        .find()
        .sort({ date: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // get for search
    app.get("/search", async (req, res) => {
      const search = req.query.search;
      const result = await listingCollection
        .find({ name: { $regex: search, $options: "i" } })
        .toArray();
      res.send(result);
    });

    // get for filter
    app.get("/filter", async (req, res) => {
      const filter = req.query.filter;
      const result = await listingCollection
        .find({ category: { $regex: filter, $options: "i" } })
        .toArray();
      res.send(result);
    });

    // create a new listing
    app.post("/allListing", async (req, res) => {
      const data = req.body;
      const result = await listingCollection.insertOne(data);
      res.send(result);
    });

    // get find with email from listing
    app.get("/myListing", async (req, res) => {
      const email = req.query.email;
      const result = await listingCollection.find({ email: email }).toArray();
      res.send(result);
    });

    // update single item
    app.patch("/myListing/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      console.log("form server side", id);
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: data,
      };
      const result = await listingCollection.updateOne(query, update);
      res.send(result);
    });

    // delete single item
    app.delete("/allListing/:id", async (req, res) => {
      const id = req.params.id;
      console.log("from delete api", id);
      const query = { _id: new ObjectId(id) };
      const result = await listingCollection.deleteOne(query);
      res.send(result);
    });

    // create a new order in orderCollection
    app.post("/orderList", async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.send(result);
    });

    // get find with email
    app.get("/myOrders", async (req, res) => {
      const email = req.query.body;
      const result = await orderCollection.find(email).toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`pawmart assignment server running port: ${port}`);
});
