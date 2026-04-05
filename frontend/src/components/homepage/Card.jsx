
import { NavLink } from "react-router-dom";

const Card = ({ id, img, sweetname, summary,  }) => {
  

  return (
    <NavLink to={`/product/${id}`} className="activeLink">
      <div className="card">
        <img src={img} alt={sweetname} className="dessertImage" />
        <div className="card-contents">
          <h2 className="dessert-name">{sweetname}</h2>
          <p className="dessert-subtitle">{summary}</p>
         
        
        </div>
      </div>
    </NavLink>
  );
};

export default Card;
