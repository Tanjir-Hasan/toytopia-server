const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bb0v57f.mongodb.net/?retryWrites=true&w=majority`;

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

        // search
        const indexKeys = { name: 1, category: 1 };
        const indexOptions = { name: "nameCategory" };
        const result = await toysCollection.createIndex(indexKeys, indexOptions);

        // get data
        app.get('/allToys', async (req, res) => {
            const cursor = toysCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result);
        });

        // single user
        app.get('/userToys', async (req, res) => {
            let query = {};

            if (req.query?.email) {
                query = { email: req.query.email };
            }

            let sortOptions = {};
            if (req.query?.sortBy) {
                const sortBy = req.query.sortBy;
                if (sortBy === 'asc') {
                    sortOptions = { price: 1 };
                } else if (sortBy === 'desc') {
                    sortOptions = { price: -1 };
                }
            }

            const result = await toysCollection.find(query).sort(sortOptions).toArray();
            res.send(result);
        });

        // crate toys
        app.post('/allToys', async (req, res) => {
            const toy = req.body;
            toy.price = Number(toy.price);
            console.log(toy)
            const result = await toysCollection.insertOne(toy);
            res.send(result);
        });

        // 
        app.get("/getToysByText/:text", async (req, res) => {
            const text = req.params.text;
            const result = await toysCollection
                .find({
                    $or: [
                        { name: { $regex: text, $options: "i" } },
                        { category: { $regex: text, $options: "i" } },
                    ],
                })
                .toArray();
            res.send(result);
        });

        // update
        // app.patch('allToys/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) };
        //     const 
        // })

        // delete
        app.delete('/userToys/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
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