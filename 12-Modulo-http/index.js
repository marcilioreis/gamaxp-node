const http = require('http');

http
  .createServer((request, response) => {
    response.end('Hi');
  })
  .listen(5200, () => {
    console.log('servidor on');
  });
