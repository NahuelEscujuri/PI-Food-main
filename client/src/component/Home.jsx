import { Link } from "react-router-dom";

const Home = ()=>{
    return(
        <>
        <h3>Home</h3>
        <Link to={"/recipes"}>View Recipes</Link>
        </>
    )
}

export default Home;