import React, { useEffect, useRef,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../redux/action.js";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import MultiSelectTag from './selectTypes.js'
import Select from 'react-select'


const CreateRecipe = ()=>{
    const [currentDiets, setCurrentDiets] = useState([]); 
    const [currentSteps, setCurrentSteps] = useState([""]); 
    //AGREGAR DIETAS
    const [valid,setValid] = useState({title:true,healthScore:true,img:true,summary:true,steps:true,diets:true})
    let [input,setInput]= React.useState({
        title:"",
        healthScore:"",
        img:"",
        summary:"",
        diets:[],
        steps:[]
    })

    const dispatch = useDispatch();
    let diets = useSelector(store => store.diets)
    let history = useHistory();

    //#region Handle
    function handleChange(e){
        //#region healthScore controlate
        if(e.target.name === "healthScore" && e.target.value < 0||
           e.target.name === "healthScore" && isNaN(+e.target.value))e.target.value = 0;
        if(e.target.name === "healthScore" && e.target.value > 100)e.target.value = 100;
        //#endregion

        setInput((prev)=>({...prev,[e.target.name]:e.target.value}))
    }

    function validation(){
        let newValid={};
        let validKeys = Object.keys(valid)
        let totalValid = validKeys.map(r=>{
            if(input[r].length > 0){
                newValid = {...newValid,[r]:true}
                return r = true
            }else{
                newValid = {...newValid,[r]:false}
                return r = false
            }
        })
        setValid(newValid);

        console.log("current valid",valid)
        return totalValid.every(r=>r===true)
    }

    async function handleSubmit(e){
        e.preventDefault();
        console.log("Submit",input);

        //antes de enviarlo hay que comprobar que todas las propiedades cumplen los requisitos
        //(osea que son true) de lo contrario mostrar que propiedades no cumplen los requisitos
        //(cuales estan en false)
        if(validation() === false)return;

        dispatch(actions.createRecipe(input)).then(()=>{
            history.push(`/recipes?typeData=db`);
        });
        setInput({title:"",healthScore:"",summary:"",steps:[""],img:""})
    }
    //#endregion

    //#region Steps 
    function indexSteps(){
        let newSteps = [];
        for(let i = 0;i < currentSteps.length; i++){
            newSteps.push(i)
        }
         return newSteps
    }
    function handleChangeSteps(e, index){
        let newSteps = currentSteps.slice(0,index)
        newSteps = [...newSteps,e.target.value,...currentSteps.slice(index+1,currentSteps.length)]
        // console.log("newSteps",newSteps)
        // console.log(e.target.value)
        setCurrentSteps(newSteps)
        setInput((prev)=>({...prev,steps:newSteps}))
        console.log("newSteps",input.steps);
    }
    function addStep(){
        let newSteps = [...currentSteps,""];
        setCurrentSteps(newSteps);
    }
    function removeStep(){
        if(currentSteps.length <= 1)return;
        let newSteps = currentSteps.slice(0,currentSteps.length - 1)
        setCurrentSteps(newSteps)
    }
    //#endregion
    
    //#region Refs
    const containerDietsSelect = useRef("containerDietsSelect")
    const dietsSelect = useRef("dietsSelect")
    let tagdiets;
    //#endregion

    useEffect(() =>{
        diets=[];
        if(diets.length == 0)dispatch(actions.getAllDiets())
        }, [] )

    //#region Select
        const handleSelect = (e)=>{
            let newDiet = e.map(op=>{
                return op.value
            })
            
            setInput((prev)=>({...prev,diets:newDiet}))
            setCurrentDiets(newDiet) 

            console.log(input.diets);           
        }

        const selectDiets = ()=>{
            let result = diets.map(e=>{
                let newdiet = {value:[e][0].name, label:[e][0].name};
                return newdiet
            });
            return result
        }
        //#endregion

    return(
        <>
        <div className="marginTop">
        <div className="center">
            <h1>Create Recipe</h1>
            <form onSubmit={e=>handleSubmit(e)}>
                {/* Title */}
                <div className="txt_field">
                        <input type="text"  name={"title"} value={input.title}
                         onChange={(e)=>handleChange(e)}/>
                         <span></span>
                         <label>Title</label>
                         <p className={`${valid.title?"desactive":""} error`}>*Title is required</p>
                </div>
                {/* Health Score */}
                <div className="txt_field">
                         <input 
                         type="text"
                         name={"healthScore"}
                         value={input.healthScore}
                         autoComplete="off"
                         onChange={(e)=>handleChange(e)}/>
                         <span></span>
                         <label>Health Score</label>
                         <p className={`${valid.healthScore?"desactive":""} error`}>*Health Score is required</p>
                </div>
                {/* Imagen */}
                <div className="txt_field">
                        <input
                         type="text"
                         name={"img"}
                         value={input.img}
                         autoComplete="off"
                         onChange={(e)=>handleChange(e)}
                         />
                         <span></span>
                         <label>Imagen</label>
                         <p className={`${valid.img?"desactive":""} error`}>*Imagen is required</p>
                </div>
                {/* Summary */}
                <div className="txt_field">
                        <input type="text"  name={"summary"} value={input.summary}
                         onChange={(e)=>handleChange(e)}/>
                         <span></span>
                         <label>Summary</label>
                         <p className={`${valid.summary?"desactive":""} error`}>*Summary is required</p>
                </div>    
                {/* Diets*/}
                <div className="txt_field">
                   <label className="title">Diets</label>
                         <Select isMulti options={selectDiets()} onChange={handleSelect}></Select>
                         <p className={`${valid.diets?"desactive":""} error`}>*Diets is required</p>
                </div>
                {/* Steps */}
                <div>
                   <label className="title">Steps</label>
                    {currentSteps.length > 0 &&
                    indexSteps().map(s=>(
                            <div className="txt_field">
                                <textarea type="text"  name={currentSteps[s]} value={currentSteps[s]}
                                onChange={(e)=>handleChangeSteps(e,s)}/>
                                <span></span>
                                <label>Step {s+1}</label>
                            </div>
                         ))
                }
                <p className={`${valid.steps?"desactive":""} error`}>*Step is required</p>

                <ul className="btn-container">
                     <li onClick={addStep} className="btn-submit blue">Add Step</li>
                     <li onClick={removeStep} className="btn-submit red">Remove Step</li>
                </ul>
                    </div>


                <input type="submit" value="CREATE" className="btn-submit"/>
            </form>
        </div>
        </div>
        </>
    )
}

export default CreateRecipe;