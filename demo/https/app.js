const https = require('https');
const fs = require('fs');

https
  .createServer(
    {
      key: fs.readFileSync('../certificate/server.key'),
      cert: fs.readFileSync('../certificate/server.cert'),
    },
    (req, res) => {
      console.log(111);
      res.write('<h1>hello world！</h1>');
      res.end();
    }
  )
  .listen(3001, () => {
    console.log('Listening...');
  });
