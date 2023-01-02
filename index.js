const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const model = require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware')
// const bcrypt = require('bcrpyt')
const port = process.env.PORT || 8000






app.use(express.json());

app.use(cors({ origin: "*" }));
mongoose.connect("mongodb+srv://Gtvsairam:password2626@cluster0.pl5lqxf.mongodb.net/Registration_users").then(
    () => console.log('DB Connection established')
)
 
// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,

// }).then(()=>console.log('connecteddd......'));
//////// Registration schema////////
app.post('/register', async (req, res) => {
    try {
        const { username, email, password,} = req.body;
        // const encry_password = await bcrypt.hash(password, 10);
        let exist = await model.findOne({ email })
        if (exist) {
            return res.status(400).send('User Already Exist')
        }
        let newUser = new model({
            username,
            email,
            password
        })
        await newUser.save();
        res.status(200).send('Registered Successfully')

    }
    catch (err) {
        console.log(err)
        return res.status(500).send('Internel Server Error')
    }
})
////login authentication
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let existuser = await model.findOne({ email });
        if (!existuser) {
            return res.status(400).send('user not found');
        }
        if (await compare(password,existuser.password)) {
            return res.status(200).send('login succesfully');
        }
        else{
            res.status(500).send('inavlid credentials')
        }
        let payload =
        {
            user: {
                id: existuser.id,
            }
        }
        jwt.sign(payload, 'jwtsecretkey', { expiresIn: 360000000 },
            (err, token) => {
                if (err) throw err
                return res.json({token})
            })
    } catch (error) {
        console.log(err)
        return res.status(500).send('Internel Server Error')
    }
})
////jwt decode 
app.get('/myprofile',middleware,async(req, res)=>{
    try{
        let exist = await model.findById(req.user.id);
        if(!exist){
            return res.status(400).send('User not found');
        }
        res.json(exist);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.get('/', (req, res) => {
    res.send('hello people')
})
app.get('/Home', (req, res) => {
    res.send('hello homeeeeeeee')
})

app.listen(port, () => {
    console.log("serever started.......");
});