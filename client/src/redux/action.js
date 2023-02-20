import axios from "axios";

export const GET_ALL_DIETS = "GET_ALL_DIETS";
export const GET_ALL_RECIPES = "GET_ALL_RECIPES";
export const SEARCH_RECIPES = "GET_ALL_RECIPES";
export const GET_DETAIL_RECIPES = "GET_DETAIL_RECIPES";
export const CREATE_RECIPES = "CREATE_RECIPES";

export const getAllRecipes = (only,title)=>{
    return function (dispatch){
        let url = title !== undefined?`pi-food-main-production-14c2.up.railway.app/recipes?typeData=${only}&title=${title}`:
        `pi-food-main-production-14c2.up.railway.app/recipes?typeData=${only}`
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
        fetch(`pi-food-main-production-14c2.up.railway.app/recipes/${id}`)
        .then((response) => response.json())
        .then(dataD=>{
            console.log("desde el ACTION",dataD)
            dispatch({
                type: GET_DETAIL_RECIPES, payload: dataD
            })
        },(e)=>console.log(e))
    }
}


export function createRecipe(values){
    console.log("Desde el ACTIONS",values);
    return function(dispatch){
        return axios.post(`pi-food-main-production-14c2.up.railway.app/recipes`,values)
          .then((data) => { 
            console.log("Dispatch",dispatch)
         dispatch({
            type: CREATE_RECIPES, payload: data
         });
      },(e)=>console.log(e));
     };
}

export const getAllDiets = ()=>{
    return function (dispatch){
        return fetch(`pi-food-main-production-14c2.up.railway.app/diets`)
        .then((response) => response.json())
        .then(data=>{
            console.log(data);
            dispatch({
                type: GET_ALL_DIETS, payload: data
            })
        },(e)=>console.log(e))
    }
}