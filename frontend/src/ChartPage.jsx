import React from 'react';
import { useState, useContext } from 'react';
import { logContext } from './App';
import DateTimePicker from 'react-datetime-picker'
function RangeSelect(props) {
    const [uplim, setUpLim] = useState(props.log.BACSerStat[props.log.BACSerStat.length - 1].Time);
    const [downlim, setDownLim] = useState(props.log.BACSerStat[props.log.BACSerStat.length - 1].Time);
    return (
        <div>
            <DateTimePicker value={new Date(uplim)} onChange={(dat) => { setUpLim(dat.getTime()) }} disabled={true } />
            <DateTimePicker value={new Date(downlim)} onChange={(dat) => { setDownLim(dat.getTime()) }} />
            {uplim} {downlim}
        </div>
    );
}
function ChartPage() {
    const log = useContext(logContext);
    const [dispdata, setDispData] = useState(log);
    return (
        <div>
            <p>Hello world!</p>
            <RangeSelect log={log }/>
        </div>
    );
}

export default ChartPage;