import React , { useEffect, useState, useRef }from 'react'
import firebase from "firebase/app";
import "firebase/database";
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'

export default function ProjectPage(props) {
    const { currentUser } = useAuth()
    const [author, setAuthor] = useState({})
    const commentRef = useRef()
    const history = useHistory()
    const[comments, setComments] = useState([])
    const[commenter, setCommenter] = useState({})
    let counter = 0

    useEffect(()=>{
        retrieveAuthor();
        retrieveComments()
        retrieveCommenter()
    }, [])

    function retrieveAuthor(){
        if(props.location.project){
            var user = firebase.database().ref('/users/'+props.location.project.uid)
            user.once('value', (snapshot) => {
                setAuthor({name: snapshot.val().name, surname: snapshot.val().surname})
            })
        }
    }

    function retrieveComments(){
        if(props.location.project){
            var comments = firebase.database().ref('/projects/'+props.location.project.uid + '/' + props.location.project.pid+'/comments');
            comments.on('value', (snapshot)=>{
                let msgs = [];
                snapshot.forEach((snap)=>{
                    msgs.push(snap.val());
                })
                setComments(comments => msgs);
            })
        }
    }

    function retrieveCommenter(){
        var commentAuthor = firebase.database().ref('/users/'+currentUser.uid).on('value', (snapshot)=>{
            setCommenter({name: snapshot.val().name, surname: snapshot.val().surname})
        })
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        firebase.database().ref('/projects/'+ props.location.project.uid + '/' + props.location.project.pid +'/comments/').push({
            author: commenter.name + ' ' +commenter.surname,
            comment: commentRef.current.value
        })
        commentRef.current.value = ''
    }

    const handleBack = (e) =>{
        e.preventDefault()
        history.push('/')
    }

    if(! props.location.project){
        history.push('/')
        return <div>No project selected</div>
    }else {
        return (            
            <div>
                <div className='row w-100 h-100'>
                    <div className='col card m-3 ml-4 p-3'>
                        <div className='row text-center align-item-center mx-auto'>Comment Section</div>
                        <div className='p-1 commentSection'>
                            {comments && comments.map(comment=>{
                                return <div className='card p-1 w-100 mx-auto mb-3' key={counter++} >
                                            <p className='card-text'>{comment.comment}</p> 
                                            <p className='card-text'><em>{comment.author}</em></p> 
                                       </div>
                            })}
                        </div>
                        <form onSubmit = {handleSubmit}>
                        <div className="input-group mb-3">
                            <input ref= {commentRef} type="text" className="form-control" placeholder="Your comment..." aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary">Add</button>
                            </div>
                        </div>
                        </form>
                    </div>
                    <div className='col-9'>
                        <div className = 'row'>
                            <div className='col'><strong>Title: </strong>{props.location.project.title}</div>
                            <div className='col'><strong>Description: </strong>{props.location.project.description}</div>
                            <div className='col'><strong>Author: </strong>{author.name} {author.surname}</div>
                        </div>
                        <div className='row card text-center align-item-center '>
                            <img className=' mx-auto w-100 h-100' src={props.location.project.url} />
                            <button onClick={handleBack} className='btn btn-warning'>Go back...</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    }