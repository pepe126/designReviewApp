import React, { useState, useEffect } from 'react'
import AddPage from '../projectComponents/AddPage'
import { useAuth } from '../../contexts/AuthContext'
import firebase from "firebase/app";
import "firebase/database";
import 'firebase/storage';
import { useHistory } from 'react-router-dom'

export default function DesignerContent() {
    const [adding, setAdding] = useState(false)
    const [buttonSign, setButtonSign] = useState('+')
    const { currentUser } = useAuth()
    const [designs, setDesigns] = useState([]);
    let counter = 0;
    const history = useHistory()

    useEffect(()=>{
         loadProjects()
    }, [])

    function loadProjects(){
        setDesigns([])
        var projects = firebase.database().ref('/projects');
        projects.on('value', (snapshot)=>{
            let dsgn = []
            snapshot.forEach((snap)=>{
                const projectsObject = snap.val();
                if(currentUser.uid === snap.key){
                    for (var key in projectsObject){
                        if (projectsObject.hasOwnProperty(key)){
                            projectsObject[key].uid= currentUser.uid
                            projectsObject[key].pid= key
                            dsgn.push(projectsObject[key])
                        }
                    }
                }
            })
            setDesigns(designs => dsgn)
        })
    }

    function handleClick(){
        if(adding){
            setAdding(false)
            setButtonSign('+')
        }else {
            setAdding(true)
            setButtonSign('-')
        }
    }

    function handleProjectClick(props){
        history.push({
            pathname:'/project',
            project: {uid: props.uid,
                      pid: props.pid,
                      title: props.title,
                      url: props.pr,
                      description: props.description
                    }
        })
    }

    function deleteProject(props){
        firebase.database().ref('/projects/'+currentUser.uid+'/'+props.pid).remove()
        firebase.storage().ref().child('/'+currentUser.uid+'/'+props.name).delete()
    }

    return (
        <div>
            <h2>Projects:</h2>
            <div className='projectSection'>
                {designs.map((project)=>{
                    return <div className='card p-1 w-75 mx-auto mb-3'  key = {counter++}>
                        {project.title}
                        <p>
                            <button onClick={()=>deleteProject(project)} className='btn btn-outline-danger w-25 mx-auto mt-2' >delete</button>
                            <button onClick={()=>handleProjectClick(project)} className='btn btn-outline-primary w-25 mx-auto mt-2' >open</button>
                        </p>
                    </div>
                        
                })}
            </div>
            <button onClick = {handleClick} className = 'btn btn-outline-primary w-100 '>{buttonSign}</button>
            {adding && <AddPage />}
        </div>
    )
}



