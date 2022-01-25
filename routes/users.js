var express = require('express')
var router = express.Router()

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require('../models/User')
const sendMail = require('../utils/email')

const auth = require("../auth");

router.post("/login",(req,res)=>{
    const {Email,password} =req.body;
    User.findOne({Email},async (err,user)=>{
        if(user){
           const isMatch = await bcrypt.compare(password, user.password);
           if (!isMatch) return res.json({ message: "Invalid credentials." });

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({
                token,
                user: {
                    id: user._id,
                    displayName: user.firstName,
                    type: user.Organization.toLowerCase()
                },
                message:"login sucess"
            });
        }else{
            res.json({message:"Not registered"})
        }
    })
});


//Register
router.post("/register",(req,res)=>{
    console.log(1)
    const {Email,Organization,firstName,lastName} =req.body;
    User.findOne({Email},async (err,user)=>{
        if(user){
            console.log(2)
            res.json({message:"User with this email id already exists",isRegistered: false})
        }else {
            console.log(3)
            var generatePassword = "";
            var characters =
                "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*?";

            for (var i = 0; i < 10; i++) {
                generatePassword += characters.charAt(
                Math.floor(Math.random() * characters.length)
                );
            }
            const passwordHash = await bcrypt.hash(generatePassword,10);

            const user = new User({Email,Organization,firstName,lastName,password: passwordHash})
            const mailOptions = {
                from: 'Your Friend <joanjeremiah@gmail.com>',
                to: Email,
                subject: 'Login credentials',
                text: `Your password is ${generatePassword}`,
                html: `<p>Your password is ${generatePassword}</p>`,
              };
          
            sendMail(mailOptions)
            .then(() => {
                console.log('mail sent')
            })

           try{
                const savedUser = await user.save();
                // delete savedUser.password;
                // res.json({message: 'Registered successfully.',user: savedUser,isRegistered: true});
                res.json({message: 'Registered successfully.',isRegistered: true});
           }
           catch (err) {
                res.json({ error: err.message,isRegistered: false });
            }
        }
    })
}) 

router.delete("/delete", auth, async (req, res) => {
    try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
    } catch (err) {
        res.json({ error: err.message });
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
    if (!token) return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
    if (!user) return res.json(false);
        return res.json(true);
    } catch (err) {
        res.json({ error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        id: user._id,
        displayName: user.firstName,
        type: user.Organization.toLowerCase()
    });
});

module.exports = router