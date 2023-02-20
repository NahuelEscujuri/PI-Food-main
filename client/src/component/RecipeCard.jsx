import * as action from "../redux/action.js"
import React from "react"
import imgNotFound from "./img/imgNotFound.jpg";
import { Link } from "react-router-dom";

const RecipeCard = (props)=>{
    return(
        <Link to={`/recipes/${props.id}`}>
        <div className="card" key={props.key}>
            <div className="card_img">
                 <img src ={!props.img?imgNotFound:props.img}/>
            </div>
            <div className="card_text">
                 <h3>{props.title}<span></span></h3>
                 <b>Diets:</b>
                 {props.diets?<div className="card_text-diet">
                   {props.diets.map(d=>(<p className={d}>{d}</p>))} 
                 </div>:undefined}
            </div>
        </div>
        </Link>
    )
}

// export const mapDispatchToProps = {action};

export default RecipeCard;