
require('dotenv').config();
const express = require('express');
const session = require('express-session');

const db = require('./db');
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

app.get('/logout', async (req, res) => {
    logReq(req);
    req.logout();       // torches the session ID. 
    res.redirect('/');
});

app.post('/login', passport.authenticate('local', {failureRedirect: '/login.html', successRedirect: '/'}));

app.post('/register', async (req, res) => {
    logReq(req);

    const invalidReason = validateRegistration(req.body.email, req.body.name, req.body.password);
    if (invalidReason) {
        res.status(400).send(invalidReason);
        return;
    }

    const hash = await crypt.hash(req.body.password);
    const params = [req.body.email, req.body.name, hash];
    try {
        const response = await db.query(
            "INSERT INTO users(email, name, password) VALUES($1, $2, $3) RETURNING *", params);
        console.log("New user:", response.rows[0].name, response.rows[0].email);

        req.login(response.rows[0], (err) => {
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

