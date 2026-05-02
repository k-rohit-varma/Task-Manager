import { useContext } from "react";
import { userContext } from "../context/userContext";
import LogOut from "./LogOut";

const Profile = () => {
  const { user, isAuthLoading } = useContext(userContext);

  if (isAuthLoading) {
    return <div>Loading profile...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      Profile {user.email}
      <LogOut />
    </div>
  );
};

export default Profile;
