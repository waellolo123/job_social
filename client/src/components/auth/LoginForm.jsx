import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react"
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { LiaSpinnerSolid } from "react-icons/lia";


const LoginForm = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const {mutate: loginMutation, isLoading} = useMutation({
    mutationFn: (userdata) => axiosInstance.post("/auth/login", userdata),
    onSuccess: () => {
      toast.success("user logged in successfully");
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginMutation({username, password});
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      
       <input type="text" placeholder="Username" required
       value={username} onChange={(e) => setUsername(e.target.value)}
       className="input input-bordered w-full"/> 
     
       <input type="text" placeholder="Password" required
       value={password} onChange={(e) => setPassword(e.target.value)}
       className="input input-bordered w-full"/> 

      <button disabled={isLoading} type="submit" className="btn w-full bg-blue-600 text-white">
        {isLoading ? <LiaSpinnerSolid className="text-white animate-spin" size={24}/> : "Sign in"}
      </button>
    </form>
  )
}

export default LoginForm