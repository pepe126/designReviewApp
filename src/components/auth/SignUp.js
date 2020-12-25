import React, { useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'



function SignUp() {
    const emailRef = useRef()
    const nameRef = useRef()
    const surnameRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const roleRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e){
        e.preventDefault()
        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError('Password do not match')
        }
        try{
            setError('')
            setLoading(true)
            await signup(emailRef.current.value,
                         passwordRef.current.value, 
                         roleRef.current.value, 
                         nameRef.current.value,
                         surnameRef.current.value)
            history.push("/")
        } catch {
            setError('Failed to create an account')
        }
        setLoading(false)
    }

        return (
            <div className="App container d-flex align-items-center justify-content-center">
                <div className ="w-100" style = {{maxWidth: "500px"}}>
                    <div className = "card mt-5">
                         <h2 className = "text-center mb-4">Sign Up</h2>
                         {error && <div className = "alert alert-danger">{error}</div>}
                         <form onSubmit = {handleSubmit}>
                             <label htmlFor = "email" className="form-label">Email</label>
                             <input ref = {emailRef} className="form-control" type="email" id="email" required/>
   
                             <label htmlFor = "name" className="form-label">Name</label>
                             <input ref = {nameRef} className="form-control" type="text" id="name" required/>
   
                             <label htmlFor = "surname" className="form-label">Surname</label>
                             <input ref = {surnameRef} className="form-control" type="text" id="surname" required/>
   
                             <label htmlFor = "password" className="form-label">Password</label>
                             <input ref = {passwordRef} className="form-control" type="password" id="password" required/>
   
                             <label htmlFor = "passwordConfirm" className="form-label">Password Confirmation</label>
                             <input ref = {passwordConfirmRef} className="form-control" type="password" id="passwordConfirm" required/>
   
                             <label htmlFor = "role" className="form-label">Ruolo: </label>
                             <select ref = {roleRef} className = "m-2 mt-4" name="roles" id="roles" required>
                                
                                    <option value="designer">Designer</option>
                                    <option value="customer">Customer</option>
                                
                             </select>
                             <button disabled = {loading} className="btn btn-primary mt-3 w-100">SIGN UP</button>
                         </form>
                     </div>
                     <div className = "w-100 text-center mt-2">
                         Already have an account? <Link to = "/login">Login</Link>
                     </div>
                </div>
            </div>
           
        )
    }


export default SignUp
