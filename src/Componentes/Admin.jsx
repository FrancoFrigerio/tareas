import React, { useEffect, useState } from 'react'
import {auth} from '../firebase'
import { withRouter } from 'react-router-dom'
import Firestore from './Firestore'


const Admin = (props) => {
    
    const [user, setUser] = useState(null)
    const [uid, setUid] = useState(null)
    useEffect(() => {
        if (auth.currentUser) {
           setUser(auth.currentUser)
           setUid(auth.currentUser.uid)
            console.log('existe el usuario')
        }else{
           props.history.push('/login') 
        }
        
    }, [props.history]) //los [] son para que se ejecute solo una vez
    
    return (
        <div className="container-fluid">
           
            <p className="alert-success text-center">Usuario {user == null ? ' ' : user.email}</p>
            <Firestore user={user} uid={uid}></Firestore>
        </div>
    )
}


export default withRouter(Admin);
