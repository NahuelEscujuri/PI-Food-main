import { GET_ALL_RECIPES,GET_ALL_DIETS, GET_DETAIL_RECIPES, CREATE_RECIPES } from "./action";

const initialState ={
    recipes:[],
    recipeDetail:[],
    diets:[]
}

export default function rootReducer(state = initialState, actions){
    switch(actions.type){        
        case CREATE_RECIPES:{
            return {
                ...state,
                recipes:[...state.recipes, actions.payload]
            }
        }
        case GET_ALL_RECIPES:{
            return {
                ...state,
                recipes:actions.payload
            }
        }
        case GET_DETAIL_RECIPES:{
            state.recipeDetail=[] 
            return {
                ...state,
                recipeDetail: actions.payload
            }
        }
        case GET_ALL_DIETS:{
            return {
                ...state,
                diets: actions.payload
            }
        }
        default:{
            return {...state}
        }
    }
}