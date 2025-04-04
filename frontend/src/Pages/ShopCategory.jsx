import React, { useContext } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext.jsx'
import dropdown_icon from "../Components/Assets/dropdown_icon.png"
import Item from '../Components/Item/Item.jsx'


const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext);
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt='' />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {all_product.filter(item => props.category === item.category).length > 0 ? '1-' + Math.min(12, all_product.filter(item => props.category === item.category).length) : '0-0'}</span> out of {all_product.filter(item => props.category === item.category).length} products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt='' />
        </div>
      </div>

      <div className="shopcategory-products">
        {all_product.length > 0 ? ( // Conditionally render if all_product has data
          all_product.map((item, i) => {
            if (props.category === item.category) {
              return <Item key={item.id} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            }
            return null;
          })
        ) : (
          <p>Loading products...</p> // You can add a loading indicator here
        )}
      </div>

      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default ShopCategory