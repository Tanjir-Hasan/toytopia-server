const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// toytopia
// TlvhMyittxZ7CdkC


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

        // search
        const indexKeys = { name: 1, category: 1 }; // Replace field1 and field2 with your actual field names
        const indexOptions = { name: "nameCategory" }; // Replace index_name with the desired index name
        const result = await toysCollection.createIndex(indexKeys, indexOptions);

        // get data
        app.get('/allToys', async (req, res) => {
            const cursor = toysCollection.find();
            const result = await cursor.toArray();
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
                    sortOptions = { price: 1 }; // Sort in ascending order by the "price" field
                } else if (sortBy === 'desc') {
                    sortOptions = { price: -1 }; // Sort in descending order by the "price" field
                }
            }

            // sortOptions = { price: 1 }

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
                        { title: { $regex: text, $options: "i" } },
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