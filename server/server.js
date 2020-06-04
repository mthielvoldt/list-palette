
require('dotenv').config();
const express = require('express');
const session = require('express-session');

const db = require('./db');
const query = require('./querys');
const passport = require('./passport');
const crypt = require('./crypt')
const { logReq, validateRegistration, formatDbData } = require('./utils');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ inflate: true, strict: true, type: 'application/json' }));
if (process.env.NODE_ENV !== 'production') {
    app.use(express.static('build'));  // On production, nginx serves static content.
}
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


let port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Listening on port " + port)
});

app.get('/', async (req, res) => {
    logReq(req);
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + '/public/home.html');
    } else {
        res.redirect('/login.html');
    }
});

app.get('/items', async (req, res) => {
    logReq(req);
    if (!req.isAuthenticated()) {
        // send the default user's data
        const qRes = await db.query(query.getItems, [process.env.DEFAULT_USER_ID]);
        res.send({ user: null, items: qRes.rows });
        return;
    }
    //console.log(query.getItems, req.user.user_id);
    const qRes = await db.query(query.getItems, [req.user.user_id]);
    //console.log(qRes.rows);
    res.send({ user: req.user.name, items: qRes.rows });
});

app.get('/logout', async (req, res) => {
    logReq(req);
    req.logout();       // torches the session ID. 
    res.redirect('/');
});

// creates a new item
app.put('/items', async (req, res) => {
    logReq(req);
    if (!req.isAuthenticated()) {
        res.status(401).send("User not logged in");
        return;
    }

    let promises = [];

    if (typeof req.body.insert != 'undefined' && req.body.insert.length > 0) {
        let insertData = formatDbData(req.user.user_id, req.body.insert);
        promises.push(db.query(query.insertItems, insertData));
    }

    if (typeof req.body.update != 'undefined' && req.body.update.length > 0) {
        let updateData = formatDbData(req.user.user_id, req.body.update);
        promises.push(db.query(query.updateItems, updateData));
    }

    if (typeof req.body.delete != 'undefined' && req.body.delete > 0) {
        let deleteData = [req.user.user_id, req.body.delete];
        promises.push(db.query(query.deleteItems, deleteData));
    }

    Promise.all(promises)
        .then((results) => {
            results.forEach(result => {
                console.log(result.command, result.rows);
            });
            res.send("Changes saved");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("items not saved.");
        });


});


app.post('/login', passport.authenticate('local'), (req, res) => {
    logReq(req);
    res.send("User created:" + req.user.name);
});

app.post('/register', async (req, res) => {
    logReq(req);

    const name = req.body.name, email = req.body.email, pass = req.body.password;

    const invalidReason = validateRegistration(email, name, pass);
    if (invalidReason) {
        console.log(invalidReason);
        res.status(400).send(invalidReason);
        return;
    }

    const hash = await crypt.hash(pass);
    try {
        const response = await db.query(query.insertUser, [email, name, hash]);
        console.log("New user:", response.rows[0].user_id, email);

        req.login({ user_id: response.rows[0].user_id, name: name, email: email }, (err) => {
            if (err) {
                console.log("Error while trying to req.login", err);
            }
            res.send({ name: name });
        });
    } catch (err) {
        console.log("Error while registering new user");
        console.log(err.message);
        if (err.code === '23505') {
            res.status(400).send("That email already has an account");
            return;
        }
    }
});
