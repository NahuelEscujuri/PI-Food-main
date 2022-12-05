import React, { useEffect, useRef,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../redux/action.js";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import MultiSelectTag from './selectTypes.js'

const CreateRecipe = ()=>{
    const [currentTitle, setCurrentTitle] = useState("pedro");
    const [currentDiets, setCurrentDiets] = useState([]); 
    const [currentSteps, setCurrentSteps] = useState([""]); 
    //AGREGAR DIETAS
    const [valid,setValid] = useState({title:true,healthScore:true,img:true,summary:true,steps:true})
    let [input,setInput]= React.useState({
        title:"title",
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
            history.push(`/recipes?typeData=db`)
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

        // if(tagdiets == null){
        //     console.log("input.diets == null", input.diets == null)
           
        // }

        // console.log("diets.value:",diets)

        diets=[];
        if(diets.length == 0)dispatch(actions.getAllDiets()).then(e=>{
            try{
                //Multi Tag
                // console.log("LENGTH",Object.keys(containerDietsSelect.current).length)
                // setCurrentDiets(new MultiSelectTag(dietsSelect.current));
                // console.log(mul);
                setInput((prev)=>({...prev,diets:["gluten free"]}))
                console.log("Diets")
                // console.log("MultiSelectTag",input.diets);
                // console.log("Childs",containerDietsSelect.current.childNodes[2]);
                containerDietsSelect.current.removeChild(containerDietsSelect.current.childNodes[2])
    
                // console.log(Object.keys(containerDietsSelect.current));
            }catch(e){
                console.log("Current Diets",currentDiets)
                console.log("message:",e)
            }
        })
        }, [] )

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
                         <p className={`${valid.title?"desactive":""}`}>*This field is required</p>
                </div>
                {/* Health Score */}
                <div className="txt_field">
                         <input type="number"  name={"healthScore"} value={input.healthScore}
                         onChange={(e)=>handleChange(e)}/>
                         <span></span>
                         <label>Health Score</label>
                         <p className={`${valid.healthScore?"desactive":""}`}>*This field is required</p>
                </div>
                {/* Imagen */}
                <div className="txt_field">
                        <input type="text"  name={"img"} value={input.img}
                         onChange={(e)=>handleChange(e)}/>
                         <span></span>
                         <label>Imagen</label>
                         <p className={`${valid.img?"desactive":""}`}>*This field is required</p>
                </div>
                {/* Summary */}
                <div className="txt_field">
                        <input type="text"  name={"summary"} value={input.summary}
                         onChange={(e)=>handleChange(e)}/>
                         <span></span>
                         <label>Summary</label>
                         <p className={`${valid.summary?"desactive":""}`}>*This field is required</p>
                </div>    
                {/* Diets*/}
                <div className="container-dietsSelect" id="containerDietsSelect" ref={containerDietsSelect}>
                        {diets.length!==0?(
                        <select name="diets" id="dietsSelect" ref={dietsSelect} multiple onChange={(e)=>console.log(e.target.value)}>{diets?
                            diets.map(t=>(
                            <option value={t.name}>{t.name}</option>
                            ))
                            :undefined}
                        </select>):undefined}
                        </div>
                {/* Steps */}
                <div>
                   <label>Steps</label>
                    {currentSteps.length > 0 &&
                    indexSteps().map(s=>(
                            <div>
                                <input type="text"  name={currentSteps[s]} value={currentSteps[s]}
                                onChange={(e)=>handleChangeSteps(e,s)}/>
                             <label>Step {s+1}</label>
                            </div>
                         ))
                }
                <p className={`${valid.steps?"desactive":""}`}>*This field is required</p>

                     <button onClick={addStep}>Add Step</button>
                     <button onClick={removeStep}>Remove Step</button>
                    </div>


                <input type="submit" value="CREATE" className="btn-submit"/>
            </form>
        </div>
        </div>
        </>
    )
}

export default CreateRecipe;