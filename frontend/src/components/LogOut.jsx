import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useContext } from "react";
import { userContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
    const {setUser} = useContext(userContext);
    const navigate = useNavigate()
  const handlelogOut = async () => {
    const res = await axios.post(
      BACKEND_URL + "user/logout",
      {},
      {
        withCredentials: true,
      },
    );
    if (res.status === 200) {
      setUser(null);  
      navigate("/")
      alert("Logged out successfully");
    } else {
      alert("Logout failed");
    }
  };
  return (
    <div>
      <button
        className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-200"
        onClick={handlelogOut}
      >
        Log Out
      </button>
    </div>
  );
};

export default LogOut;
