const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://dbUser2:dbUser2@cluster0.lp1uqqf.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("insertDB");
        const userCollection = database.collection("users");

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('New user', user);

            const result = await userCollection.insertOne(user);
            // res.status(201).json({ message: 'User created' });
            res.send(result);
        });

        app.get('/users', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.json(users);
        });

        // Add more routes for updating and deleting users if needed

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged the deployment. Successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Call the run function to start the server and connect to MongoDB
run().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(console.dir);
