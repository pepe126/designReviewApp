import React, { useEffect, useState } from 'react'
import DesignsView from '../projectComponents/DesignsView'
import firebase from "firebase/app";
import "firebase/database";

export default function CustomerContent() {
    const[designers, setDesigners] = useState([]);
    const [isHidden, setIsHidden] = useState(true)
    const [selectedName, setSelectedName] = useState('')
    const [selectedUser, setSelectedUser] = useState('')
    
    useEffect(() => {
        retrieveUsers();
    }, [])

    function retrieveUsers() {
        setDesigners([])
        var users = firebase.database().ref('/users');
        users.once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                const userObject = snap.val();
                userObject.id = snap.key;
                const role = userObject['role'];
                if (role === 'designer') {
                    setDesigners(designers => [...designers ,userObject]);
                }
            });
        });
    }

    function handleClick(props){
        if(isHidden){setSelectedName(props.name)
        setSelectedUser(props.id)
        setIsHidden(false)}
    }

    function handleReverse(){
        setIsHidden(true)
    }

    return (
        <div>
            <h2>Designers: </h2>
                {designers.map((designerObject) => {
                    return <div hidden = {!isHidden} onClick = {()=>{handleClick(designerObject)}} className = 'card clickable p-1 w-75 mx-auto mb-3' key = {designerObject.id}>{designerObject.name} {designerObject.surname}</div>;
                })}
                {!isHidden && <div className = 'card mt-3' >
                    {selectedName}'s designs:
                    <div className='projectSection p-3'>
                        <DesignsView id={selectedUser}/>
                    </div>
                    <button onClick = {handleReverse} className='btn btn-outline-primary' >Back</button>
                </div>}
        </div>
    )
}
