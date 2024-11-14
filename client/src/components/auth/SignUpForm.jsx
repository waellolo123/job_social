import { useState } from "react";
import {useMutation} from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import {toast} from "react-hot-toast";
import { LiaSpinnerSolid } from "react-icons/lia";

const SignUpForm = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const {mutate: signUpMutation, isLoading} = useMutation({
    mutationFn: async(data) => {
      const res = await axiosInstance.post("/auth/register", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registration successfully");
    },
    onError: () => {
      toast.error("Registration failed");
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signUpMutation({name, username, email, password});
  }

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-5">

        <input type="text" placeholder="Full Name"
        value={name} onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full"
        required
        />

        <input type="text" placeholder="Username"
        value={username} onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full"
        required
        />

        <input type="email" placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full"
        required
        />

        <input type="text" placeholder="Password"
        value={password} onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full"
        required
        />

        <button type="submit" disabled={isLoading} className="btn bg-blue-600 w-full text-white">
          {isLoading ? <LiaSpinnerSolid className="animate-spin" /> : "Agree & Join"}
        </button>

    </form>
  )
}

export default SignUpForm