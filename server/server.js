
require('dotenv').config();
const express = require('express');
const session = require('express-session');

const db = require('./db');
const query = require('./querys');
const passport = require('./passport');
const crypt = require('./crypt')
const {logReq, validateRegistration} = require('./utils');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ inflate: true, strict: true, type: 'application/json' }));
if (process.env.NODE_ENV !== 'production') {
    app.use(express.static('server/public'));  // On production, nginx serves static content.
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
        // create a new anonymous user
        res.status(403).send("User not logged in");
        return;
    }
    console.log(query.getItems, req.user.user_id);
    const qRes = await db.query(query.getItems, [req.user.user_id]);
    console.log(qRes.rows);
    res.send(qRes.rows);
});

app.get('/logout', async (req, res) => {
    logReq(req);
    req.logout();       // torches the session ID. 
    res.redirect('/');
});

app.post('/login', passport.authenticate('local', {failureRedirect: '/login.html', successRedirect: '/'}));

app.post('/register', async (req, res) => {
    logReq(req);

    const name = req.body.name, email = req.body.email, pass = req.body.password;

    const invalidReason = validateRegistration(email, name, pass);
    if (invalidReason) {
        res.status(400).send(invalidReason);
        return;
    }

    const hash = await crypt.hash(pass);
    try {
        const response = await db.query(query.insertUser, [email, name, hash]);
        console.log("New user:", response.rows[0].user_id, email);

        req.login({user_id: response.rows[0].user_id, name: name, email: email}, (err) => {
            if (err) {
                console.log("Error while trying to req.login", err);
            }
            res.redirect('/');
        });
    } catch (err) {
        console.log("Error while registering new user");
        console.log(err.message);
        if (err.code === '23505') {
            res.status(403).send("That email already exists");
            return;
        }
    }
});

app.get('/mock', (req, res) => {
    logReq(req);
    const mockQuery = [
        { id: 0, next: null, child: 1, text: "Home", checked: false },
        { id: 1, next: 3, child: 6, text: "Staples", checked: false },
        { id: 3, next: null, child: 4, text: "Chicken Parm", checked: false },
        { id: 5, next: 2, child: null, text: "Produce", checked: false },
        { id: 6, next: 5, child: 16, text: "Dairy", checked: false },
        { id: 2, next: null, child: 13, text: "Meats", checked: false },
        { id: 12, next: null, child: null, text: "Ground Beef", checked: false },
        { id: 7, next: 12, child: null, text: "Bacon", checked: true },
        { id: 13, next: 7, child: null, text: "Sandwich Meat", checked: false },
        { id: 4, next: 8, child: 11, text: "Meats", checked: false },
        { id: 8, next: 9, child: 14, text: "Dairy", checked: false },
        { id: 9, next: null, child: 10, text: "Baking", checked: false },
        { id: 10, next: null, child: null, text: "Bread crumbs", checked: false },
        { id: 11, next: null, child: null, text: "Chicken breast", checked: false },
        { id: 14, next: 15, child: null, text: "Eggs", checked: false },
        { id: 15, next: null, child: null, text: "Parmesan cheese", checked: false },
        { id: 16, next: 17, child: null, text: "Milk", checked: false },
        { id: 17, next: null, child: null, text: "Eggs", checked: true },
    ];
    res.send(mockQuery);
})

