const express = require("express");
const {uuid} = require("uuidv4");
const cors = require("cors");

// const { uuid } = require("uuidv4");

const app = express();

function checkRepoExists(req, res, next){
  const foundRepoIndex = repositories.findIndex(repo => repo.id == req.params.id);
  console.log('foundRepoIndex:'+foundRepoIndex)
  if(foundRepoIndex<0){
    return res.sendStatus(400);
  }
  res.locals.foundRepoIndex = foundRepoIndex; // Store the repo index for later use
  next();
}
app.use(express.json());
app.use(cors());
app.use('/repositories/:id', checkRepoExists);
app.use('/repository/:id', checkRepoExists);
app.use('/repository/:id/likes', checkRepoExists);

const repositories = [];

app.get("/repositories", (request, response) => {
  response.send(repositories);
});

app.get("/repository/:id", (request, response) => {
  if(repositories[response.locals.foundRepoIndex]){
    response.send(repositories[response.locals.foundRepoIndex]);
  }
  else{
    response.sendStatus(500);
  }
});

app.post("/repositories", (request, response) => {
  // id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes:
  const {title, url, techs, likes} = request.body;
  console.log(likes);
  if(likes != null){
    return response.sendStatus(400);
  }
  const id = uuid();
  const newRepo = {
    "id":id,
    "title":title,
    "url":url,
    "techs":techs,
    "likes": 0
  }
  repositories.push(newRepo);
  response.status(201).send(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  console.log(repositories[response.locals.foundRepoIndex]);
  repositories[response.locals.foundRepoIndex].title = title;
  repositories[response.locals.foundRepoIndex].url = url;
  repositories[response.locals.foundRepoIndex].techs = techs;
  response.sendStatus(200);
});

app.delete("/repositories/:id", (request, response) => {
  if(repositories[response.locals.foundRepoIndex]){
   repositories.splice(response.locals.foundRepoIndex,1);
   response.sendStatus(204);
  }
});

app.post("/repositories/:id/like", (request, response) => {
  if(repositories[response.locals.foundRepoIndex]){
    repositories[response.locals.foundRepoIndex].likes += 1;
    response.send(repositories[response.locals.foundRepoIndex]);
  }
});

module.exports = app;
