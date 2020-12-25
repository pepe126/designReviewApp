import React, { useRef, useState, useEffect }  from 'react'
import  firebase from 'firebase/app';
import 'firebase/storage';
import "firebase/database";
import { useAuth } from '../../contexts/AuthContext'


export default function AddPage() {
    const titleRef = useRef()
    const descriptionRef = useRef()
    const designRef = useRef()
    const [fileUrl, setFileUrl] = useState()
    const { currentUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState('')

    const handleFileChange = async (e) =>{
        setLoading(true)
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref('/'+currentUser.uid)
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        setFileName(file.name)
        setFileUrl(await fileRef.getDownloadURL())
        setLoading(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        firebase.database().ref('/projects/' + currentUser.uid ).push({
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            pr: fileUrl,
            name: fileName
        })
        titleRef.current.value=''
        descriptionRef.current.value=''
        designRef.current.value=null
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor = "title" className="form-label">Project title</label>
                <input ref = {titleRef} className="form-control" type="text" id="title" required/>
                
                <label htmlFor = "description" className="form-label">Project description</label>
                <input ref = {descriptionRef} className="form-control" type="text" id="description" required/>
                
                <p className='mt-2'><label htmlFor = "design" className="form-label">Design File</label></p>
                <input onChange={handleFileChange} ref = {designRef}  type="file" id="design" required/>
                
                <button disabled = {loading} className = 'btn btn-outline-primary m-3'>Submit Project</button>
                <p hidden = {!loading}>Loading...</p>
            </form>
        </div>
    )
}
