import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as action from "../redux/action.js";
import RecipeCard from "./RecipeCard";
import MultiSelectTag from './selectTypes.js'
import './styles/form-style.css'

const Recipes = (props)=>{
    //#region URLs
    let query = new URLSearchParams(window.location.search)

    const addParamByQuery = (param,value)=>{

        let url = window.location.href.slice(window.location.href.indexOf(window.location.pathname));
        let newUrl="";

        //Remplase
        if(url.includes(param)){
            let end = url.slice(url.indexOf(param)+param.length+query.get(param).length+1)  
            let start = url.slice(0,url.indexOf(param));
            newUrl = start+param+"="+value+end;
            window.history.replaceState({}, '',`${newUrl}`);
            return;
        }
        //Add
        if(url.includes("?"))newUrl = "&"
        else newUrl = "?"

        newUrl = url + newUrl + param +"="+ value

        window.history.replaceState({}, '',`${newUrl}`);
    }
    
    const newParamByQuery = (param,value)=>{

        let url = window.location.href.slice(window.location.href.indexOf(window.location.pathname));
        let newUrl="";

        //Remplase
        if(url.includes(param)){
            let end = url.slice(url.indexOf(param)+param.length+query.get(param).length+1)  
            let start = url.slice(0,url.indexOf(param));
            newUrl = start+param+"="+value+end;
            return newUrl;
        }
        //Add
        if(url.includes("?"))newUrl = "&"
        else newUrl = "?"

        newUrl = url + newUrl + param +"="+ value

        return newUrl;
    }
    
    const equalQuery = (value)=>{
        if(value == query.get("typeData"))return true
        return false
    }
    //#endregion

    const [ currentRecipe, setCurrentRecipe] = useState([])
    const [ currentDiet, setCurrentDiet] = useState([])
    const [ currentPage, setCurrentPage] = useState(query.get("page")?+query.get("page"):1)
    const [ currentOrder, setCurrentOrder] = useState("Healthier")
    const [ currentDataType, setCurrentDataType] = useState(query.get("typeData")?query.get("typeData"):"all")
    const [ currentTitle, setCurrentTitle] = useState()
    
    let recipesPerPage = 9;
    let cantToPage = Math.ceil(currentRecipe.length / recipesPerPage);
    let maxRecipesPerPage = currentPage * recipesPerPage;
    let minRecipesPerPage = maxRecipesPerPage - recipesPerPage;

    const dispatch = useDispatch();
    const recipe = useSelector(state => state.recipes)
    let diets = useSelector(state => state.diets)

    //#region Diets Ref 
    const containerDietsSelect = useRef("containerDietsSelect")
    const dietsSelect = useRef("dietsSelect")
    //#endregion

    useEffect(()=>{
        console.log("useEffect",recipe.length,currentRecipe.length);
        
        if(recipe.length !== currentRecipe.length || currentRecipe.length == 0){
            console.log(currentDataType)
            dispatch(action.getAllRecipes(currentDataType,currentTitle))
            setCurrentRecipe(recipe)
            console.log("Ejecutable 7u7")
        }

        //Diets
        console.log("diets.value:",diets)
        diets=[];
        if(diets.length == 0)dispatch(action.getAllDiets()).then(e=>{
            try{
                console.log("LENGTH",Object.keys(containerDietsSelect.current).length)
                setCurrentDiet(new MultiSelectTag(dietsSelect.current))
                
                console.log("MultiSelectTag",currentDiet);
                console.log("Childs",containerDietsSelect.current.childNodes[2]);
                containerDietsSelect.current.removeChild(containerDietsSelect.current.childNodes[2])
    
                console.log(Object.keys(containerDietsSelect.current));
            }catch(e){
                console.log("message:",e)
            }
        })
    },[]);

    //#region Search Bar
    const handleInputChange = ({target})=>{
        setCurrentTitle(target.value)
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        dispatch(action.getAllRecipes("api",currentTitle))
        addParamByQuery("page",1)
        setCurrentPage(1)
        console.log(currentTitle)
    }
    //#endregion
    
    //#region Pagination
    const orderchange = e =>{
        //le cambia el valor al orden actual
        if(currentOrder!==e.target.value)setCurrentOrder(e.target.value) 
    }

    const pagingOfRecipes = ()=>{
        //Order
        switch(currentOrder){
            case "A - Z":{
                recipe.sort((a, b)=>{
                    if ( a.title.toLowerCase() < b.title.toLowerCase())return -1
                    if ( a.title.toLowerCase() > b.title.toLowerCase())return 1
                    return 0;
                  })
                break
            }

            case "Z - A":
                recipe.sort((a, b)=>{
                   if ( a.title.toLowerCase() < b.title.toLowerCase())return 1
                   if ( a.title.toLowerCase() > b.title.toLowerCase())return -1
                   return 0;
                 })
                break

            case "Healthier":{
                recipe.sort((a, b) => {return b.healthScore - a.healthScore;});
                break
            }

            case "Less Healthier":{
                recipe.sort((a, b) => {return a.healthScore - b.healthScore;});
                break
            }
            default:
                break
        }

        //Filter
        if(currentDiet.length > 0){
        }

        return recipe.slice(minRecipesPerPage ,maxRecipesPerPage);
    }

    let newRecipe = pagingOfRecipes().filter(r=>{
        let result = false;
        for(let diet of currentDiet){
            if(r.diets.indexOf(diet.toLowerCase()) !== -1){
                result = true
                break;
            }result = false
        }
        console.log("RESULTS",result)
        return result;
    })
    const handleConsle = ({target})=>{
        console.log("Console",target.value)
    }
    // const handleDiet = (e)=>{
    //     e.preventDefault();
    //     setCurrentDiet(currentDiet);
    // } 
    // useEffect(()=>{
    //     console.log("newRecipe",newRecipe)
    // },[currentDiet])

    const prevPag = () =>{
        if(currentPage > 1){
            window.scrollTo(0, 0);
            addParamByQuery("page",+currentPage-1)
            setCurrentPage(+currentPage-1)
        }
    }

    const nextPag = ()=>{
        if(maxRecipesPerPage <= recipe.length){
            window.scrollTo(0, 0);
            addParamByQuery("page",+currentPage+1)
            setCurrentPage(+currentPage+1)
            console.log("Diets",currentDiet)
        }
    };

    const DataTypechange = (e)=>{
        if(e.target.value === "all")addParamByQuery(`typeData`,"all");
        else addParamByQuery(`typeData`,e.target.value);

        if(currentDataType !== e.target.value)window.location.reload(false)
    }
    //#endregion
    
    return(
        <>
        <h1>Foods</h1>

        {/* Pagination Button  */}
        <form>
            <div className={`container-btn`}>
            <ul className="container-btn_pagination">
                <li className={`prev ${minRecipesPerPage > 0?null:"notHover"}`} onClick={prevPag}>
                    Prev
                    </li>
                <li className={`next ${maxRecipesPerPage < pagingOfRecipes().length?null:"notHover"}`} onClick={nextPag}>
                    Next
                    </li>
            </ul>
            </div>
        </form>

            {/* Search Bar */}
            <div>
                <form onSubmit={handleSubmit}>
                 <input type={"text"} onChange={handleInputChange}/>
                 <button type="submit">Search</button>
                </form>
            </div>

            {/* Filters */}
            <div className="container-dietsSelect" id="containerDietsSelect" ref={containerDietsSelect}>
                        {diets.length!==0?(
                        <select name="diets" id="dietsSelect" ref={dietsSelect} multiple onChange={handleConsle}>{diets?
                            diets.map(t=>(
                            <option value={t.name}>{t.name}</option>
                            ))
                            :undefined}
                        </select>):undefined}
                        </div>
            
            {/* Order */}
            <select name="select" onChange={DataTypechange}>
                <option value ="all" selected={equalQuery("all")?"selected":null}>
                    All</option>
                <option value ="db" selected={equalQuery("db")?"selected":null}>
                    Data Base</option>
                <option value ="api" selected={equalQuery("api")?"selected":null}>
                    Api</option>
            </select>
            
            <select name="select" onChange={orderchange}>
                <option value ="A - Z">A - Z</option>
                <option value ="Z - A">Z - A</option>
                <option value ="Healthier">Healthier</option>
                <option value ="Less Healthier">Less Healthier</option>
            </select>

            {/* Recipes */}
        <ul>
            {recipe &&
            pagingOfRecipes().map(p=>(p?<RecipeCard
            id={p.id}
            title={p.title}
            diets={p.diets}
            img={p.img}/>:undefined))}
        </ul>
        </>
    )
}

export default Recipes;