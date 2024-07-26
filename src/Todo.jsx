import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastContainer } from 'react-bootstrap';

export const Todo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null);

    // For editing
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "https://todo-app-server-mern.onrender.com";

    const handleSubmit = () => {
        setError("");
        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully");
                    setTimeout(() => setMessage(""), 2000);
                } else {
                    setError("Unable to add ToDo item");
                }
            }).catch(() => setError("Unable to add ToDo item"));
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos").then((res) => res.json())
            .then((res) => setTodos(res.todos));
    };

    const handleEdit = (todo) => {
        setEditId(todo._id);
        setEditTitle(todo.title);
        setEditDescription(todo.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    const updatedTodos = todos.map((todo) =>
                        todo._id === editId ? { ...todo, title: editTitle, description: editDescription } : todo
                    );
                    setTodos(updatedTodos);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated successfully");
                    setTimeout(() => setMessage(""), 2000);
                    setEditId(null);
                } else {
                    setError("Unable to edit ToDo item");
                }
            }).catch(() => setError("Unable to edit ToDo item"));
        }
    };

    const handleCancelClick = () => {
        setEditId(null);
        setEditTitle("");
        setEditDescription("");
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            fetch(apiUrl + '/todos/' + id, {
                method: "DELETE"
            }).then(() => {
                const filterTodos = todos.filter((todo) => todo._id !== id);
                setTodos(filterTodos);
            });
        }
    };

    return (
        <>
            <div className='container mt-4'>
                <div className='row mb-4'>
                    <div className='col text-center'>
                        <h1 className='display-4'>Todo App</h1>
                    </div>
                </div>
                <div className='row mb-4'>
                    <div className='col-md-8 mx-auto'>
                        <h3 className='mb-3'>Add Item</h3>
                        {message && <ToastContainer>
                            <Toast>
                                <Toast.Body className='text-success'>{message}</Toast.Body>
                            </Toast>
                        </ToastContainer>}
                        {error && <ToastContainer>
                            <Toast>
                                <Toast.Body className='text-danger'>{error}</Toast.Body>
                            </Toast>
                        </ToastContainer>}
                        <div className='form-group'>
                            <input className='form-control mb-2' type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} name='title' />
                            <input className='form-control mb-2' type="text" placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} name='description' />
                            <button className='btn btn-success w-100' onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8 mx-auto'>
                        <h3 className='mb-3'>Tasks</h3>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todos.map((todo) => (
                                    <tr key={todo._id}>
                                        <td>
                                            {editId === todo._id ? (
                                                <input className='form-control' type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                            ) : (
                                                todo.title
                                            )}
                                        </td>
                                        <td>
                                            {editId === todo._id ? (
                                                <input className='form-control' type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                            ) : (
                                                todo.description
                                            )}
                                        </td>
                                        <td>
                                            {editId === todo._id ? (
                                                <>
                                                    <button className='btn btn-warning me-2' onClick={handleUpdate}>Update</button>
                                                    <button className='btn btn-secondary' onClick={handleCancelClick}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className='btn btn-warning me-2' onClick={() => handleEdit(todo)}>Edit</button>
                                                    <button className='btn btn-danger' onClick={() => handleDelete(todo._id)}>Delete</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};
