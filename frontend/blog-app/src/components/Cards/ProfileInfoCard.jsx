import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import ProfileImage from '../ProfileImage';
import CharAvatar from './CharAvatar';
import { LuUser } from 'react-icons/lu';

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };
  
  if (!user) return null;
  
  return (
    <div className="flex items-center">
      {user?.profileImageUrl ? (
        <ProfileImage
          src={user.profileImageUrl}
          alt={`Profile picture of ${user.name || 'User'}`}
          size="w-11 h-11 mr-3"
          fallbackIcon={LuUser}
        />
      ) : (
        <CharAvatar
          fullName={user?.name || ""}
          width="w-11"
          height="h-11"
          style="text-sm mr-3"
        />
      )}
      <div>
        <div className="text-[15px] text-black font-bold leading-3">
          {user.name || ""}
        </div>
        <button
          className="text-sky-600 text-sm font-semibold cursor-pointer hover:underline"
          onClick={handelLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
