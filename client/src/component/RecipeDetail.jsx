import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import * as action from "../redux/action.js";
import imgNotFound from "./img/imgNotFound.jpg";
import "./styles/detail-style.css";

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
                  <>
                       <div className={`detail-content`}>

                            {/* IMG */}
                            <div className="detail-item">
                               <img src={!currentRecipe[0]?.img?imgNotFound:currentRecipe[0]?.img}/>
                            </div>

                            {/* TEXT */}
                            <div className="detail-item detail-item_text">
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
                            </div>
                              </div>
                              
                              {/* Summary*/}
                              <div className="data-container detail-item_item">
                                <h3>Summary</h3>
                                <div 
                                className="summary"
                                dangerouslySetInnerHTML={{__html: currentRecipe[0]?.summary}}>
                                  </div>
                              </div>
                              {/* Steps */}
                              <div className="data-container detail-item_item">
                                <div className="steps">{
                                    recipe[0]?.steps &&
                                    indexSteps().map(s=>(
                                      <div className="data-container detail-item_item">
                                        <h3>Step {s+1}</h3>
                                        <div className="summary">{recipe[0]?.steps[s]}</div>
                                      </div>
                                    ))}
                                  </div>
                              </div>
                              {/* Diets */}
                               <div className="data-container detail-item_item">
                                <h3>Diets:</h3>
                                <div className="summary diets-container">
                                   {currentRecipe[0]?.diets.map(t=>(<p className="diet">{t}</p>))}
                                </div>
                               </div>
                  </>
                        ):<h3>Loader...</h3> //<Loader/>
                }
          </div>
        );
  }
  catch(e){
    console.log(`message: ${e}`)
  }

};

export default RecipeDetail;