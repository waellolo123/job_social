import { useState } from "react"


const SignUpForm = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log(name, username, email, password);
    
  }

  return (
    <form onSubmit={handleSignup}></form>
  )
}

export default SignUpForm