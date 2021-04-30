import React from 'react'
import {Link , NavLink, withRouter} from 'react-router-dom'
import {auth} from '../firebase'



const Navbar = (props) => {
    
    const cerrarSession =()=>{
       auth.signOut()
            .then(()=>{
                props.history.push('/login')
            })
    }
    return (
        <div className="navbar navbar-dark bg-dark mt-2">
            <Link className="navbar-brand text-secondary mx-5" to="/">GERIO</Link>
           <div>
               <div className="d-flex">
                    <NavLink to="/" className="btn btn-dark mx-1 btn-sm">
                        Inicio
                    </NavLink>
                    {
                        props.firebaseUser == null? null:(
                            <NavLink to="/admin" className="btn btn-dark mx-1 btn-sm">
                                Admin
                            </NavLink>
                        )
                    }
                    {
                        props.firebaseUser !== null?(<button onClick={()=>cerrarSession()} className="btn btn-outline-danger btn-sm mr-10">Cerrarr Sesion</button>):
                    (<NavLink to="/login" className="btn btn-dark mx-1 btn-sm">
                        Login
                    </NavLink>)
                    }

               </div>
           </div>
        </div>
    )
}

export default withRouter(Navbar);


