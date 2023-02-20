const { Router } = require('express');
const { Op } = require('sequelize');
const { Recipe, Diet } = require('../db');
const axios = require('axios');
const { API_KEY } = process.env;
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();


//Cleasrs
const clearRecipesApi = async(r)=>{
    let result = await r.map(e => {
        let allSteps = e.analyzedInstructions[0]?.steps.map(s=>{
            return s.step;
        })
        return {
            id:e.id,
            title:e.title,
            healthScore:e.healthScore,
            summary:e.summary,
            steps: allSteps,
            diets:e.diets,
            img:e.image
        };
    });
    return result;
}
const clearRecipesDb = async(r)=>{
    console.log("Clear recive",r)
    let result = 
    await r.map(async e=>{
        let newDiet = [];
        const diet = await e.getDiets({ attributes: ['name']})
        await diet.map(d=> newDiet.push(d.dataValues.name))

        let newRecipe={...e.dataValues,diets:newDiet};
        console.log("New Recipe",newRecipe)
        return await newRecipe
    })
    console.log("Debuelve",await result)
    return await Promise.all(result).then(f=>{
        try{
        return f 
    }catch(e){console.log(e)}})
}

//Gets
const allRecipesApi = async (title)=>{
    const result = await axios.get("https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5")
    .then(async r=>{
        let recipesApi = r.data.results;
        // if(title) recipesApi = await r.data.results.filter(e=>e.title.includes(title))
        if(title !== undefined) recipesApi = await r.data.results.filter(e=>e.title.toLowerCase().includes(title.toLowerCase()))
        return await clearRecipesApi(recipesApi);
    });
    return await result
}
const allRecipesDb = async (title)=>{
    let result = await Recipe.findAll(title !== undefined?{
        where:{
            title:{
                [Op.like]:'%'+title.toLowerCase()+'%'
            }
        }
    }:undefined)
    .then(async r=>{
        try{
            return await clearRecipesDb(await r);
        }
        catch(e){
            console.log("menssage:",e)
        }        
    });

    return await result
}
const allRecipesTotal = async (title)=>{
    try{
        let result=[
            ...await allRecipesApi(title).then(r=>{return r},e=>{return undefined}),
            ...await allRecipesDb(title).then(r=>{return r},e=>{return undefined})];
        
            return result;
    }
    catch(e){
        console.log("menssage:",e);
    }
} 

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/recipes",async (req,res,next)=>{
    
    const { title, typeData }= req.query;
    try {
        switch(typeData){
            case "db":{                
                res.send(await allRecipesDb(title));
            }
            case "api":{
                res.send(await allRecipesApi(title));
            }
            default:{
                res.send(await allRecipesTotal(title));
            }
        }
    }
    catch(e){next(e);}
})

router.get("/recipes/:id",async (req,res,next)=>{
    try{
        const id = req.params.id;
        console.log("ID",id);

        const recipesDb = await Recipe.findAll({
            where:{
                id:id
            }
        }).then(async r=>{console.log("find all",r);return await clearRecipesDb(r)},()=>{return false})

        // let apiKey = API_KEY.slice(1,API_KEY.length-1);
        // let apiUrl = "https://api.spoonacular.com/recipes/"+id+"/information?apiKey="+apiKey;
        
        if(recipesDb)res.send(recipesDb)
        //Uso con la Api original
        // else await axios({method:'get',
        // url:apiUrl,
        // headers:{"Accept-Encoding":"null"}})
        // .then(async r=>{res.send(await clearRecipesApi([r.data]))},(e)=>next(e))

        else{
            let recipesApi = await allRecipesApi();
            recipesApi = await recipesApi.filter(r=>r.id == id)
            console.log(recipesApi)
            res.send(await recipesApi);
        }
    }
    catch(e){
        next();
    }
})

router.post("/recipes",async (req,res,next)=>{

    try{
        const {title, healthScore,summary,steps,img,diets} = req.body
        console.log("STEPS",steps)
        const newRecipe =await Recipe.create({title,healthScore,summary,steps:steps,img})
        const newDiet = await Diet.findAll({
            where:{
                name:{
                    [Op.or]:diets
                }
            }
        })
        await newRecipe.setDiets(newDiet);
        const diet = await newRecipe.getDiets({ attributes: ['name']})

        res.send({...newRecipe,diets:diet});
    }
    catch(e){
        next();
    }
})

router.get("/diets",async (req,res,next)=>{
    try{
        let diets = await Diet.findAll({attributes:['id','name']});
        res.send(diets);
    }
    catch(e){
        next();
    }
})

module.exports = router;
