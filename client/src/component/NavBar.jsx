import { Link } from "react-router-dom";
import './styles/navbar-style.css'


export default function NavBar(){

    return(
        <div>
            <header>
		{/* <!-- Nav --> */}
		<div className="nav container">
			{/* <!-- Logo --> */}
            <Link className="logo" to={"/recipes"}>
				Henry<span className='span1'>Food</span>
				</Link>
			{/* <!-- Nav Icons -->			 */}
			<div className="nav-icons">
				<Link to={"/create"} className="btn bx-ball" id="bell-icon">Create</Link>
			</div>
		</div>
        	</header>
        </div>
    )

}