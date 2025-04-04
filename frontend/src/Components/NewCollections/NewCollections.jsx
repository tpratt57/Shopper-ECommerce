import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import Item from '../Item/Item.jsx'

const backendURL = process.env.REACT_APP_BACKEND_URL;
const NewCollections = () => {

  const [new_collection, setNew_collection] = useState([]);

  

  useEffect(() => {
    fetch(`${backendURL}/new-collections`)
    .then((response)=>response.json())
    .then((data)=>setNew_collection(data));
  },[])
  return (
    <div className='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className="collections">
            {new_collection.map((item, i) => {
                return <Item key={item.id} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default NewCollections