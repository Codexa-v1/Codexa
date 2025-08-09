import express from 'express';

const server = express();

server.get('/', (req, res) => res.send('Hello!'));

server.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});

// Optional dummy await to prevent early exit (testing)
await new Promise(resolve => setTimeout(resolve, 1000));

