import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'

const backendURL = process.env.REACT_APP_BACKEND_URL;

const Popular = () => {

    

    const [popularProducts, setPopularProducts] = useState([]);
    useEffect(() => {
        fetch(`${backendURL}/popular-in-women`)
        .then((response)=>response.json())
        .then((data)=>setPopularProducts(data))
    },[])

    return (
        <div className='popular'>
            <h1>POPULAR IN WOMEN</h1>
            <hr />
            <div className='popular-item'>
                {popularProducts.map((item) => {

                    return <Item key={item.id} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                })}

            </div>
        </div>
    )
}

export default Popular