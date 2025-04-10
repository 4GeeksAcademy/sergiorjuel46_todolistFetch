import React, { useEffect, useState } from "react";

const API_URL = "https://playground.4geeks.com/todo";
const USERNAME = "sergio";

const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [todos, setTodos] = useState([]);


	const createUser = async () => {
		try {
			   
			const checkRes = await fetch(`${API_URL}/users/${USERNAME}`, {
			method: "GET",
			});
	
			if (checkRes.status === 404) {
		
			const createRes = await fetch(`${API_URL}/users/${USERNAME}`, {
				method: "POST",
				body: JSON.stringify({}),
				headers: { "Content-Type": "application/json" },
			});
	
			if (!createRes.ok) {
				throw new Error(`Error creando usuario: ${createRes.status}`);
			}
			} else if (!checkRes.ok) {
		
			throw new Error(`Error verificando usuario: ${checkRes.status}`);
			}
	
			loadTasks();
		} catch (error) {
			console.error("Error en createUser:", error);
		}
		};

	
	const loadTasks = async () => {
		try {
			const res = await fetch(`${API_URL}/users/${USERNAME}`);
			
			if (res.ok) {
				const data = await res.json();
				
				setTodos(data.todos || []);
			}
		} catch (error) {
			console.error("Error loading tasks:", error);
		}
	};


	const addTask = async (label) => {
		const task = { label, is_done: false };
		try {
			const res = await fetch(`${API_URL}/todos/${USERNAME}`, {
				method: "POST",
				body: JSON.stringify(task),
				headers: { "Content-Type": "application/json" },
			});
			if (res.ok) loadTasks();
		} catch (error) {
			console.error("Error adding task:", error);
		}
	};

	
	const deleteTask = async (id) => {
		try {
			const res = await fetch(`${API_URL}/todos/${id}`, {
				method: "DELETE",
			});
			if (res.ok) loadTasks();
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	};

	
	const clearAllTasks = async () => {
		try {
			const res = await fetch(`${API_URL}/users/${USERNAME}`, {
				method: "DELETE",
			});
			if (res.ok) setTodos([]);
		} catch (error) {
			console.error("Error clearing all tasks:", error);
		}
	};

	useEffect(() => {
		createUser();
	}, []);

	return (
		<div className="titulo">
			<h1>todos</h1>
			<div className="container">
				<ul>
					<li>
						<input
							type="text"
							onChange={(e) => setInputValue(e.target.value)}
							value={inputValue}
							onKeyDown={(e) => {
								if (e.key === "Enter" && inputValue.trim() !== "") {
									addTask(inputValue.trim());
									setInputValue("");
								}
							}}
							placeholder="What do you need to do?"
						/>
					</li>
					{todos.map((item) => (
						<li key={item.id}>
							{item.label}
							<button onClick={() => deleteTask(item.id)}>
								<i className="fa-solid fa-trash"></i>
							</button>
						</li>
					))}
				</ul>

				<div className="todos-counter">
					{todos.length === 0
						? "No hay tareas, agrega una!"
						: `${todos.length} items left`}
				</div>

				{todos.length > 0 && (
					<button className="clear-btn" onClick={clearAllTasks}>
						Clear All Tasks
					</button>
				)}
			</div>
		</div>
	);
};

export default Home;
