const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
let pages = 3;
let dbClient;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser())

mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client;
    app.locals.titles = client.db("02-lab").collection("titles");
    app.locals.posts = client.db("02-lab").collection("posts");
    app.locals.users = client.db("02-lab").collection("users");
    app.listen(1337, function () {
        console.log('App listening on port 1337');
    });
});

app.get('/', function (req, res) {
    res.redirect('/index/1');
});

app.get('/index', function (req, res) {
    res.redirect('/index/1');
});

app.get('/post/(:id)', function (req, res) {
    const users = req.app.locals.users;
    users.findOne({ sid: parseInt(req.cookies.sid) }, function (err, user) {
        const collection = req.app.locals.posts;
        const id = req.params.id;
        collection.findOne({ id: id }, function (err, post) {
            if (err) return console.log(err);
            if (post) {
                res.render('post.ejs', { post: post, user: user });
            } else {
                res.redirect('../index/1');
            }
        });
    });
});

app.get('/logout', function (req, res) {

    const users = req.app.locals.users;
    users.findOneAndUpdate({ sid: parseInt(req.cookies.sid) },
        { $set: { sid: getRandomInt(0, 99999999999) } },
        function (err, result) {
        if (err)
        {
            res.send('Fail! <a href="../index/0"><button>Continue</button></a>');
        } else {
            res.send('<a href="../index/0"><button>Continue</button></a>');
        }
    });
});

app.get('/index/(:page)', function (req, res) {
    const users = req.app.locals.users;
    users.findOne({ sid: parseInt(req.cookies.sid) }, function (err, user) {
        const collection = req.app.locals.titles;
        const page = req.params.page;
        if (page > pages || page < 1)
            res.redirect('1')
        collection.find({ page: page }).toArray(function (err, titles) {
            if (err) return console.log(err);
            res.render('index.ejs', { titles: titles, page: page, pages: pages, user: user });
        });
    });
});

app.get('/register', function (req, res) {
    res.send('<form action="/register" method="post"><label for= "login" > Login:</label ><input type="text" required id="login" name="login" /><label for="password">Password:</label><input type="password" required id="password" name="password" /><input type="submit" value="Submit" /></form >');
});

app.post('/register', function (req, res) {
    const users = req.app.locals.users;
    users.findOne({ login: req.body.login }, function (err, user) {
        if (user) {
            res.send('This acount is allready exists.<a href="../register"><button>Continue</button></a>');
        } else {
            const usersid = getRandomInt(0, 99999999999);
            users.insertOne({ login: req.body.login, password: req.body.password, sid: usersid }, function (err, client) {
                if (err)
                {
                    res.send('Server error (T^T)<a href="../register"><button>Continue</button></a>');
                } else {
                    res.cookie('sid', usersid);
                    res.send('Complete.<a href="../index/0"><button>Continue</button></a>');
                }
            });
        }
    });
});

app.post('/login', function (req, res) {
    req.app.locals.users.findOne({ login: req.body.login }, function (err, user) {
        if (user && (user.password == req.body.password)) {
            res.cookie('sid', user.sid);
            res.send('<a href="../index/0"><button>Continue</button></a>');
        } else
        {
            res.send('Wrond login or password<a href="../index/0"><button>Continue</button></a>');
        }
    });
});

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});