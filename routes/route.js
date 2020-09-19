require("dotenv").config();
const {
    okResponse,
    badRequestError,
    to,
    unverifiedError,
    notFoundError,
    loginResponse,
} = require('./global_functions')
const bcrypt = require("bcrypt");
const auth = require('../model/authmodel');
const router = require("express").Router();
const validator = require("validator");
const jwt = require("jsonwebtoken");

router.get("/", authenticateToken, (req, res) => {

    const email = req.body.email;

    res.send("routes are working succcesfully");
})

router.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!validator.isEmail(email || "")) {
        return res.send("Enter a valid email address");
    }
    if (password === "") {
        return res.send("Password cannot be empty");
    }

    let result = await auth.query().where("Email", email).first();

    if (result) {
        console.log(result);
        return res.send("Email already exist");
    }

    // const salt = await bcrypt.genSalt(); the salt can be automatically generated.
    const hashedpassword = await bcrypt.hash(password, 10)
    // console.log(salt)    
    // console.log(hashedpassword)

    const signup = await auth.query().insert({
        Email: email,
        Password: hashedpassword
    })

    res.send(signup)

    // } catch {

    //     res.send("Error occur, please Retry")
    // }

})


//Login User 
router.post("/login", async (req, res) => {
    // try {
    let {
        email,
        password
    } = req.body;

    if (!validator.isEmail(email || "")) {
        return res.send("Enter a valid email address");
    }
    if (password === "") {
        return res.send("Password cannot be empty");
    }
    // CHECK FOR NOT FOUND
    let [not_found, found] = await to(auth.query().findOne("Email", email).throwIfNotFound());
    // console.log(found);
    if (not_found) {
        return res.send("New USer , Please Sign Up First")
    }

    if (await bcrypt.compare(password, found.Password)) {
        const accessToken = jwt.sign({
            email: found.Email,
        }, process.env.ACCESS_TOKEN_SECRET)

        res.send({
            accesstoken: accessToken
        });
    } else {
        res.send("Wrong password");
    }



    // } catch {

    // }


})

function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split('')[1]
    if (token) return res.status(401).send("token");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
        if (err) return err;
        req.email = email;
        next();
    })

}



module.exports = router;