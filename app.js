const express = require('express')
var app = express()
const port = 3000
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


app.listen(port, () => {
  console.log(`Project app listening at http://localhost:${port}`)
})


var indexRouter = require('./routes/index');
var companyRouter = require('./routes/company');


app.use('/', indexRouter);
app.use('/company', companyRouter);


module.exports = app;
