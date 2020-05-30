const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const choices = require('./keypressHandler');
const queue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  // if req.method === OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
  }

  // if re.method === GET
  if (req.method === 'GET') {
    if (req.url === '/') {
      // aka dequeue
      res.writeHead(200, headers);
      res.end(queue.dequeue());
      next();

    } else {
      if (req.url === '/background.jpg') {
        // then fs.readFile to check whethere image exist
        fs.readFile('.' + req.url, (err, data) => {

          if (err) {
            res.writeHead(404, headers);
            res.end();
            next();

          } else {
            res.writeHead(200, headers);
            res.end(data);
            next();
          }
        });
      } else {
        res.writeHead(404, headers);
        res.end();
        next();
      }
    }
  }

  // next(); // invoke next() at the end of a request to help with testing!
};
