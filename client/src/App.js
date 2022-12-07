import { Route, Router } from 'react-router-dom';
import Recipes from "./component/Recipes"
import RecipeDetail from "./component/RecipeDetail"
import RecipeCreate from "./component/RecipeCreate"
import Home from './component/Home';
import NavBar from './component/NavBar'
import Error404 from './component/Error404'
import './global_styles.css'

function App() {
  return (
    <>
    <Route exact path={"/"} component={Home}/>
    <Route path={"/recipes"} component={NavBar}/>
    <Route exact path={"/recipes"} component={Recipes}/>
    <Route exact path={"/recipes/:id"} component={RecipeDetail}/>
    <Route exact path={"/create"} component={RecipeCreate}/>
    {/* <Route path={"*"} component={Error404}/> */}
    </>
  );
}

export default App;
