
const authAdmin = (req, res, next) => {
    const authenticated = false;
    if(!authenticated) {
        res.status(401).send("Unauthorised access from middleware");
    } else {
        console.log("In authAdmin before next");
        next();
    }
}

module.exports = {
    authAdmin
}