const app = require('./app');
port = process.env.PORT || 3001

app.listen(port, () => {
    console.log('App is running on port ', port);
})