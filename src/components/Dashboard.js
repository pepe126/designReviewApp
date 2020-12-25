import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import firebase from "firebase/app";
import "firebase/database";
import DesignerContent from './content/DesignerContent'
import CustomerContent from './content/CustomerContent'


export default function Dashboard() {
    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()
    const [role, setRole] = useState('')
    const [roleProp, setRoleProp] = useState('')
    
    useEffect((users) => {
        firebase.database().ref('/users/'+currentUser.uid).on("value", (snapshot) => {
            setRole(snapshot.val().role);
        });
    }, [])
    
    async function handleLogout(){
        setError('')
        try {
            await logout()
            history.push('/login')
        }catch {
            setError('Failed to Logout')
        }
    }

    function LoadGraph(){
        if(role === 'customer'){
            return <CustomerContent />
        } else if (role === 'designer'){
            return <DesignerContent />
        }
    }

    return (
        <div className="App container d-flex align-items-center justify-content-center">
            <div className ="w-100" style = {{maxWidth: "500px"}}>
                <div className = "card">      
                    {role && <LoadGraph />}
                    {error && <div className = "alert alert-danger">{error}</div>}
                    <strong>Email: {currentUser.email}</strong> 
                    <div className = "w-100 text-center mt-2">
                        <button className = "btn btn-warning" onClick = {handleLogout}>Log Out</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
