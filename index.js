const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://pawmart-assignment:gaPL365fDwpO0ATk@cluster0.a1rdcep.mongodb.net/?appName=Cluster0";

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
    app.get('/search', async (req, res) => {
      const search = req.query.search;
      const result = await listingCollection.find({category: {$regex: search, $options: 'i'}}).toArray();
      res.send(result)
    })

    // create a new listing
    app.post("/allListing", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await listingCollection.insertOne(data);
      res.send(result)
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
