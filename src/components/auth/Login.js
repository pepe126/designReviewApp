import React, { useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push("/")
        } catch {
            setError('Failed to Log in')
        }
        setLoading(false)
    }

        return (
            <div className="App container d-flex align-items-center justify-content-center">
                <div className ="w-100" style = {{maxWidth: "500px"}}>
                    <div className = "card mt-5">
                         <h2 className = "text-center mb-4">Login</h2>
                         {error && <div className = "alert alert-danger">{error}</div>}
                         <form onSubmit = {handleSubmit}>
                             <label htmlFor = "email" className="form-label">Email</label>
                             <input ref = {emailRef} className="form-control" type="email" id="email" required/>
   
                             <label htmlFor = "password" className="form-label">Password</label>
                             <input ref = {passwordRef} className="form-control" type="password" id="password" required/>
   
                             <button disabled = {loading} className="btn btn-primary mt-3 w-100">LOGIN</button>
                         </form>
                     </div>
                     <div className = "w-100 text-center mt-2">
                         Need an Account? <Link to = "/signup">SignUp</Link>
                     </div>
                </div>
            </div>
           
        )
    }


export default Login
