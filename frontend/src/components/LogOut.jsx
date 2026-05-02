import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import { userContext } from "../context/userContext";

const LogOut = ({ className = "btn-secondary" }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useContext(userContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        BACKEND_URL + "user/logout",
        {},
        {
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        setUser(null);
        navigate("/", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button className={className} onClick={handleLogOut} type="button">
      {isSubmitting ? "Logging Out..." : "Log Out"}
    </button>
  );
};

export default LogOut;
