/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { IoHome, IoLogOut } from "react-icons/io5";
import { FaBell, FaUser, FaUsers } from "react-icons/fa";
import { MdLogout } from "react-icons/md";


const Navbar = () => {
  
  const {data:authUser} = useQuery({queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {data:notifications} = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser
  });

  const {data:connectionRequests} = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser
  });

  const {mutate: logout} = useMutation({
      mutationFn: async () => {
      const res = await axiosInstance.post("/auth/logout");
      console.log(res);
    }, 
    onSuccess: () => {
      toast.success("user logged out");
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },
    onError: (err) => {
      toast.error(err.message);
    }
  })

//  const unreadNotificationCount = notifications?.data.filter(notif => !notif.read).length;
//  const unreadConnectionRequestsCount = connectionRequests?.data?.length; 
const unreadConnectionRequestsCount = 5;
const unreadNotificationCount = 3;



  return (
    <nav className="bg-gray-50 sticky top-0 z-10">
     <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center space-x-4">
          <Link to="/"><h1 className="text-2xl md:text-3xl font-semibold text-slate-400">Job Social</h1></Link>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          {authUser ? (
            <>
             <Link to={"/"} className="text-neutral flex flex-col items-center">
              <IoHome size={20} />
              <span className="text-xs hidden md:block">Home</span>
             </Link>
             <Link to={"/network"} className="text-neutral flex flex-col items-center relative">
              <FaUsers size={22} />
              <span className="text-xs hidden md:block">My Network</span>
             {unreadConnectionRequestsCount > 0 && (
               <span className="absolute -top-2 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center">
                {unreadConnectionRequestsCount}
              </span>
             )}
             </Link>
             <Link to="/notifications" className="text-neutral flex flex-col items-center relative">
              <FaBell size={20}  />
              <span className="text-xs hidden md:block">Notifications</span>
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-2 -right-1 md:right-4 bg-blue-600 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
             </Link>
             <Link to={`/profile/${authUser.username}`} className="text-neutral flex flex-col items-center">
             <FaUser size={20}  />
             <span className="text-xs hidden md:block">Me</span>
             </Link>
             <button 
             onClick={() => logout()}
             className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800">
              <MdLogout size={24}  />
              <span className="hidden md:inline">Logout</span>
             </button>
            </>
          ) : (
            <>
             <Link to="/login" className="btn btn-ghost">Sign In</Link>
             <Link to="/signup" className="btn btn-sm bg-blue-600 text-white">Join now</Link>
            </>
          )}
        </div>
      </div>
     </div>
    </nav>
  )
}

export default Navbar