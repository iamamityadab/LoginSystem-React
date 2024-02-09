const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser")
const session = require("express-session");
const saltRounds = 10;

const PORT = process.env.PORT || 8000;

const app = express();


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    key: "userId",
    secret: "atanu",
    resave: false,
    saveUninitialized: false,
}))

const db = mysql.createConnection({
    host: "sql6.freesqldatabase.com",
    database: "sql6683105",
    user: "sql6683105",
    password: "IMXx5u7ilg",
    port: "3306"
});

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


// app.get("/",(req,res)=>{
//     res.send("hi");
// })

app.post("/register", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, (errr, hash) => {
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: hash,
        };
        if (errr) {
            console.log(err);
        }
        else {
            let sqll = `select * from users where email='${email}'`;
            db.query(sqll, (er, ress) => {
                if (ress.length > 0) {
                    res.send({ msg: "User Email Already Present" })
                }
                else {
                    let sql = "INSERT INTO `users` SET ?";
                    db.query(sql, data, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            //  console.log(result);
                            res.send(result);
                            // res.send()
                        }
                    })
                }
            })
        }
    })
})

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let sql = `SELECT * FROM users WHERE email='${email}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ login: false, msg: "Internal server error" });
        } else {
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (errr, response) => {
                    if (response) {
                        req.session.user = result;
                        const userName = result[0].Name;
                        res.send({ login: true, useremail: email, userName: userName });
                    } else {
                        res.send({ login: false, msg: "Wrong Password" });
                    }
                });
            } else {
                res.send({ login: false, msg: "User Email Not Exists" });
            }
        }
    });
});


app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ login: true, user: req.session.user });
    }
    else {
        res.send({ login: false });
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out');
        } else {
            res.send('Logged out successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`app running in ${PORT}`)
})