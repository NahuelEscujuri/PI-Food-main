import { Link } from "react-router-dom";
import "./styles/home-style.css";

const Home = ()=>{
    return(
        <>
        <section class="home container" id="home">
        <img src="https://foodandtravel.mx/wp-content/uploads/2020/08/Estilismo-de-comida-Punto-3.jpg"/>
        <div class="home-text">
            <h1>DISCOVER NEWS <br/> RECIPES</h1>
            <Link class="btn" to={"/recipes"}>Start Now</Link>
        </div>
        </section>
        </>
    )
}

export default Home;