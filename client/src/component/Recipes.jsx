import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as action from "../redux/action.js";
import RecipeCard from "./RecipeCard";
import MultiSelectTag from './selectTypes.js'
import Select from 'react-select'
import './styles/form-style.css'
import './styles/pagination-style.css'

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
    // const [ currentRecipePage, setCurrentRecipePage] = useState()
    
    let recipesPerPage = 9;
    let cantToPage = Math.ceil(currentRecipe.length / recipesPerPage);
    let maxRecipesPerPage = currentPage * recipesPerPage;
    let minRecipesPerPage = maxRecipesPerPage - recipesPerPage;

    const dispatch = useDispatch();
    let recipe = useSelector(state => state.recipes)
    let totalRecipe = currentRecipe.length === 0?recipe:currentRecipe;
    let RecipePage = totalRecipe.slice(minRecipesPerPage ,maxRecipesPerPage);
    let diets = useSelector(state => state.diets)

    //#region Current Page
    useEffect(()=>{
        if(currentPage !== +query.get("page")){
            addParamByQuery("page",currentPage)
        }
        // if(+query.get("page")>cantToPage ||
        //  +query.get("page")< 0){console.log()}//setCurrentPage(1)
    },[currentPage])
    //#endregion

    //#region Diets Ref 
    const containerDietsSelect = useRef("containerDietsSelect")
    const dietsSelect = useRef("dietsSelect")
    //#endregion

    useEffect(()=>{
        console.log("useEffect",recipe.length,currentRecipe.length);
        setCurrentRecipe([])
        
        if(recipe.length !== currentRecipe.length || recipe.length == 0){
            console.log(currentDataType)
            dispatch(action.getAllRecipes(currentDataType,currentTitle))
            setCurrentRecipe(recipe)
            console.log("Ejecutable 7u7")
        }

        //Diets
        console.log("diets.value:",diets)
        if(diets?.length === 0){
            dispatch(action.getAllDiets())
        }
    },[]);

    //#region Search Bar
    const handleInputChange = ({target})=>{
        setCurrentTitle(target.value)
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        dispatch(action.getAllRecipes("e",currentTitle))
        addParamByQuery("page",1)
        setCurrentPage(1)
        console.log(currentTitle)
    }
    //#endregion
    
    //#region Pagination
    const orderchange = e =>{
        //le cambia el valor al orden actual
        addParamByQuery("page",1)
        if(currentOrder!==e.target.value)setCurrentOrder(e.target.value) 
    }

    const pagingOfRecipes = ()=>{
        //Order
        console.log("LENGTH",currentRecipe.length)
        switch(currentOrder){
            case "A - Z":{
                totalRecipe.sort((a, b)=>{
                    if ( a.title.toLowerCase() < b.title.toLowerCase())return -1
                    if ( a.title.toLowerCase() > b.title.toLowerCase())return 1
                    return 0;
                  })
                break
            }

            case "Z - A":
                totalRecipe.sort((a, b)=>{
                   if ( a.title.toLowerCase() < b.title.toLowerCase())return 1
                   if ( a.title.toLowerCase() > b.title.toLowerCase())return -1
                   return 0;
                 })
                break

            case "Healthier":{
                totalRecipe.sort((a, b) => {return b.healthScore - a.healthScore;});
                break
            }

            case "Less Healthier":{
                totalRecipe.sort((a, b) => {return a.healthScore - b.healthScore;});
                break
            }
            default:
                break
        }

        return totalRecipe.slice(minRecipesPerPage ,maxRecipesPerPage);
    }

    const prevPag = () =>{
        if(currentPage > 1){
            addParamByQuery("page",+currentPage-1)
            setCurrentPage(+currentPage-1)
        }
    }

    const nextPag = ()=>{
        if(maxRecipesPerPage <= totalRecipe.length){
            addParamByQuery("page",+currentPage+1)
            setCurrentPage(+currentPage+1)
            console.log("Diets",currentDiet)
        }
    };
    
    useEffect(()=>{
        console.log("ACTUALIZATESS")
        window.scrollTo(0, 0);
    },[pagingOfRecipes()])

    const DataTypechange = (e)=>{
        if(e.target.value === "all")addParamByQuery(`typeData`,"all");
        else addParamByQuery(`typeData`,e.target.value);
        addParamByQuery("page",1)
        if(currentDataType !== e.target.value)window.location.reload(false)
    }
    //#endregion
    
    //#region Filter
    const handleSelect = (e)=>{
        let newDiet = e.map(op=>{
            return op.value
        })
        
        setCurrentDiet(newDiet)
        let newRecipe = recipe.filter(r=>{
                let result = false;
                for(let diet of newDiet){
                    if(r.diets.indexOf(diet.toLowerCase()) !== -1){
                        console.log("recipe",r)
                        result = true
                        break;
                    }result = false
                }
                console.log("Result",result)
                return result;
        })

        console.log("newRecipe",newRecipe)
        setCurrentRecipe(newRecipe)
        // console.log("totalRecipe",currentRecipe)
        
    }

    useEffect(()=>{
        console.log("RECIPE",currentRecipe)
        setCurrentPage(1)
    },[currentRecipe])
    
    const selectDiets = ()=>{
        let result = diets.map(e=>{
            let newdiet = {value:[e][0].name, label:[e][0].name};
            return newdiet
        });
        console.log(result)
        return result
    }
    //#endregion

    return(
        <>
        <div className="recipes-container">
        
        {/* Search Bar */}
        <div className={`input-container`}>
            <form className="input-box" onSubmit={handleSubmit}>
             <input type={"text"} className="input" onChange={handleInputChange}/>
             <button type="submit">Search</button>
            </form>
        </div>
            
        {/* Filters */}
        <div className={`select-container ${recipe.length == 0&&"desactive"}`}>
        <Select 
        isMulti 
        options={selectDiets()} 
        onChange={handleSelect}
        className="react-select-container"
        classNamePrefix="react-select"
        ></Select>
        </div>
        
        {/* Order */}
        <div className={`select-container ${recipe.length == 0&&"desactive"}`}>
        
        <select className="select" name="select" onChange={DataTypechange}>
            <option value ="all" selected={equalQuery("all")?"selected":null}>
                All</option>
            <option value ="db" selected={equalQuery("db")?"selected":null}>
                Data Base</option>
            <option value ="api" selected={equalQuery("api")?"selected":null}>
                Api</option>
        </select>
        
        <select className="select" name="select" onChange={orderchange}>
            <option value ="A - Z">A - Z</option>
            <option value ="Z - A">Z - A</option>
            <option value ="Healthier">Healthier</option>
            <option value ="Less Healthier">Less Healthier</option>
        </select>
        </div>

        {/* Recipes */}
    <div className="container-cards">
        {recipe &&
        pagingOfRecipes().map(p=>(p?<RecipeCard
        id={p.id}
        title={p.title}
        diets={p.diets}
        img={p.img}/>:undefined))}
    </div>

    
    {/* Pagination Button  */}
    <form className={`${recipe.length == 0&&"desactive"}`}>
        <div className={`container-btn`}>
        <ul className="container-btn_pagination">
            <li className={`prev ${minRecipesPerPage > 0?null:"notHover"}`} onClick={prevPag}>
                <span></span>
                </li>
            <li className={`next ${maxRecipesPerPage < pagingOfRecipes().length?null:"notHover"}`} onClick={nextPag}>
                <span></span>
                </li>
        </ul>
        </div>
    </form>
        </div>
        </>
    )
}

export default Recipes;