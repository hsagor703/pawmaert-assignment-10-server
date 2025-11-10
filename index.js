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
    const db = client.db('pawmart-assignment');
    const listingCollection = db.collection('listing')

    app.get('/allListing', async (req,res) => {
        const cursor = await listingCollection.find().toArray();
        res.send(result);
    })

    app.get('/latestList', async (req,res) => {
        const result = await listingCollection.find().limit(6).toArray();
        res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}run().catch(console.dir)

app.listen(port, () => {
  console.log(`pawmart assignment server running port: ${port}`);
});
