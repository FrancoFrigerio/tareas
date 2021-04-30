import React, { useState, useCallback } from 'react'
import {auth} from '../firebase'
import { withRouter } from 'react-router-dom'

const Reset_password = (props) => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [alert, setAlert] = useState(null)
    
    
    const procesarDatos=(e)=>{
        e.preventDefault()
        if(email == ''){
            setAlert('Debe introducir un correo electrónico')
            return
        }
        setEmail(null)
        recuperar()
       
    }
    
    const recuperar = useCallback(async()=>{
        try {
            await auth.sendPasswordResetEmail(email)
            console.log('Correo enviado')
            props.history.push('/login')
        } catch (error) {
            console.log(error)
            setAlert(error.message)
        }
        
    }, [email , props.history]
    )
    return (
        <div className="mt-5 ">
            <div className="container">
                <form onSubmit={procesarDatos} className="col-12 form-control bg-transparent border border-secondary d-flex flex-column align-items-center">
                    <h6 className="text-white">Debe introducir su correo electronico</h6>
                        <span className="text-danger form-text mt-4">{alert == null? null:alert}</span>
                         <input onChange={(e)=> setEmail(e.target.value)} className="col-12" type="email" name="email" id="email" placeholder="Correo"/>
                         <button className="btn btn-outline-success btn-sm mt-2">Reestablecer contraseña</button>
                </form>
            </div>
        </div>
    )
}

export default withRouter(Reset_password)
