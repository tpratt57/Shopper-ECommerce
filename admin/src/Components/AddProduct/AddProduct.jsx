import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women's",
        new_price: "",
        old_price: ""
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) => {
        setProductDetails({...productDetails, [e.target.name]: e.target.value})
    }

    const Add_Product = async() => {
        console.log(productDetails);
        
    }
    return (
        <div className="add-product">
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type='text' name='name' placeholder='Type Here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type='text' placeholder='Type Here' name='old_price'/>
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type='text' placeholder='Type Here' name='new_price'/>
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name='category' className='addproduct-selector'>
                    <option value='womens'>Women's</option>
                    <option value='mens'>Men's</option>
                    <option value='kids'>Kids</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
               <label  htmlFor='file-input'>
                <img className='addproduct-thumbnail-img' src={image?URL.createObjectURL(image):upload_area}/>
               </label>
               <input onChange={imageHandler} type='file' name='image' id='file-input' hidden/>
            </div>
            <button onClick={() => {Add_Product()}} className='addproduct-button'>Add</button>
        </div>
    )
}

export default AddProduct