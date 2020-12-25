import React, { useEffect, useState } from 'react'
import firebase from "firebase/app";
import "firebase/database";
import { useHistory } from 'react-router-dom'


export default function DesignsView(props) {
    const [designs, setDesigns] = useState([]);
    let counter = 0
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
                if(props.id === snap.key){
                    for (var key in projectsObject){
                        if (projectsObject.hasOwnProperty(key)){
                            projectsObject[key].uid= props.id
                            projectsObject[key].pid= key
                            dsgn.push(projectsObject[key])
                        }
                    }
                }
            })
            setDesigns(designs => dsgn)
        })
    }

    function handleProject(props){
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

    return (
        <div>
            {designs.map((project)=>{
                return <p onClick = {()=>handleProject(project)} className='card clickable p-1 w-75 mx-auto mb-3' key = {counter++}>{project.title}</p>
            })}
        </div>
    )
}
