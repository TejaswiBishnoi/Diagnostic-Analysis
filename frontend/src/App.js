import logo from './logo.svg';
import './App.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Button, Container, Dropdown, DropdownButton, Form, Row, co, Col } from 'react-bootstrap';
import { useState } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const series = [
    {
        name: 'Series 1',
        data: [
            { category: 'A', value: Math.random() },
            { category: 'B', value: Math.random() },
            { category: 'C', value: Math.random() },
        ],
    },
    {
        name: 'Series 2',
        data: [
            { category: 'A', value: Math.random() },
            { category: 'C', value: Math.random() },
            { category: 'D', value: Math.random() },
        ],
    },
    {
        name: 'Series 3',
        data: [
            { category: 'C', value: Math.random() },
            { category: 'D', value: Math.random() },
            { category: 'E', value: Math.random() },
        ],
    },
];

const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }, { name: 'Page A', uv: 40, pv: 2400, amt: 2400 }];
function App() {
    //const [file, setFile] = useState(null);
    const [widt, setWidt] = useState("100%")
    return (
        <Container fluid>
            <Row>
                
            </Row>
        </Container>
    );
}

export default App;
