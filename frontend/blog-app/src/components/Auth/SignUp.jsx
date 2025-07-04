import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

import AUTH_IMG from '../../assets/auth-img.jpg'
import Input from "../Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import uploadImage from "../../utils/uploadImage";

const SignUp = ({setCurrentPage}) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminAccessToken, setAdminAccessToken] = useState("");

  const [error, setError] = useState(null);

  const { updateUser, setOpenAuthForm } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle SignUp Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let profileImageUrl = "";

    if (!fullName.trim()) {
      setError("Please enter full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");

    //SignUp API Call
    try {
      // Upload image if present
      if (profilePic) {
        try {
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
        } catch (uploadError) {
          console.warn("Image upload failed:", uploadError);
          // Continue with registration even if image upload fails
          profileImageUrl = "";
        }
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        profileImageUrl,
        adminAccessToken: adminAccessToken || ""
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        //Redirect based on role
        if (role === "admin") {
          setOpenAuthForm(false)
          navigate("/admin/dashboard");
        } else {
          navigate("/");
          setOpenAuthForm(false)
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.response && error.response.data.missing) {
        setError("Please fill in all required fields.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="flex items-center h-auto md:h-[520px]">
      <div className="w-[90vw] md:w-[43vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp} noValidate>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
              id="signup-fullname"
              name="fullName"
              autoComplete="name"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
              id="signup-email"
              name="email"
              autoComplete="email"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
              id="signup-password"
              name="password"
              autoComplete="new-password"
            />

            <Input
              value={adminAccessToken}
              onChange={({ target }) => setAdminAccessToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 Digit Code"
              type="number"
              id="signup-admin-token"
              name="adminAccessToken"
              autoComplete="one-time-code"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already an account?{" "}
            <button
              className="font-medium text-primary underline cursor-pointer"
              onClick={() => {
                setCurrentPage("login");
              }}
            >
              Login
            </button>
          </p>
        </form>
      </div>

      <div className="hidden md:block">
        <img src={AUTH_IMG} alt="Login" className="h-[520px] w-[33vw]" />
      </div>
    </div>
  )
}

export default SignUp