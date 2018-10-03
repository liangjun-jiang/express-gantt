const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')

const path = require('path');

const app = express()
const port = 8080

app.use('/res', express.static(path.join(__dirname, 'res')));
app.use('/libs', express.static(path.join(__dirname, 'libs')));
app.use('/', express.static(path.join(__dirname, '/')));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/ganttAjaxController', async(req, res)=>{
  if(req.query.projectId) {

  }
})


app.post('/ganttAjaxController', async(req, res) => {
  fs.writeFile(randomFileName(), JSON.stringify(req.body.prj), (err) => {  
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
  var dir = './output';

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  let fileName = Math.random().toString(15).substring(2, 6) + Math.random().toString(15).substring(2, 6);
  return `${dir}/${fileName}.json`
}