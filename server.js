let express = require("express");
let app = express();
let sanitizeHTML = require("sanitize-html");
let mongodb = require("mongodb");
let db;
app.use(express.static("public"));

let connectionString =
  "mongodb+srv://sherine2001:Srisheshi3@cluster0.8pccq.mongodb.net/todoapp";

mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      return console.log(err);
    }

    console.log("Connected correctly!");
    db = client.db();
    app.listen(9000);
  }
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function passwordProtected(req, res, next) {
  res.set("WWW-Authenticate", 'Basic realm="Simple Todo App"');
  if (req.headers.authorization == "Basic c2hlcmluZTIwMDE6U3Jpc2hlc2hpMyM=") {
    next();
  } else {
    res.status(401).send("Authentication required");
  }
}

app.use(passwordProtected);
app.get("/", function (req, res) {
  db.collection("items")
    .find()
    .toArray(function (err, items) {
      res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style><i class="fas fa-shopping-cart"></i></style>
      <title>Simple To-Do App!!!</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      
      </head>
      <style>
      body {
        background-color:lavender;
       }
      </style>
  
    <body>     
      <div class="container">
           <div class="text-center">   
           <h1 class=" py-4 display-5 fa fa-shopping-cart fa-3x fa-align-center">To-Do App</h1>
     </div>  


        <div class="jumbotron p-3 shadow-sm">
          <form  id ="create-form"  action="/create-item"  method ="POST"  >
            <div class="d-flex align-items-center">
              <input id ="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" >

          
        </ul>

        <script>
         let items= ${JSON.stringify(items)}
        </script>
          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  
        <script src="/browser.js"></script>
       
        
      </div>
     
    </body>
   
    </html>`);
    });
});

app.post("/create-item", function (req, res) {
  let safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  db.collection("items").insertOne({ text: safeText }, function (err, info) {
    res.json({ _id: info.insertedId, text: safeText });
  });
});

app.post("/update-item", function (req, res) {
  let safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  });

  db.collection("items").findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: safeText } },
    function () {
      res.send("Success");
    }
  );
});
app.post("/delete-item", function (req, res) {
  db.collection("items").findOneAndDelete(
    { _id: new mongodb.ObjectId(req.body.id) },
    function () {
      res.send("Success");
    }
  );
});
