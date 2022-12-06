import { Route, Router } from 'react-router-dom';
import Recipes from "./component/Recipes"
import RecipeDetail from "./component/RecipeDetail"
import RecipeCreate from "./component/RecipeCreate"
import './global_styles.css'
import Home from './component/Home';

function App() {
  return (
    <>
    <Route exact path={"/"} component={Home}/>
    <Route exact path={"/recipes"} component={Recipes}/>
    <Route exact path={"/recipes/:id"} component={RecipeDetail}/>
    <Route exact path={"/create"} component={RecipeCreate}/>
    </>
  );
}

export default App;
