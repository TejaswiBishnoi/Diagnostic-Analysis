import React from 'react';
import { useState, useContext } from 'react';
import { logContext } from './App';
import DateTimePicker from 'react-datetime-picker'
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import func from './file';
import axios from 'axios';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, BarChart, Area, AreaChart } from 'recharts';

const LabelFormatter = (lbl) => {
    const d = new Date(lbl);
    const s = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    return (s);
}

function AlertDisplay(props) {
    const item = [];
    var i = 0;
    while (i < props.dispdata.alerts.length) {
        
        const timedata = new Date(props.dispdata.alerts[i].Time);
        var str = 'Time: ' + timedata.getHours() + ':' + timedata.getMinutes() + ':' + timedata.getSeconds() + '|' + 'Message: ' + props.dispdata.alerts[i].Message;
        item.push(
            <Alert variant="warning" className="mr-5"> {str} </Alert>
        )
        i++;
    }
    return (
        <div>
            <h4 className="mt-3">Alerts:</h4> 
            {item}
        </div>
    );
}

function GlobalParam(props) {
    return (
        <div>
            <h4> Global Parameters</h4>
            <br />
            Total Mbus calls : {props.dispdata.mbus} <br/>
            Total Errors     : {props.dispdata.error}<br />
            Total Alarm calls: {props.dispdata.alarm}<br />
            Successful calls : {props.dispdata.success}<br />
            Total Alerts     : {props.dispdata.alerts.length}<br/>
            Total Restarts   : {props.dispdata.StartStat.length}
        </div>
        )
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
                Choose Another file
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
    const [downlim, setDownLim] = useState(props.log.BACSerStat[0].Time);
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
                <Row>
                    <Col>
                        <AlertDisplay dispdata={dispdata} />
                    </Col>
                    <Col><GlobalParam dispdata={dispdata}/></Col>
                </Row>
                <Row>
                    <Col>
                        <h4>Memory stat chart</h4>
                        <LineChart width={730} height={250} data={dispdata.MemStat}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Time" tickFormatter={LabelFormatter} />
                            <YAxis />
                            <Tooltip labelFormatter={LabelFormatter} />
                            <Legend />
                            <Line type="monotone" dataKey="data.TotalMem" stroke="#8884d8" />
                            <Line type="monotone" dataKey="data.AvlMem" stroke="#82ca9d" />
                        </LineChart>
                    </Col><Col>
                        <h4>Ethernet stat chart</h4>
                        <LineChart width={730} height={250} data={dispdata.EthNetStat}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Time" tickFormatter={LabelFormatter} />
                            <YAxis />
                            <Tooltip labelFormatter={LabelFormatter} />
                            <Legend />
                            <Line type="monotone" dataKey="data.Rx_Bytes" stroke="#8884d8" />
                            <Line type="monotone" dataKey="data.Rx_Packets" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="data.Tx_Bytes" stroke="#762025" />
                            <Line type="monotone" dataKey="data.Tx_Packets" stroke="#ddaf9d" />
                        </LineChart>
                    </Col>
                </Row><Row >
                    <Col>
                        <h4>BACNet stats - ALQ</h4>
                        <LineChart width={730} height={250} data={dispdata.BACNetStat}
                            margin={{ top: 5, right: 35, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Time" tickFormatter={LabelFormatter} />
                            <YAxis type="number" domain={[-1899429888, 2032074752] } />
                            <Tooltip labelFormatter={LabelFormatter} />
                            <Legend />
                            <Line type="monotone" dataKey="data.ALQ.totalrecordsadded" stroke="#8884d8" />
                            <Line type="monotone" dataKey="data.ALQ.totalrecordsdropped" stroke="#82ca9d" />
                        </LineChart>
                    </Col><Col>
                        <h4>BACNet stats - NLQ0</h4>
                        <LineChart width={730} height={250} data={dispdata.BACNetStat}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Time" tickFormatter={LabelFormatter} />
                            <YAxis />
                            <Tooltip labelFormatter={LabelFormatter} />
                            <Legend />
                            <Line type="monotone" dataKey="data.NLQ0.totalrecordsadded" stroke="#8884d8" />
                            <Line type="monotone" dataKey="data.NLQ0.totalrecordsdropped" stroke="#82ca9d" />
                        </LineChart>
                    </Col>
                </Row><Row>
                    <Col>
                        <h4>BACNet stats - NLQ1</h4>
                        <LineChart width={730} height={250} data={dispdata.BACNetStat}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Time" tickFormatter={LabelFormatter} />
                            <YAxis/>
                            <Tooltip labelFormatter={LabelFormatter} />
                            <Legend />
                            <Line type="monotone" dataKey="data.NLQ1.totalrecordsadded" stroke="#8884d8" />
                            <Line type="monotone" dataKey="data.NLQ1.totalrecordsdropped" stroke="#82ca9d" />
                        </LineChart>
                    </Col><Col>
                        <h4>BACNet stats - NLQ2</h4>
                        <LineChart width={730} height={250} data={dispdata.BACNetStat}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Time" tickFormatter={LabelFormatter} />
                            <YAxis />
                            <Tooltip labelFormatter={LabelFormatter} />
                            <Legend />
                            <Line type="monotone" dataKey="data.NLQ2.totalrecordsadded" stroke="#8884d8" />
                            <Line type="monotone" dataKey="data.NLQ2.totalrecordsdropped" stroke="#82ca9d" />
                        </LineChart>
                    </Col>
                </Row><Row>
                    <Col>
                        <h4>BACNet stats - NLQ3</h4>
                        <LineChart width={730} height={250} data={dispdata.BACNetStat}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Time" tickFormatter={LabelFormatter} />
                            <YAxis/>
                            <Tooltip labelFormatter={LabelFormatter} />
                            <Legend />
                            <Line type="monotone" dataKey="data.NLQ3.totalrecordsadded" stroke="#8884d8" />
                            <Line type="monotone" dataKey="data.NLQ3.totalrecordsdropped" stroke="#82ca9d" />
                        </LineChart>
                    </Col><Col>
                        <h4>BACNet service stats - Total No of requests</h4>
                        <LineChart width={730} height={350} data={dispdata.BACSerStat}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Time" tickFormatter={LabelFormatter} />
                            <YAxis />
                            <Tooltip labelFormatter={LabelFormatter} />
                            <Legend />
                            <Line type="monotone" dataKey="data.WHOIS.totalNumberOfRequests" stroke="#8884d8" />
                            <Line type="monotone" dataKey="data.IAM.totalNumberOfRequests" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="data.RPM.totalNumberOfRequests" stroke="#762025" />
                            <Line type="monotone" dataKey="data.RP.totalNumberOfRequests" stroke="#ddaf9d" />
                            <Line type="monotone" dataKey="data.RR.totalNumberOfRequests" stroke="#ffa223" />
                            <Line type="monotone" dataKey="data.BUTCTIMSYNC.totalNumberOfRequests" stroke="#a2ff23" />
                        </LineChart>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h4 align="center">Ethernet Recived and Transmitted Packet comparision</h4> 
                        <BarChart width={730} height={250} data={dispdata.EthNetStat}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Time" tickFormatter={LabelFormatter} />
                            <YAxis />
                            <Tooltip labelFormatter={LabelFormatter} />
                            <Legend />
                            <Bar dataKey="data.Rx_Packets" fill="#8884d8" />
                            <Bar dataKey="data.Tx_Packets" fill="#82ca9d" />
                        </BarChart>
                    </Col>
                    <Col>
                        <h4 align="center">Area Chart of memory stats to give an idea about used memory</h4> 
                        <AreaChart width={730} height={250} data={dispdata.MemStat}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="Time" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="data.TotalMem" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                            <Area type="monotone" dataKey="data.AvlMem" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                        </AreaChart>
                    </Col>
                </Row>
            </Container>
            
        </div>
    );
}

export default ChartPage;