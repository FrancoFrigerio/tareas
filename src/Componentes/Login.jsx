import React, { useCallback, useState } from 'react'
import {Redirect, withRouter} from 'react-router-dom'
import { auth , db} from '../firebase'
 

 const Login = (props) => {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [alert, setAlert] = useState(null)
    const [esRegistro, setEsRegistro] = useState(false)
    

   
    
    const procesarDatos =(e)=>{
        e.preventDefault();
        if(!email.trim()){
            setAlert('Tiene que ingresar una cuenta de correo')
            return
        }
        if(!pass.trim() || pass.length < 6){
            setAlert('La contraseña debe tener al menos 6 caracteres')
            return
        }
        setAlert(null)

        if(esRegistro){
            registrar();
        }else{
            login();
        }
    }
    const login = useCallback(async()=>{
        try {
            const res = await auth.signInWithEmailAndPassword(email,pass)
           
            console.log(res.user)
                setPass('')
                setEmail('')
                setAlert(null)
                props.history.push('/admin')
        } catch (error) {
            console.log(error)
            switch (error.code) {
                case 'auth/user-not-found':
                    setAlert(`No existe usuario con cuenta ${email}`)
                    break;
                case 'auth/wrong-password':
                    setAlert('Contraseña incorrecta')
                    break;
                case 'auth/user-disabled':
                    setAlert('Usuario inhabilitado')
                    break;

                default:
                    break;
            }
        }
    },[email, pass, props.history.push])

    const registrar = useCallback(async() => {
            try {
              const res = await auth.createUserWithEmailAndPassword(email,pass)  
                console.log(res.user)
                await db.collection('usuarios').doc(res.user.email).set({
                    email: res.user.email,
                    uid: res.user.uid
                })
                await db.collection(res.user.uid).add({
                    name:'tarea de ejemplo',
                    fecha: Date.now()
                })
                setPass('')
                setEmail('')
                setAlert(null)
                props.history.push('/admin')
            } catch (error) {
                console.log(error)

                switch (error.code) {
                    case 'auth/invalid-email':
                        setAlert('Email no válido')
                        break;
                    case 'auth/email-already-in-use':
                        setAlert('Email ya registrado')
                        break;
                
                    default:
                        break;
                }
            }
        },[email , pass, props.history.push])
    
    return (
        
        <div className="mt-5 ">
                <h3 className="text-center texto-primario">{esRegistro?'Registro de usuario':'Login'}</h3>
               <hr/>
                <div className="row d-flex justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                        <form className="form-control mt-2 bg-transparent border-secondary" onSubmit={procesarDatos}>
                            <div className="pt-2">
                                {
                                    alert !== null? <h6 className="text-secondary alert alert-warning">{alert}</h6>: <h5></h5>
                                }
                                <input type="email" name="user_email" id="user" className="form-control mt-2" placeholder="Correo"
                                onChange={(e)=>setEmail(e.target.value)} value={email}/>
                                <input type="password" name="password" id="pass" className="form-control mt-2" placeholder="Contraseña"
                                 onChange={(e)=>setPass(e.target.value)} value={pass}/>
                                {
                                    esRegistro?<input type="tel" name="tel" id="tel" className="form-control mt-2" placeholder="Telefono"/>:
                                    null
                                }
                                
                            </div>
                            <div className="d-flex flex-column ">
                                <button className="btn btn-dark mt-3 w-80" type="submit">{esRegistro?'Registrar':'Ingresar'}</button>
                                <button className="btn btn-info btn-sm btn-block mt-2" type="button" onClick={()=>setEsRegistro(!esRegistro)}>
                                    {
                                        esRegistro?'¿Ya tenés cuenta?...Ingresá!':'¿No tenés cuenta?'
                                    }
                                    </button>
                            </div>
                            <div className="d-flex justify-content-end">
                                {
                                    esRegistro?null:<button onClick={()=> props.history.push('reset_password')} className="btn btn-sm mt-2 text-danger">
                                        {
                                            alert=='Contraseña incorrecta'?'Recuperar Contraseña':null
                                        }
                                        </button>
                                }
                            </div>
                        </form>
                        
                    </div>
                </div>
        </div>
       
        
    )
}
export default withRouter(Login);
