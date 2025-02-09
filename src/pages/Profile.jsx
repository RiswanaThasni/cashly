// import React, { useState, useEffect } from "react";
// import { fetchProfileApi } from "../utils/api";  // Import the API method

// const Profile = () => {
//   const [profile, setProfile] = useState(null);  // State to store profile data
//   const [error, setError] = useState("");  // State to store any errors

//   useEffect(() => {
//     // Fetch the profile data when the component mounts
//     fetchProfileApi()
//       .then((data) => {
//         setProfile(data);  // Store profile data in state
//       })
//       .catch((error) => {
//         setError(error.message);  // Store error message in state if fetch fails
//       });
//   }, []);  // Empty dependency array means this runs once when the component mounts

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!profile) {
//     return <div>Loading...</div>;  // Display loading state while fetching data
//   }

//   return (
//     <div className="profile">
//       <h1>Profile</h1>
//       <div className="profile-details">
//         <p><strong>Username:</strong> {profile.username}</p>
//         <p><strong>Email:</strong> {profile.email}</p>
//         <p><strong>Phone:</strong> {profile.phone}</p>
//         {/* Add more fields as needed */}
//       </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from "react";
import { fetchProfileApi } from "../utils/api";  // Import the API method

const Profile = () => {
  const [profile, setProfile] = useState(null);  // State to store profile data
  const [error, setError] = useState("");  // State to store any errors
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch the profile data when the component mounts
    fetchProfileApi()
      .then((data) => {
        setProfile(data);  // Store profile data in state
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        setError(error.message);  // Store error message in state if fetch fails
        setLoading(false); // Stop loading
      });
  }, []);  // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;  // Display loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>;  // Display error message if fetch fails
  }

  return (
    <div className="profile">
      <h1>Profile</h1>
      <div className="profile-details">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default Profile;
