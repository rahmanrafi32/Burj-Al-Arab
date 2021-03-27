const express = require('express');
const app = express();
const cors = require('cors');
const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

app.use(cors());// cors = cross origin resource sen
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@firstcluster.bte1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const serviceAccount = require("./Configs/my-project-823262-firebase-adminsdk-21rb7-315265c96a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("Burj-Al-Arab").collection("booking");
  
  app.post('/addBooking', (req,res)=>{
      const newBooking = req.body;
      collection.insertOne(newBooking)
      .then(result=>{
          res.send(result.insertedCount > 0)
      })  
  })

  app.get('/bookings', (req,res)=>{
      const bearer = req.headers.authorization
      if (bearer && bearer.startsWith('Bearer ') ){
            const idToken = bearer.split(' ')[1];   
            // idToken comes from the client app
        admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
        const uid = decodedToken.uid;
        const tokenEmail = decodedToken.email;
        const queryEmail = req.query.email
        if(tokenEmail == queryEmail){
            collection.find({email: req.query.email})//filtering email
            .toArray((err,document)=>{
            res.status(200).send(document);
      })
        }
    else{
        res.status(401).send('Unauthorised access')
    }})
        .catch((error) => {
            res.status(401).send('Unauthorised access')
        });
      }
      else{
          res.status(401).send('Unauthorised access')
      }
    
  })
});


app.get('/', (req,res)=>{
    res.send('listening')
})

app.listen(3001)