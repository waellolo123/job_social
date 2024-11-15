import {Routes, Route, Navigate} from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";


function App() {

  const {data: authUser, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if(err.message && err.response.status === 401){
          return null;
        }
        toast.error(err.response.data.message || "Something went wrong");
      }
    }
  });

  if(isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={authUser ?<HomePage />: <Navigate to={"/signup"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        <Route path="/login" element={!authUser ? <SignInPage /> : <Navigate to={"/"} />} />
      </Routes>
      <Toaster />
    </Layout>
  )
}

export default App
