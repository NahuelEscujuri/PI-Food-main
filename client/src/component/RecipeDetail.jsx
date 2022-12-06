import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import * as action from "../redux/action.js";
import imgNotFound from "./img/imgNotFound.jpg";
// import "./styles/detail-style.css";
// import imgNotFound from "./imgNotFound.png";
// import Loader from "./Loader.jsx";
// import '../backgroundColorTypes.css'

const RecipeDetail =() => {
    const [ currentRecipe, setCurrentRecipe] = useState([])
    const [ currentId, setCurrentId] = useState(-1)

    let {id} =useParams()
  
    const dispatch = useDispatch();
    const recipe = useSelector((state) => state.recipeDetail)
    console.log("declarado el recipe",recipe)

    function indexSteps(){
      let newSteps = [];
      for(let i = 0;i < recipe[0]?.steps.length; i++){
          newSteps.push(i)
      }
       return newSteps
      }
    
    useEffect(()=>{
      window.scrollTo(0, 0);

        if(currentId !== id){
            dispatch(action.getRecipeDetails(id))
            setCurrentId(id);
            console.log("obtuvimos el ID", currentId)
        }
        if(recipe){
            console.log("if de recipe",recipe);
            setCurrentRecipe(recipe)
        }
    })

    useEffect(()=>{
      setCurrentRecipe([])
    },[id])
    try{
        return (
            <div> 
                {console.log("current ID", currentId)}
                {console.log("Current recipe ID",currentRecipe[0]?.id)}
                {console.log("¿Son iguales?",currentRecipe[0]?.id == currentId)}
                {currentRecipe[0]?.id == currentId?(
                        <div className={`detail-content`}>
                            {/* IMG */}
                            <div className="detail-item">
                               {console.log("currentRecipe",currentRecipe)}
                               <img src={!currentRecipe[0]?.img?imgNotFound:currentRecipe[0]?.img}/>
                            </div>
                            {/* TEXT */}
                            <div className="detail-item">
                              {/* title */}
                              <div className="detail-item_item">
                                <h1>{recipe[0]?.title}</h1>
                              </div>
                              {/* Id */}
                              <div className="detail-item_item detail_id">
                                <h3>ID:</h3>
                                <h3>{currentRecipe[0]?.id}</h3>
                              </div>
                              {/* Heald Score */}
                              <div className="detail-item_item detail_id">
                                <h3>Health Score:</h3>
                                <h3>{currentRecipe[0]?.healthScore}</h3>
                              </div>
                              <div className="detail-item_item detail_id">
                                <h3>Summary</h3>
                                <p>{recipe[0]?.summary}</p>
                              </div>
                              {/* Steps */}
                              <div className="stats-container detail-item_item">
                                <div className="stats-item">
                                  <ul>{
                                    recipe[0]?.steps &&
                                    indexSteps().map(s=>(
                                      <li>
                                        <h3>Step {s+1}</h3>
                                        <p>{recipe[0]?.steps[s]}</p>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              {/* Diets */}
                               <div className="type-container detail-item_item detail_diets-container">
                                <h3>Diets:</h3>
                                <div className="detail_diets">
                                   {currentRecipe[0]?.diets.map(t=>(<p>{t}</p>))}
                                </div>
                               </div>
                            </div>
                            
                        </div>):<h3>Loader...</h3> //<Loader/>
                }
          </div>
        );
  }
  catch(e){
    console.log(`message: ${e}`)
  }

};

export default RecipeDetail;