import express from "express";
import routes from './routes/index.js';

const PORT = 3000;
var app = express();

app.listen(PORT, () => {
  console.log('Server running on port 3000');
});

routes(app);

export default app;
