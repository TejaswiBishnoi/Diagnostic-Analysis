import React from 'react';
import { useState, useContext } from 'react';
import { logContext } from './App';
function rangeSelect(props) {
    co
}
function ChartPage() {
    const log = useContext(logContext);
    const [dispdata, setDispData] = useState(log);
    return (

        <p>{log.alerts[0].Time}Hello world!</p>
    );
}

export default ChartPage;