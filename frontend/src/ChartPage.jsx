import React from 'react';
import { useState, useContext } from 'react';
import { logContext } from './App';
import DateTimePicker from 'react-datetime-picker'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import func from './file';
import axios from 'axios';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

function AlertDisplay(props) {
    
}

function FileSelect(props) {
    const [file, setFile] = useState(null);
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
        axios.post("http://localhost:5000/ab", formData).then((response) => { props.setLog(response.data); console.log(response.data) }).catch(function (error) {
            console.log(error);
        });;
    }
    return (
        <div>
            <h3>
                Please Upload the Log file
            </h3>
            <div>
                <input type="file" onChange={onfileChange} />
                <Button onClick={onfileUpload} disabled={file == null} varint="primary" >
                    Upload
                </Button>
            </div>

        </div>
    );
}

function RangeSelect(props) {
    const [uplim, setUpLim] = useState(props.log.BACSerStat[props.log.BACSerStat.length - 1].Time);
    const [downlim, setDownLim] = useState(props.log.BACSerStat[props.log.BACSerStat.length - 1].Time);
    const [limiten, setLimitEn] = useState(false);
    const CheckHandler = () => {
        setLimitEn(!limiten);
    }
    const clickHandler = () => {
        if (!limiten) props.setDispData(props.log);
        else {
            props.setDispData(func(props.log, uplim, downlim));
        }
    }
    return (
        <div>
            <h4>Please select the Time filter</h4>
            <Form><Form.Check type="switch" label="No Filter" checked={!limiten} onClick={CheckHandler}></Form.Check></Form>
            Please choose the lower limit Time:<br />
            <DateTimePicker value={new Date(downlim)} onChange={(dat) => { setDownLim(dat.getTime()) }} disabled={!limiten} className="mb-2 mt-1" /> <br />
            Please choose the upper limit Time:<br />
            <DateTimePicker value={new Date(uplim)} onChange={(dat) => { setUpLim(dat.getTime()) }} disabled={!limiten} className="mt-1" /><br />
            <Button variant="primary" onClick={clickHandler} className="mt-2"> Apply</Button>
        </div>
    );
}
function ChartPage(props) {
    const log = useContext(logContext);
    const [dispdata, setDispData] = useState(log);
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col>
                        <RangeSelect log={log} setDispData={setDispData} />
                    </Col>
                    <Col>
                        <FileSelect setLog={props.changelog} />
                    </Col>
                </Row>
            </Container>
            
        </div>
    );
}

export default ChartPage;