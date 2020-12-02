const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://root:toor@cluster0.pe2mz.mongodb.net/zoom-car-api?retryWrites=true&w=majority'
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
