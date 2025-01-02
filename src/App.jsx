import axios from "axios";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import {url} from "./AppRoutes.jsx"


function App() {
  console.log(url);
  
  // const apiUrl = process.env.API_URL
  // console.log("apiurl",apiUrl);
  
  const [usersData, setUserData] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false); 
  const [currentUserId, setCurrentUserId] = useState(null);

  // User creDentials 
  let userCredentials = {
    email,
    password,
    userName,
  };

  // ADd or UPdate User
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode && currentUserId) {
        // Updating user
        const response = await axios.put(
          // `http://localhost:2000/users/${currentUserId}`,
          // apiUrl + currentUserId,
          `${url.myApiUrl}/${currentUserId}`,
          userCredentials
        );
        setUserData((prevData) =>
          prevData.map((user) =>
            user._id === currentUserId ? { ...user, ...response.data.data } : user
          )
        );
        toast.success("User updated successfully!");
      } else {
        // creating new user
        const response = await axios.post(
          // "http://localhost:2000/users",
          url.myApiUrl,
          userCredentials
        );
        setUserData((prevData) => [...prevData, response.data?.data]);
        toast.success("User added successfully!");
      }
      setEmail("");
      setPassword("");
      setUserName("");
      setIsEditMode(false);
      setCurrentUserId(null);
    } catch (error) {
      console.error("Error submitting user:", error);
      toast.error("Error submitting user!");
    }
  };

  const handleEditInit = (id) => {
    const userToEdit = usersData.find((user) => user._id === id);
    if (userToEdit) {
      setEmail(userToEdit.email);
      setPassword(userToEdit.password);
      setUserName(userToEdit.userName);
      setIsEditMode(true);
      setCurrentUserId(id);
    }
  };

  // Deleting user
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        // `http://localhost:2000/users/${id}`
        `${url.myApiUrl}/${id}`
        );
        // const response = await axios.delete(`${apiUrl}/${id}`);


      if (response.status === 200) {
        setUserData(usersData.filter((user) => user._id !== id));
        toast.success("User deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error while deleting user!");
    }
  };

  // Fetching uSers data from backend
  async function getData() {
    try {
      const response = await axios.get(url.myApiUrl);
      setUserData(response.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          maxWidth: "800px",
          marginLeft: "0 auto",
          padding: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1>{isEditMode ? "Edit User" : "Add User"}</h1>
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
          }}
        >
          <input
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            placeholder="Username"
          />
          <input
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          <input
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: isEditMode ? "#FF9800" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
            type="submit"
          >
            {isEditMode ? "Update User" : "Submit"}
          </button>
        </form>
      </div>

      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          color: "#333",
        }}
      >
        <div>
          {usersData && usersData.length !== 0 ? (
            usersData.map((user) => (
              <div
                key={user._id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ color: "#333", marginBottom: "10px" }}>
                  User Name: {user.userName}
                </h3>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  Email: {user.email}
                </p>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  Password: {user.password}
                </p>
                <button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    cursor: "pointer",
                    marginLeft: "20px",
                  }}
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
                <button
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    cursor: "pointer",
                    marginLeft: "20px",
                  }}
                  onClick={() => handleEditInit(user._id)}
                >
                  Edit
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: "red", fontWeight: "bold" }}>No data found!</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
