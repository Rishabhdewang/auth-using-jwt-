const { Model } = require('objection');
const Knex = require('knex');
const express =require('express');
const app = express();
const PORT = process.env.PORT || 7000;

const knexConfig = require("./knexfile");
const bodyParser = require('body-parser');
const routes = require("./routes/route");



//knex init
const knex = Knex(knexConfig[process.env.NODE_ENV|| 'development']);
Model.knex(knex);

app.use(bodyParser.json());
app.use(express.json());

//routes
app.use(routes)

app.listen(PORT, ()=>{
    console.log("Listening on port :" + PORT);
});