import React, { useEffect, useState } from 'react'
import {db} from '../firebase'

import moment from 'moment'
import 'moment/locale/es'

const Firestore = (props) => {
    const [noti, setNoti] = useState({stado:false,message:''})
    const [datos, setDatos] = useState([])
    const [tarea, setTarea] = useState({nombre:'',fecha:''})
    const [id, setId] = useState('')
    const [modoEdicion, setModoEdicion] = useState(false)
    const [datosTotales, setDatosTotales] = useState(null)
    const [last, setLast] = useState(null)
    const [desactivado, setDesactivado] = useState(false)
   
    const [orden, setOrden] = useState('asc')
    
    useEffect(() => {
        const obtenerDatos = async ()=>{
            try {
               const datosTotales = await db.collection(props.user.email).get() 
                     setDatosTotales(datosTotales.docs.length)
               const data = await db.collection(props.user.email).orderBy('fecha' , orden ).limit(2).get()
                     setLast(data.docs[data.docs.length - 1])
               const arrayDatos = data.docs.map(doc =>({id : doc.id, ...doc.data()}))
                console.log('desde el useeffect ' , arrayDatos)
               
               
                    setDatos(arrayDatos)
               
            } catch (error) {
                console.log(error)
            }
        }
        obtenerDatos()
    }, [props.user])

    const siguientes =async()=>{
         setDesactivado(true)
        
        try {
            const data = await db.collection(props.user.email)
            .limit(2)
            .orderBy('fecha', orden)
            .startAfter(last)
            .get()
            
            const arrayDatos = data.docs.map(doc => ({id:doc.id , ...doc.data() }))
            
            setDatos([...datos , ...arrayDatos])
             setLast(data.docs[data.docs.length - 1])
            
             const query = await db.collection(props.user.email)
             .limit(2)
             .orderBy('fecha' , orden)
             .startAfter(data.docs[data.docs.length - 1])
             .get()
             if(query.empty){
                 console.log('No hay más...')
                 setDesactivado(true)
             }else{
                 setDesactivado(false)
             }

        } catch (error) {
            console.log(error)
        }
        
    }
    const ordenarDescediente =async()=>{
        setOrden('desc')
        setDatos([])
        try {
            const data = await db.collection(props.user.email)
            .limit(2)
            .orderBy('fecha' ,orden)
            .get()
             setLast(data.docs[data.docs.length - 1])
            console.log(data)
                const arrayDatos = data.docs.map(doc => ({id:doc.id , ...doc.data()}))
                
                setDatos([...arrayDatos])
        } catch (error) {
            console.log(error)
        }

    }
    const agregar =async(e)=>{
        e.preventDefault();
        if(!tarea.nombre.trim() || tarea.fecha == ''){
            console.log("campos vacios")
           setNoti({
               estado:true,
               message:'Falta completar campos'
           })
            return
        }
        setNoti({
            estado:false,
            message:''
        })
        try {
            
            const nuevaTarea = {
                nombre:tarea.nombre,
                fecha:tarea.fecha,
                fecha2: Date.now()
            }
            const data = await db.collection(props.user.email).add(nuevaTarea)
            setDatos([
                ...datos, {...nuevaTarea , id: data.id}
            ])
            setTarea({nombre:'',fecha:''})
        } catch (error) {
            
        }
       
        console.log(tarea)
    }
    const eliminar = async(element)=>{
        console.log("se eliminaria el elemento:" , element.id)
         try {
             
              await db.collection(props.user.email).doc(element.id).delete()
            const arrayFiltrado = datos.filter(e => e.id !== element.id)
            setDatos(arrayFiltrado)
            } catch (error) {
            console.log(error)
      }
    }
    const editar =(element)=>{
        console.log("se va a editar este documento " , element)
        setModoEdicion(true)
        setTarea(element)
        setId(element.id)
    }
    
    const guardarEdicion = async(e)=>{
        e.preventDefault()
        if(tarea.nombre == '' || tarea.fecha == ''){
            setNoti({
                    estado:true,
                message:'No se puede completar la edicion con campos vacios'
            })
            return
        }
        setNoti({
            estado:false,
            message:''
            })
        try {
            
            await db.collection(props.user.email).doc(id).update({
                nombre:tarea.nombre,
                fecha:tarea.fecha
            })
            const editado = datos.map(e =>(
                e.id === id?{id: e.id , fecha:e.fecha , nombre:tarea.nombre}: e
            ))
            setDatos(editado)
            setId(''); 
            setModoEdicion(false);
            setTarea({nombre:'', fecha:''})
        } catch (error) {
            console.log(error)
        }
        
           
    }
    return  (
        <div>
           <div className="row container-fluid">
           
            <div className="col-md-6">
                <h5 className="text-secondary">Listado</h5>
                {
                    datos.length == 0 ? (<div className="spinner-border text-light" role="status">
                                             <span className="visually-hidden">Loading...</span>
                                         </div>
                                    )
                                    :
                                    (<ul className="list-group fondo_claro">
                                        {datos.map((e)=>(
                            
                                        <li key={e.id} className="list-group-item d-flex justify-content-between bg-transparent border-success"> 
                                            <span className="text-white">{e.nombre}</span> - 
                                            <span className="texto-primario">{moment(e.fecha).startOf('day').fromNow()}</span> -
                                            <span className="text-secondary">{e.fecha2 !== null? moment(e.fecha2).format("MMM Do YY"): 'S/A'} </span>
                                        <div>
                                            <button className="btn btn-outline-danger btn-sm mx-1" onClick={()=>eliminar(e)}><i className='bx bxs-trash'></i></button>
                                            <button className="btn btn-outline-warning btn-sm mx-1" onClick={()=>editar(e)}><i className='bx bxs-edit'></i></button>
                                        </div>
                                        </li>
                                        ))
                                        }
                                    </ul>)
                }
                <div className="mt-2">
                    <button className="btn btn-warning btn-sm" onClick={()=> ordenarDescediente()}><i className='bx bx-sync'></i></button><span className="text-secondary text-form"> Orden</span>
                </div>
                <button onClick={()=>siguientes()}
                disabled={desactivado}
                className="btn border border-info text-info btn-sm w-100 mt-2">Siguiente...</button>
                <span className="text-secondary d-flex justify-content-end">Se muestran {datos.length} de {datosTotales} movimientos</span>
            </div>
            <div className="col-md-6">
                {
                    <h5 className="text-white" >{modoEdicion?'Edicion':'Ingresá cualquier tarea...'}</h5>
                }
                
                <form className="form-control mb-2 fondo_claro" onSubmit={modoEdicion? guardarEdicion : agregar}>
                   {
                       noti.estado?<span className="text-danger">{noti.message}</span>:<span></span>
                   }
                    <input type="text" name="nombre" id="nombre"placeholder="ingrese el nombre de la tarea" className="form-control mt-2" value={tarea.nombre}
                    onChange={(e)=>setTarea({...tarea , nombre : e.target.value})}/>
                   
                    {/* <input type="text" name="fecha" id="fecha"placeholder="ingrese la fecha de la tarea" className="form-control mt-2" value={tarea.fecha}
                    onChange={(e)=>setTarea({...tarea , fecha : e.target.value})}/> */}
                  

                    <h6 className="mt-2 text-white">Seleccione la fecha</h6> 
                        <input type="date" name="" id="" value={tarea.fecha} placeholder="Seleccione la fecha" className="btn btn-outline-secondary btn-sm w-100" onChange={(e)=>setTarea({...tarea , fecha : e.target.value})}/>
                   <div className="d-flex justify-content-end">
                    <button
                        type="submit"
                        className={
                            modoEdicion?"btn btn-outline-warning btn-block mt-3":"btn btn-outline-primary btn-block mt-3"
                        }
                    >
                        {
                            modoEdicion?'Editar':'Agregar'
                        }
                        
                        </button>
                    </div>
                </form>
                
            </div>

        </div>
        </div>
    )
}

export default Firestore
