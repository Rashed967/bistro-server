const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

// middleWire 
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kt6fwyn.mongodb.net/?retryWrites=true&w=majority`;

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

    const userCollection = client.db('bistroDB').collection('users')
    const menuCollection = client.db('bistroDB').collection('menu')
    const reviewCollection = client.db('bistroDB').collection('reviews')
    const cartCollection = client.db('bistroDB').collection('carts')



    // user api 
    
    app.get('/users', async(req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })
    
    app.post('/users', async(req, res) => {
      const user = req.body
      const query = {email : user.email}
      const existingUser = await userCollection.findOne(query)
      if(existingUser){
        return console.log(existingUser)
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    // menu collection 
    app.get("/menu", async (req, res) => {
        const result = await menuCollection.find().toArray()
        res.send(result)
    })


    // reviews collection 
    app.get("/reviews", async (req, res) => {
        const result = await reviewCollection.find().toArray()
        res.send(result)
    })


    // cart collection 

    app.get('/carts', async(req, res) => {
      const email = req.query.email
      if(!email){
        res.send([])
      }
      const query = {email : email}
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/carts', async(req , res) => {
      const item = req.body
      console.log(item)
      const result = await cartCollection.insertOne(item)
      res.send(result)
    })


    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id
      console.log(id)
      const query = {_id : new ObjectId(id)}
    
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    
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



app.get('/', (req, res) => {
    res.send("bistro boss server is running")
})

app.listen(port, () =>{
    console.log(`server is running on port ${port}`)
})