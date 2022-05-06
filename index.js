const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb connection parameters
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a8ht1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//api
async function run () {
    try{
        //connection to database and collection
        await client.connect();
        const vehicleCollection = client.db('vehicleList').collection('vehicle');

        //get api

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

        app.get('/myItems', async (req, res) => {
            const search = req.query.email;
            const query = {email:  search };
            const cursor = vehicleCollection.find(query);
            const collections = await cursor.toArray();
            res.send(collections);
        });

        //patch api

        app.patch('/vehicle/:id', async(req, res) => {
            const quantity = req.body.quantity;
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await vehicleCollection.updateOne(
                query, 
                { $set: { "quantity": quantity },
                  $currentDate: { lastModified: true } })
            res.send(result);
        });


        //post api

        app.post('/addvehicle' ,async(req, res) => {
            const newVehicle = req.body;
            const result = await vehicleCollection.insertOne(newVehicle);
            res.send(result);
        })


        //delete api

        app.delete('/vehicle/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await vehicleCollection.deleteOne(query);
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

//listening to the server port
app.listen(port, () => {
    console.log("Listen", port);
})