import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import firebase from "firebase/app";
import "firebase/database";

//Context per passare informazioni importanti a tutti gli elementi
//Utilizzato principalmente per passare l'utente correntemente loggato e per login/signup

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup (email, password, role, name, surname){
        return auth.createUserWithEmailAndPassword(email, password).then((data)=>{
                firebase.database().ref('/users/' + data.user.uid).set({
                    role: role,
                    name: name,
                    surname: surname
                })
        })
    }

    function login (email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout(){
        return auth.signOut()
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

 
    const value = {
        currentUser,
        signup,
        login,
        logout
    }

    return (
        <AuthContext.Provider value = {value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
