import React, { useEffect, useState } from 'react'
import DesignsView from '../projectComponents/DesignsView'
import firebase from "firebase/app";
import "firebase/database";

//Dashboard per clienti
export default function CustomerContent() {
    const[designers, setDesigners] = useState([]);
    const [isHidden, setIsHidden] = useState(false)
    const [selectedName, setSelectedName] = useState('')
    const [selectedUser, setSelectedUser] = useState('')
    
    useEffect(() => {
        retrieveUsers();
    }, [])

    //Funzione per salvare i designers in uno stato
    //analoga per alcuni versi a loadProjects in DesignsView.js
    function retrieveUsers() {
        var users = firebase.database().ref('/users');
        users.on('value', (snapshot) => {
            let tempDesigners = []
            snapshot.forEach((snap) => {
                const userObject = snap.val();
                //snap.key corrisponde all'id unico dei designers ed essendo utile
                //viene aggiunto allo stato come propietà dell'oggetto
                userObject.id = snap.key;
                const role = userObject['role'];
                //check ruolo dell'utente analizzato (si vogliono visualizzare solo i designers)
                if (role === 'designer') {
                    tempDesigners.push(userObject)
                }
            })
            setDesigners(designers => tempDesigners)
        });
    }

    //funzione che gestisce click su designer
    //setta stato che viene poi passato in DesignsView per caricare i progetti del designer scelto
    function handleClick(props){
        if(!isHidden){
            setSelectedName(props.name)
            setSelectedUser(props.id)
            setIsHidden(true)
        }
    }

    //chiude progetti e torna alla lista dei designers
    function handleReverse(){
        setIsHidden(false)
    }

    return (
        <div>
            <h2>Designers: </h2>
                {designers.map((designerObject) => {
                    //i designers vengono nascosti quando si entra nei progetti di uno di loro
                    return <div hidden = {isHidden} onClick = {()=>{handleClick(designerObject)}} className = 'card clickable p-1 w-75 mx-auto mb-3' key = {designerObject.id}>{designerObject.name} {designerObject.surname}</div>;
                })}
                {isHidden && <div className = 'card mt-3' >
                    {selectedName}'s designs:
                    <div className='projectSection p-3'>
                        <DesignsView id={selectedUser}/>
                    </div>
                    <button onClick = {handleReverse} className='btn btn-outline-primary' >Back</button>
                </div>}
        </div>
    )
}
