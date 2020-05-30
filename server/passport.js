
const passport = require("passport");
const crypt = require("./crypt");
const LocalStrategy = require("passport-local").Strategy;  

const db = require("./db");     

passport.use(new LocalStrategy({}, (username, password, cb) => {
    db.query('SELECT user_id, email, password, name FROM users WHERE email=$1', [username], (err, result) => {   // injection?
        if (err) {
            console.error("Error querying user on login", err);
            return cb(err);
        }
        if (result.rows.length > 0) {
            const first = result.rows[0]
            crypt.compare(password, first.password, function (err, res) {
                if (res) {
                    cb(null, { user_id: first.user_id, email: first.email, name: first.name })
                } else {
                    console.log("Incorrect password");
                    cb(null, false)
                }
            })
        } else {
            console.log("Username not found");
            cb(null, false)
        }
    })
}));
passport.serializeUser((user, done) => {
    done(null, user.user_id)
});
passport.deserializeUser((id, cb) => {
    db.query('SELECT user_id, email, name FROM users WHERE user_id = $1', [parseInt(id, 10)], (err, results) => {
        if (err) {
            console.error('Error querying user on session deserialize', err)
            return cb(err)
        }
        cb(null, results.rows[0])
    });
});

module.exports = passport;