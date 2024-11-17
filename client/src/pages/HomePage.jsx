import { useQuery} from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios";



const HomePage = () => {

  const {data:recommendedUsers} = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
        const res = await axiosInstance.get("/users/suggestions");
        return res.data;
    }
  });

  const {data:posts} = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
        const res = await axiosInstance.get("/posts");
        return res.data;
    }
  });

  console.log("recommendedUsers", recommendedUsers)
  console.log("posts", posts)

  return (
    <div>HomePage</div>
  )
}

export default HomePage;
