import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPen } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "antd";

const App = () => {
    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState("");
    const [create, setCreate] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState("Content of the modal");
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [title, setTitle] = useState("");
    const [action, setAction] = useState("");
    const [userIdToEdit, setUserIdToEdit] = useState("");
    const showModal = (userId, action) => {
        setUserIdToDelete(userId);
        setUserIdToEdit(userId);
        setOpen(true);
        setAction(action);
    };
    const handleOk = () => {
        setConfirmLoading(true);
        if (action === "delete") {
            deleteUser(userIdToDelete);
        } else if (action === "save") {
            editUser(userIdToEdit);
        } else if (action === "create") {
            handleCreate();
        }
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const handleCancel = () => {
        console.log("Clicked cancel button");
        setOpen(false);
    };

    useEffect(() => {
        if (action === "delete") {
            setTitle("Xoa");
            setModalText("Xoa nguoi dung nay ?");
        } else if (action === "save") {
            setTitle("Luu");
            setModalText("Luu thay doi");
        } else if (action === "create") {
            setTitle("Tao");
            setModalText("Xac nhan tao nguoi dung moi");
        }
    }, [action]);
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
                        onClick={() => {
                            setUserIdToEdit(user.id);
                            getUserToEdit(user.id);
                        }}
                    >
                        <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                        type="primary"
                        className="delete-btn"
                        onClick={() => {
                            showModal(user.id, "delete");
                        }}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <Modal
                        title={title}
                        open={open}
                        onOk={handleOk}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                        mask={false}
                    >
                        <p>{modalText}</p>
                    </Modal>
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

    const getUserToEdit = (id) => {
        scrollToTop();
        axios
            .get(`https://60becf8e6035840017c17a48.mockapi.io/users/${id}`)
            .then((res) => {
                const user = res.data;
                document.querySelector('input[name="name"]').value = user.name;
                document.querySelector('input[name="ava"]').value = user.avatar;
                document.querySelector('input[name="email"]').value =
                    user.email;
                document.querySelector('input[name="city"]').value = user.city;
            });
    };

    const editUser = (id) => {
        scrollToTop();
        console.log("Ham edit user duoc goi");
        const updatedUser = {
            name: document.querySelector('input[name="name"]').value,
            avatar: document.querySelector('input[name="ava"]').value,
            email: document.querySelector('input[name="email"]').value,
            city: document.querySelector('input[name="city"]').value,
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
                                showModal(0, "create");
                            }}
                        >
                            Create
                        </button>
                        <button
                            id="edit"
                            className="btn"
                            onClick={() => {
                                showModal(userIdToEdit, "save");
                            }}
                            style={{ display: "block" }}
                        >
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
