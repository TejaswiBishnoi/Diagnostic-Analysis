//need information from the body
const fs = require("fs");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

function makeStruct(keys) {
    if (!keys) return null;
    const k = keys.split(', ');
    const count = k.length;
  
    /** @constructor */
    function constructor() {
      for (let i = 0; i < count; i++) this[k[i]] = arguments[i];
    }
    return constructor;
}

// WHOIS	1.000000	8904.000000	0.000112
// IAM	0.000000	5100.000000	0.000000
// RPM	0.000000	28.000000	0.000000
// RP	1.000000	4.000000	0.250000
// RR	160.000000	155.000000	1.032258
// AlmAck	0.000000	642.000000	0.000000
// UnCOVnt	0.000000	1.000000	0.000000
// getEvSum	1.000000	1.000000	1.000000
// BADDLIST	0.000000	4.000000	0.000000
// BGETINFO	0.000000	1.000000	0.000000
// BUTCTIMSYNC
const BACnetServices = new makeStruct("WHOIS, IAM, RPM, RP, RR, AlmAck, UnCOVnt, getEvSum,BADDLIST, BGETINFO, BUTCTIMSYNC, MbusFrame");

const EthernetStatics = new makeStruct("Rx_Bytes, Tx_Bytes, Rx_Drop, Tx_Drop, Rx_Error, Tx_Error, Rx_Packets, Tx_Packets");

// ALQ : totalrecordsadded = 1167785984, totalrecordsdropped = 0
// ALQ : usedrecordscount = 0, readindex = 24576000, currentindex = 24576000
// NLQ0 : totalrecordsadded = 0, totalrecordsdropped = 0
// NLQ0 : usedrecordscount = 0, readindex = 0, currentindex = 0
// NLQ0 : freecount = 0, dropiam = 0 nlqloadpctlimit = 52
// NLQ1 : totalrecordsadded = 31, totalrecordsdropped = 0
// NLQ1 : usedrecordscount = 0, readindex = 0, currentindex = 127
// NLQ1 : freecount = 0, dropiam = 0 nlqloadpctlimit = 26
// NLQ2 : totalrecordsadded = 65470464, totalrecordsdropped = 1179516928
// NLQ2 : usedrecordscount = 65404928, readindex = 65404928, currentindex = 8323072
// NLQ2 : freecount = 999, dropiam = 0 nlqloadpctlimit = 800
// NLQ3 : totalrecordsadded = 150, totalrecordsdropped = 149
// NLQ3 : usedrecordscount = 0, readindex = 127, currentindex = 0
// NLQ3 : freecount = 0, dropiam = 0 nlqloadpctlimit = 120

const BacnetStatics = new makeStruct("ALQ, NLQ0, NLQ1, NLQ2, NLQ3");

const MemoryUsage = new makeStruct("TotalSystemMemory, AvailableSystemMemory");

const CheckForValidityOfRecipient = new makeStruct("RecipientIndex");

function displayLogFile(req, res)
{
    var array;

    fs.readFile(req.body.file, "utf8", (err, data) => {
        if(err) throw err;
            array = data.toString().split("\n");
        
        for(i in array) {
            console.log(array[i]);  //debugging
            array[i].split(" ");
            }
    });
    
    const ErrorFreuency = new Map();

    var lineNumber = 0;

    for(i in array)
    {
        line = line + 1;
        for(j in array[i])
        {

        }
    }
    
}







