import axios from "axios";

export const GET_ALL_DIETS = "GET_ALL_DIETS";
export const GET_ALL_RECIPES = "GET_ALL_RECIPES";
export const SEARCH_RECIPES = "GET_ALL_RECIPES";
export const GET_DETAIL_RECIPES = "GET_DETAIL_RECIPES";
export const CREATE_RECIPES = "CREATE_RECIPES";

export const getAllRecipes = (only,title)=>{
    return function (dispatch){
        let url = title !== undefined?`http://localhost:3001/recipes?typeData=${only}&title=${title}`:
        `http://localhost:3001/recipes?typeData=${only}`
        return fetch(url)
        .then((response) => response.json())
        .then(data=>{
            console.log("desde el ACTION",data)
            dispatch({
                type: GET_ALL_RECIPES, payload: data
            })
        })
    }
}

export const getRecipeDetails = (id)=>{
    return function(dispatch){
        fetch(`http://localhost:3001/recipes/${id}`)
        .then((response) => response.json())
        .then(dataD=>{
            console.log("desde el ACTION",dataD)
            dispatch({
                type: GET_DETAIL_RECIPES, payload: dataD
            })
        })
    }
}


export function createRecipe(values){
    console.log("Desde el ACTIONS",values);
    return function(dispatch){
        return axios.post(`http://localhost:3001/recipes`,values)
          .then((data) => { 
            console.log("Dispatch",dispatch)
         dispatch({
            type: CREATE_RECIPES, payload: data
         });
      });
     };
}

export const getAllDiets = ()=>{
    return function (dispatch){
        return fetch(`http://localhost:3001/diets`)
        .then((response) => response.json())
        .then(data=>{
            console.log(data);
            dispatch({
                type: GET_ALL_DIETS, payload: data
            })
        })
    }
}