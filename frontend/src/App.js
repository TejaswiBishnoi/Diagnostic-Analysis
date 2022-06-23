import logo from './logo.svg';
import './App.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Button, Container, Dropdown, DropdownButton, Form, Row, co, Col } from 'react-bootstrap';
import { useState } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import axios from 'axios';

const data = [
    {
        "name": 1,
        "uv": 4000,
        "pv": 2400,
        "amt": 2400
    },
    {
        "name": 2,
        "uv": 3000,
        "pv": 1398,
        "amt": 2210
    },
    {
        "name": 4,
        "uv": 2000,
        "pv": 9800,
        "amt": 2290
    },
    {
        "name": 5,
        "uv": 2780,
        "pv": 3908,
        "amt": 2000
    },
    {
        "name": 7,
        "uv": 1890,
        "pv": 4800,
        "amt": 2181
    },
    {
        "name": 8,
        "uv": 2390,
        "pv": 3800,
        "amt": 2500
    },
    {
        "name": 11,
        "uv": 3490,
        "pv": 4300,
        "amt": 2100
    }
]

function formatXAxis(tickItem) {
    // If using moment.js
    return tickItem + "A"
}


function App() {
    //const [file, setFile] = useState(null);
    const [file, setFile] = useState(null);
    const onfileChange = event => {
        setFile(event.target.files[0]);
    }
    const onfileUpload = () => {
        const formData = new FormData();
        formData.append(
            "File",
            file,
            file.name
        );
        console.log(file);
        axios.post("/upload", formData);
    }
    const frmtr = (value) => {
        return value + 'A';
    }
    return (
        <div>
            <h1>
                GeeksforGeeks
            </h1>
            <h3>
                File Upload using React!
            </h3>
            <div>
                <input type="file" onChange={onfileChange} />
                <button onClick={onfileUpload}>
                    Upload!
                </button>
            </div>
            <LineChart width={730} height={250} data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" type="number" domain={[5, 6] } />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
        </div> 
    );
}

export default App;
