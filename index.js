const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a7xog.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const usersCollection = client.db(`${process.env.DB_NAME}`).collection("users");
  console.log("database connected");

  app.get('/', (req, res) => {
    res.send("It' Working!");
  })

  // user signup
  app.post('/signup', (req, res) => {
    const userData = req.body;
    let isUserExist = false;

    usersCollection.find({ email: userData.email })
      .toArray((err, data) => {
        if (data.length) {
          res.send(false);
        } else {
          usersCollection.insertOne(userData)
            .then(result => {
              res.send(true);
            })
        }
      })
  })

  // user login
  app.post('/login', (req, res) => {
    const userData = req.body;
    usersCollection.findOne({email: userData.email, password: userData.password})
    .then(result => {
      if(result) {
        res.send({_id: result._id, name: result.name, email: result.email});
      } else {
        res.send(false);
      }
    })
  })

});

app.listen(process.env.PORT || port);