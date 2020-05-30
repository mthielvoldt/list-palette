
function validateRegistration(email, name, password) {
    if (!validEmail(email)) return "Invalid email: user not created";
    if (!validName(name)) return "Invalid name: user not created";
    if (!validPassword(password)) return "Invalid password: user not created";
    return null;
}

function validEmail(str) {
    const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    return emailRegex.test(str);
}
function validName(str) {
    const nameRegex = /^[A-Za-z][A-Za-z\u00C0-\u00FF\'\-]+([\ A-Za-z][A-Za-z\u00C0-\u00FF\'\-]+)*/;
    return nameRegex.test(str);
}
function validPassword(str) {
    const passRegex = /^[!-~]{7,50}$/;
    return passRegex.test(str);
}

function logReq(req) {
    if (req.user == null) {
        console.log(req.method, req.url, ": no user");
    } else {
        console.log(req.method, req.url, ":", req.user.name, ":", req.user.user_id);
    }
}
module.exports = {
    validateRegistration: validateRegistration, 
    logReq: logReq
}