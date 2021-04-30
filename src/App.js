import React, { useEffect, useState } from 'react'
import {BrowserRouter as Router , Switch, Route} from 'react-router-dom'
import Admin from './Componentes/Admin';
import Inicio from './Componentes/Inicio';
import Login from './Componentes/Login';
import Navbar from './Componentes/Navbar';
import Reset_password from './Componentes/Reset_password';
import {auth} from './firebase'



function App() {
 const [firebaseUser, setFirebaseUser] = useState(false)
  
 useEffect(() => {
   auth.onAuthStateChanged(user =>{
    //con esta funcion controla si existe un usuario registrado, si lo hay lo pinta por consola  
    if (user !== null) {
       setFirebaseUser(user)
     } else {
       setFirebaseUser(null)
     }
   })
   
 }, [])
  return firebaseUser !== false ?(
    <Router>
      <div className="container-fluid">
         <Navbar firebaseUser={firebaseUser}/>
           <Switch>
             <Route path='/nosotros' exact>
               Nosotros
             </Route>
             <Route path='/reset_password' exact>
               <Reset_password></Reset_password>
             </Route>
             <Route path='/admin' exact>
               <Admin/>
             </Route>
             <Route path='/login' exact>
               <Login></Login>
             </Route>
             <Route path='/' exact>
               <Inicio></Inicio>
             </Route>
           </Switch>
      </div>
    </Router>      

  ):<p>Cargando...</p>;
}

export default App;
