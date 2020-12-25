import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ component: Component, ...rest}) {
    const { currentUser } = useAuth()
    return (
        <Route
            {...rest}
            render = {props => {
                //check se l'utente è loggato, altrimenti redirect to login
                return currentUser ? <Component {...props}/> : <Redirect to = "/login" />
            }}
        >

        </Route>
    )
}
