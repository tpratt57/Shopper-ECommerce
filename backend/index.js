const port = 4000
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors());

// Database Connection With Mongo

// CORRECTED VERSION:
mongoose.connect("mongodb+srv://tpratt57:SeniorBionicle666@cluster0.6oyysfr.mongodb.net/e-commerce");

// API Creation 

app.get("/", (req, res) => {
    res.send("Express App is Running");
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint For Images

app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for Creating Products

const Products = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

// Creating API to add products to database

app.post('/add-product', async (req, res) => {
    let products = await Products.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
    }
    const product = new Products({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,

    });

    console.log(product);
    await product.save();
    console.log("Saved");

    res.json({
        success: true,
        name: req.body.name
    });
});

// Creating API For Deleting Products

app.post('/remove-product', async (req, res) => {
    await Products.findOneAndDelete({ id: req.body.id });
    console.log("Removed");

    res.json({
        success: true,
        name: req.body.name
    });
});

// Creating API for getting all products

app.get('/all-products', async (req, res) => {
    let products = await Products.find({})
    console.log("All Products Fetched")

    res.send(products);
})

// Schema for creating user 

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// Endpoint for registering user/s
app.post('/signup', async (req, res) => {

    let check = await Users.findOne({ email: req.body.email });

    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email address" });
    }

    let cart = {};

    for (let i = 0; i < 300; i++) {
        cart[i] = 0;

    };

    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });


});

//Endpoint for User login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email })
    if (user) {
        const passCompare = req.body.password === user.password
        if (passCompare) {
            const data = {
                user: {
                    id: user.id,
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, errors: "Password is Incorrect" });
        }
    }
    else {
        res.json({ success: false, errors: "Email is Incorrect" })
    }
});

// Endpoint For newCollection data
app.get('/new-collections', async (req, res) => {
    let products = await Products.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New Collection Fetched")
    res.send(newcollection)
})

// Endpoint for Popular in Women Section
app.get('/popular-in-women', async (req, res) => {
    let products = await Products.find({category:"womens"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular In Women Fetched")
    res.send(popular_in_women);

})

//Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error){
            res.status(401).send({errors: "Please authenticate using a valid token"})
        }
    }
}

//Endpoint for adding products to cartData
app.post('/add-to-cart',fetchUser, async (req, res) => {
    console.log("Added", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Added")
})


//Endpoint to remove products from cartData
app.post('/remove-from-cart', fetchUser, async (req, res) => {
    console.log("Removed", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Removed")
})

//Endpoint to get cartData
app.post('/get-cart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running On Port " + port);
    }

    else {
        console.log("Error : " + error);
    }
});