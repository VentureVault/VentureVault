const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');
const activityRouter = require('./routes/activityRouter');

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/user', userRouter);

app.use('/api/activity', activityRouter);


// app.get('/api', (req, res) => {
//   res.send('hello world from express!');
// });


app.get('/', (req, res) => {
  res.status(404).send('Nothing to see here!')
})


//Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`)
});

module.exports = app;