const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// toytopia
// TlvhMyittxZ7CdkC


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://toytopia:TlvhMyittxZ7CdkC@cluster0.bb0v57f.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // 
        const toysCollection = client.db("toytopia").collection("allToys");

        // get data
        app.get('/allToys', async (req, res) => {
            const cursor = toysCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // crate toys
        app.post('/allToys', async (req, res) => {
            const toy = req.body;
            console.log(toy)
            const result = await toysCollection.insertOne(toy);
            res.send(result);
        })






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is running")
});


// app.get('/data', (req, res) => {
//     res.send(data);
//     console.log(data)
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})