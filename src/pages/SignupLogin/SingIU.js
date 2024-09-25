import React from "react";
import * as Components from './comp';
import GoogleIcon from '@mui/icons-material/Google';
import {useNavigate} from "react-router-dom"
import "./sty.css"
function Ap() {
    const [signIn, toggle] = React.useState(true);
    const [name, setName] = React.useState(""); 
    const [email, setEmail] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading,setLoading]=React.useState(false)
    const [error2,seterror2]=React.useState("")
    const navigate=useNavigate()
    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleSignUp = async (event) => {
        event.preventDefault();
        setLoading(true)
        try{
            const response = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username: name,
                  password: password,
                  email: email
                })
              });
        
              if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token",data.access_token)
                navigate("/home")

                // Access token
              } else {
                const errorData = await response.json();
                console.error(errorData); // Error message
              }
              seterror2("")

            } 
        catch{
            seterror2("Failed to create an account")
        }
        setLoading(false)
    }
    const handleSignIn=async(event)=>{
        event.preventDefault();   
        setLoading(true)
    try{
        setErrorMessage("")
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email,
              password: password
            })
          });
    
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token",data.access_token)
            navigate("/home")

          } else {
            const errorData = await response.json();
            console.error(errorData); // Error message
          }
        
    }
    catch{
        setErrorMessage("Failed to sign in")
    }
    setLoading(false)    
    }
     return(
      <div className="ma">
        <div className="heyo">
         <Components.Container>
             <Components.SignUpContainer signinIn={signIn}>
                 <Components.Form>
                 <Components.Title>Create Account</Components.Title>
                        <Components.Input type='text' placeholder='Name'onChange={handleNameChange} />
                        <Components.Input type='email' placeholder='Email'onChange={handleEmailChange} />
                        <Components.Input type='password' placeholder='Password' onChange={handlePasswordChange}/>
                        <Components.Button onClick={handleSignUp} disabled={loading}>Sign Up</Components.Button>
                        {error2 && <Components.error2>{error2}</Components.error2>}
                    </Components.Form>
             </Components.SignUpContainer>

             <Components.SignInContainer signinIn={signIn}>
                  <Components.Form>
                  <Components.Title>Sign in</Components.Title>
                        <Components.Input type='email' placeholder='Email'onChange={handleEmailChange} />
                        <Components.Input type='password' placeholder='Password' onChange={handlePasswordChange}/>
                        <Components.Button onClick={handleSignIn}>Sign In</Components.Button>
                        {errorMessage && <Components.ErrorMessage>{errorMessage}</Components.ErrorMessage>}
                      
                  </Components.Form>

             </Components.SignInContainer>

             <Components.OverlayContainer signinIn={signIn}>
                 <Components.Overlay signinIn={signIn}>

                 <Components.LeftOverlayPanel signinIn={signIn}>
                    <h1>SONGSDB</h1>
                     <Components.Title>Welcome Back!</Components.Title>
                     <Components.Paragraph>
                         To keep connected with us please login with your personal info
                     </Components.Paragraph>
                     <Components.GhostButton onClick={() => toggle(true)}>
                         Sign In
                     </Components.GhostButton>
                     </Components.LeftOverlayPanel>

                     <Components.RightOverlayPanel signinIn={signIn}>
                     <h1>SONGSDB</h1>
                       <Components.Title>Hello!</Components.Title>
                       <Components.Paragraph>
                           Enter Your personal details and start vibing
                       </Components.Paragraph>
                           <Components.GhostButton onClick={() => toggle(false)}>
                               Sign Up
                           </Components.GhostButton> 
                     </Components.RightOverlayPanel>
 
                 </Components.Overlay>
             </Components.OverlayContainer>

         </Components.Container>
         </div>
         </div>
     )
}

export default Ap;
