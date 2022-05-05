const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a8ht1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run () {
    try{
        await client.connect();
        const vehicleCollection = client.db('vehicleList').collection('vehicle');

        app.get('/vehicleList', async (req, res) => {
            const query = {};
            const cursor = vehicleCollection.find(query);
            const collections = await cursor.toArray();
            res.send(collections);
        });

        app.get('/vehicle/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const collection = await vehicleCollection.findOne(query);
            res.send(collection);
        });

        app.patch('/vehicle/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await vehicleCollection.updateOne(
                query,
                { $set: { "quantity": 100 },
                  $currentDate: { lastModified: true } })
            res.send(result);
        })

    }







    finally{

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server Running');
});


app.listen(port, () => {
    console.log("Listen", port);
})