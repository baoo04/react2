import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPen } from "@fortawesome/free-solid-svg-icons";

const App = () => {
    const createBtn = document.querySelector("#create");
    const saveBtn = document.querySelector("#edit");
    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState("");
    const [create, setCreate] = useState(false);
    const [createDisabled, setCreateDisabled] = useState(false);
    useEffect(() => {
        getUsers();
    }, []);

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const getUsers = () => {
        axios
            .get("https://60becf8e6035840017c17a48.mockapi.io/users")
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    };

    const renderUsers = () => {
        if (saveBtn) {
            saveBtn.style.display = "none";
        }
        return users.map((user) => (
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                    <img src={user.avatar} alt="User Avatar" />
                </td>
                <td>{user.email}</td>
                <td>{user.city}</td>
                <td>
                    <button
                        className="edit-btn"
                        onClick={() => editUser(user.id)}
                    >
                        <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                        className="delete-btn"
                        onClick={() => deleteUser(user.id)}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </td>
            </tr>
        ));
    };

    const noNotification = () => {
        setTimeout(() => {
            setNotification("");
        }, 2000);
    };

    const createUser = (data) => {
        axios
            .post("https://60becf8e6035840017c17a48.mockapi.io/users", data)
            .then(() => {
                setNotification("User created");
                noNotification();
                getUsers();
                clearInputFields();
            })
            .catch((error) => {
                console.error("Error creating user:", error);
            });
    };

    const handleCreate = () => {
        const name = document.querySelector('input[name="name"]').value;
        const ava = document.querySelector('input[name="ava"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const city = document.querySelector('input[name="city"').value;

        const formData = {
            name: name,
            avatar: ava,
            email: email,
            city: city,
        };
        createUser(formData);
    };

    const clearInputFields = () => {
        document.querySelector('input[name="name"]').value = "";
        document.querySelector('input[name="ava"]').value = "";
        document.querySelector('input[name="email"]').value = "";
        document.querySelector('input[name="city"').value = "";
        document.querySelector('input[name="name"]').focus();
    };

    const editUser = (id) => {
        scrollToTop();
        if (createBtn) {
            createBtn.style.display = "none";
            if (saveBtn) {
                saveBtn.style.display = "block";
            }
        }
        axios
            .get(`https://60becf8e6035840017c17a48.mockapi.io/users/${id}`)
            .then((response) => {
                const user = response.data;
                document.querySelector('input[name="name"]').value = user.name;
                document.querySelector('input[name="ava"]').value = user.avatar;
                document.querySelector('input[name="email"]').value =
                    user.email;
                document.querySelector('input[name="city"]').value = user.city;

                const saveBtn = document.querySelector("#edit");
                saveBtn.onclick = () => {
                    const updatedUser = {
                        name: document.querySelector('input[name="name"]')
                            .value,
                        avatar: document.querySelector('input[name="ava"]')
                            .value,
                        email: document.querySelector('input[name="email"]')
                            .value,
                        city: document.querySelector('input[name="city"]')
                            .value,
                    };

                    axios
                        .put(
                            `https://60becf8e6035840017c17a48.mockapi.io/users/${id}`,
                            updatedUser
                        )
                        .then(() => {
                            setNotification("User updated");
                            noNotification();
                            getUsers();
                            clearInputFields();
                        })
                        .catch((error) => {
                            console.error("Error updating user:", error);
                        });
                    saveBtn.style.display = "none";

                    createBtn.style.display = "block";
                };
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
            });
    };

    const deleteUser = (id) => {
        axios
            .delete(`https://60becf8e6035840017c17a48.mockapi.io/users/${id}`)
            .then(() => {
                setNotification("User deleted");
                noNotification();
                getUsers();
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            });
    };

    return (
        <div className="App">
            <div
                id="notification-container"
                style={
                    create === true
                        ? {
                              background: "green",
                          }
                        : {
                              display: "none",
                          }
                }
            ></div>
            <div className="users w-100">
                <div className="users__add d-flex justify-content-around align-items-center">
                    <div className="users__add--name">
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter name here"
                        />
                    </div>

                    <div className="users__add--avatar">
                        <label htmlFor="imageURL">Avatar URL: </label>
                        <input
                            type="text"
                            name="ava"
                            id="imageURL"
                            placeholder="Paste image URL here"
                        />
                    </div>

                    <div className="users__add--email">
                        <label htmlFor="email">Email: </label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter email here"
                        />
                    </div>

                    <div className="users__add--city">
                        <label htmlFor="city">City: </label>
                        <input
                            type="text"
                            name="city"
                            placeholder="Enter city here"
                        />
                    </div>
                    <div className="button-group">
                        <button
                            id="create"
                            className="btn"
                            onClick={() => {
                                handleCreate();
                                setCreate(!create);
                            }}
                        >
                            Create
                        </button>
                        <button id="edit" className="btn">
                            Save
                        </button>
                    </div>
                </div>

                <div id="list-users">
                    <table id="myTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Avatar</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>{renderUsers()}</tbody>
                    </table>
                </div>
            </div>
            {notification && (
                <div className="notification-container">
                    <div
                        className="success-message"
                        style={
                            notification === "User deleted"
                                ? {
                                      background: "red",
                                  }
                                : {
                                      background: "green",
                                  }
                        }
                    >
                        {notification}
                    </div>
                </div>
            )}
            <script
                src="https://kit.fontawesome.com/a39b26f8c2.js"
                crossOrigin="anonymous"
            ></script>
        </div>
    );
};

export default App;
