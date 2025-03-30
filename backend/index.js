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

app.post('/addproduct', async (req, res) => {
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

app.post('/removeproduct', async (req, res) => {
    await Products.findOneAndDelete({ id: req.body.id });
    console.log("Removed");

    res.json({
        success: true,
        name: req.body.name
    });
});

// Creating API for getting all products

app.get('/allproducts', async (req, res) => {
    let products = await Products.find({})
    console.log("All Products Fetched")

    res.send(products);
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running On Port " + port);
    }

    else {
        console.log("Error : " + error);
    }
});