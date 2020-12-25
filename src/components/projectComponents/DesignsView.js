import React, { useEffect, useState } from 'react'
import firebase from "firebase/app";
import "firebase/database";
import { useHistory } from 'react-router-dom'

//componente per caricare i designs del designer scelto dal customer attuale
export default function DesignsView(props) {
    const [designs, setDesigns] = useState([]); //array di oggetti (props di handleProject)
    let counter = 0 //per unique key in map component
    const history = useHistory()

    useEffect(()=>{
        loadProjects()
    }, [])

    //funzione per caricare i progetti
    function loadProjects(){
        var projects = firebase.database().ref('/projects');
        projects.on('value', (snapshot)=>{
            let dsgn = []
            snapshot.forEach((snap)=>{
                //snap.val è un array di oggetti {key: {progetto}}, ogni progetto ha una key unica
                const projectsObject = snap.val();
                //snap.key è l'id dell'utente a cui appartengono i progetti
                //se l'id del deisgner selezionato dalla dashboard corrisponde a quello dello snap
                //i progetti nello snap verranno caricati
                if(props.id === snap.key){
                    for (var key in projectsObject){
                        if (projectsObject.hasOwnProperty(key)){
                            //aggiunta di alcune proprietà utili all'oggetto
                            projectsObject[key].uid= props.id //id dell'autore del progetto
                            projectsObject[key].pid= key      //id del progetto
                            dsgn.push(projectsObject[key])
                        }
                    }
                }
            })
            setDesigns(designs => dsgn)
        })
    }

    //funzione per caricare la pagina del progetto con props necessarie
    function handleProject(props){
        history.push({
            pathname:'/project',
            //props di ProjectPage.js
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
