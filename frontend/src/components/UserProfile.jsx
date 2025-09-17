import React from "react";

function UserProfile({ userDetails }) {
  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {userDetails.name}</p>
      <p>Email: {userDetails.email}</p>
    </div>
  );
}

export default UserProfile;
