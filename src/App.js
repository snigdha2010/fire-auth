import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);
function App() {

  const [user,setUser] = useState({
    isSignedIn:false,
    name: '',
    email:'',
    pass:'',
    photo: '',
    error:'',
    existingUser:'false',
    isValid: false 
  })

  

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSingIn = ()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName,email,photoURL,pass} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        pass: pass,
        photo: photoURL
       
      }

      setUser(signedInUser);
      //console.log(displayName,email);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }



  const handleSingOut = ()=>{
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email:'',
        photo:'',
        pass:''
          
       
        
      }
      setUser(signedOutUser);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message)
    })
    
  }

  const is_valid_email = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasNumber = input => /\d/.test(input);
  const switchForm = e=>{
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
    console.log(e.target.checked)
  }


  const handleChange = e =>{
    //console.log(e.target.value);
    const newUserInfo = {
      ...user
     };

     //perform validation
     let isValid = true;
     if(e.target.name==='email'){
       isValid = is_valid_email(e.target.value);
     }
     if(e.target.name==='password'){
      isValid = e.target.value.length>8 && hasNumber(e.target.value);

    }
     
      


    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const creatAccount=(event)=>{
    
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error='';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error= err.message;
        setUser(createdUser);
      })
      // console.log(user.email, user.password);
    }else{
      console.log("not a valid case");
    }
    event.preventDefault();
    event.target.reset();
  }
  
    const signInUser = event =>{
      if(user.isValid){
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = {...user};
          createdUser.isSignedIn = true;
          createdUser.error='';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = {...user};
          createdUser.isSignedIn = false;
          createdUser.error= err.message;
          setUser(createdUser);
        })
      }
      event.preventDefault();
      event.target.reset();
    }



  return (
    <div className="App">
    {  user.isSignedIn? <button onClick={handleSingOut}>Sign Out</button>:
      <button onClick={handleSingIn}>Sign 
    In</button>}
      {
         user.isSignedIn && 
          <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email,{user.email}</p>
          <p><img src={user.photo} alt=""/>
          </p>
          </div>
    
    }

    <h1>Our Own Authentication</h1><input type="checkbox" name="switchForm" onChange={switchForm} id=""/>
    <label htmlFor='switchForm'> Returning USer
    </label>

    
    <form style={{display:user.existingUser?'block':'none'}} onSubmit={signInUser}> 
    <input onBlur={handleChange} type="text"name="email" placeholder="Your Email"required/>
    <br/>
    <input onBlur={handleChange} type="text"name="password" placeholder="Your password"required/>
    <br/>
    <input type="submit" value="SignIn"/>
    </form>

    <form style={{display:user.existingUser?'none':'block'}}  onSubmit={creatAccount}> 
    <input onBlur={handleChange} type="text"name="name" placeholder="Your Name"required/>
    <br/>
    <input onBlur={handleChange} type="text"name="email" placeholder="Your Email"required/>
    <br/>
    <input onBlur={handleChange} type="text"name="password" placeholder="Your password"required/>
    <br/>
    <input type="submit" value="Create Account"/>
    </form>
    {
      user.error && <p style={{color:'red'}}>{user.error}</p>
    }
    </div>
  );
}

export default App;
