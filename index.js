const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express')
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ij59.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("groceryShop").collection("products");
  console.log('database connected successfully')

  const ordersCollection = client.db("groceryShop").collection("orders");
  app.post('/addOrders', (req, res) => {
    const newOrders = req.body;
    ordersCollection.insertOne(newOrders)
      .then(result => {
        res.send(result.insertedCount>0)
      })
  })
  app.get('/orders', (req, res) => {
    ordersCollection.find({email:req.query.email})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
        
      })
  })
  app.delete('/delete/:id', (req, res) => {
    const id = ObjectId(req.params.id)
    productsCollection.deleteOne({ _id: id })

      .then(result => {
        res.send(result.deletedCount>0);
      })

  })

  app.get('/product/:id', (req, res) => {
    productsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  app.post('/addProducts', (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})