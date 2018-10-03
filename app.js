const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')

const path = require('path');

const app = express()
const port = 8080

const OUTPUT_DIR = './output';

app.use('/res', express.static(path.join(__dirname, 'res')));
app.use('/libs', express.static(path.join(__dirname, 'libs')));
app.use('/', express.static(path.join(__dirname, '/')));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/projects.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'projects.html'));
})

app.get('/projects', (req, res) => {
  let projects = projectFileList()
  res.status(200).send({
    success: true,
    projects: projects
  })
})

app.get('/ganttAjaxController', async(req, res)=>{
  // console.log(req.query.projectId)
  if(req.query.projectId) {
    let fileName = `${req.query.projectId}.json`
    try {
      let project = fs.readFileSync(`${OUTPUT_DIR}/${fileName}`);  
      res.status(200).send({
        success: true,
        project: JSON.parse(project)
      })
    } catch (e) {
      res.status(400).send({
        success: false,
        message: `Error happened while retrieving data ${JSON.stringify(e)}`
      })
    }
  }
})


app.post('/ganttAjaxController', async(req, res) => {
  let fileName = ''
  if(req.query.projectId) {
    fileName = `${req.query.projectId}.json`
  } else {
    fileName = randomFileName()
  }
  fs.writeFile(fileName, req.body.prj, (err) => {  
    // throws an error, you could also catch it here
    if (err) {
      res.status(400).send({
        success: true,
        message: 'Error happened while saving'
      })
    } else {
      res.status(200).send({
        success: true,
        project: req.body.proj
      })
    }
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//
function randomFileName() {
  
  if (!fs.existsSync(OUTPUT_DIR)){
      fs.mkdirSync(OUTPUT_DIR);
  }
  let fileName = Math.random().toString(15).substring(2, 6) + Math.random().toString(15).substring(2, 6);
  return `${OUTPUT_DIR}/${fileName}.json`
}

function readFile() {
  console.log(fs.readFileSync('831b8096.json')) ; 
}

function projectFileList() {
  if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR);
  }
  try {
    var sorted =  fs.readdirSync(OUTPUT_DIR).map(function (fileName) {
      return {
        name: fileName,
        time: fs.statSync(OUTPUT_DIR + '/' + fileName).mtime.getTime()
      };
    })
    .sort(function (a, b) {
      return a.time - b.time; })
    .map(function (v) {
      return v.name; }
    );
    return sorted;
  } catch (e) {
    throw err;
  }
}