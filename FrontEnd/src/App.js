import logo from './logo.svg';
import './App.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Button, Container, Dropdown, DropdownButton, Form, Row, co, Col } from 'react-bootstrap';
import { useState, createContext, useContext } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import axios from 'axios';
import ChartPage from './ChartPage'

export const logContext = createContext({});

function formatXAxis(tickItem) {
    // If using moment.js
    return tickItem + "A"
}

function test(resp) {
    console.log(resp);
}

function App() {
    //const [file, setFile] = useState(null);
    const [file, setFile] = useState(null);
    const [log, setLog] = useState(null);
    const onfileChange = event => {
        setFile(event.target.files[0]);
    }
    const onfileUpload = () => {
        const formData = new FormData();
        formData.append(
            "file",
            file,
            file.name
        );
        console.log(file);
        axios.post("https://Diagnostic-Analysis.tejaswibishnoi.repl.co/ab", formData).then((response) => { setLog(response.data) }).catch(function (error) {
            console.log(error);
        });;
    }
    const frmtr = (value) => {
        return value + 'A';
    }
    if (log == null) {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <div className="text-center mt-5">
                            <h3>
                                DIAGNOSTIC ANALYTICS FOR AN EMBEDDED DEVICE
                            </h3>
                            
                            <div className='mt-5'>
                                To continue please select a log file and submit it for processing. 
                            </div>

                            <div className='mt-5'>
                                <input type="file" onChange={onfileChange} /><br />
                                
                                <Button onClick={onfileUpload} disabled={file == null} variant="primary" >
                                    Upload
                                </Button>
                            </div>

                        </div>
                    </Col>
                </Row>
                
            </Container>

        );
    }
    else {
        return (
            <logContext.Provider value={log}>
                <ChartPage changelog={setLog} />
            </logContext.Provider>
        );
    }
}

export default App;
