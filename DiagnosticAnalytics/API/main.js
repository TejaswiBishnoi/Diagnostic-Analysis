//need information from the body
const fs = require("fs");
const bodyParser = require("body-parser");
const { MAP } = require("requirejs");

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

let TESTCASE = "CheckForValidityOfRecipient(): 62b2c066 RecipientIndex= 0, 3c00001  20971522";

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
const BACnetServices = new makeStruct("WHOIS, IAM, RPM, RP, RR, AlmAck, UnCOVnt, getEvSum,BADDLIST, BGETINFO, BUTCTIMSYNC");

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

    // fs.readFile(req.body.file, "utf8", (err, data) => {
    //     if(err) throw err;
    //         array = data.toString().split("\n");
        
    //     for(i in array) {
    //         console.log(array[i]);  //debugging
    //         array[i].split(" ");
    //         }
    // });

    array = TESTCASE.split(" ");
    

    var TotalNumberofErrors = 0;
    var lineNumber = 0;
    var TotalNumberofAlarmEntry = 0;
    var TotalSuccessfulAlarm = 0;
    var TotalMbusCalled = 0;


    const BACnetSERVICES = new Map();
    const BACnetSTATICS = new Map();
    const MemoryUSAGE = new Map();
    const ValidityofRECIPIENT = new Map();
    const EthernetSTATICS = new Map();
    const StartingNow = [];
    
    


    for(let i = 0; i< array.length; i++)
    {
        lineNumber = lineNumber + 1;

        for(let j = 0; j< array[i].length; j++)
        {
            if(array[i][j] === "CreateAlarmEntry():objid:")
            {
                TotalNumberofAlarmEntry = TotalNumberofAlarmEntry + 1;
            }
            if(array[i][j] === "SenCOVMessage():")
            {
                TotalNumberofErrors = TotalNumberofErrors + 1;
            }
            if(array[i][j] === "CheckForValidityOfRecipient():")
            {
                var TIME = array[i][j+1] //the timestamp
                j = j+2; //skipping over the mentioned


                var toBe = "";
                for(let k = j; k< array[i].length; k++)
                {
                    toBe = toBe + array[i][k];
                }

                const here = new CheckForValidityOfRecipient(toBe);

                ValidityofRECIPIENT.set(TIME, here);
            }

            if(array[i][j] === "CheckForValidityOfRecipient():Sent")
            {
                TotalSuccessfulAlarm = TotalSuccessfulAlarm + 1;
            }

            if(array[i][j] === "Mbus")
            {
                TotalMbusCalled = TotalMbusCalled + 1;
            }

            if(array[i][j] === "BACnet")
            {
                if(array[i][j+1] === "Services")
                {
                    
                    var TIME = "";

                    for(let b = 5; b < array[array[i].length - 1]; b++)
                    {
                        TIME += array[array[i].length -1][b];
                    }

                    let k = i;
                    
                    const temp = new Map();

                    for(k = i; k <= i+10; k++)
                    {
                        var key = array[k][0];
                        
                        var toBe = "";
                        for(let w = 1; w<array[k].length; w++)
                        {
                            toBe += array[k][w];
                        }
                        temp.set(key, toBe);
                    }
                    //const BACnetServices = new makeStruct("WHOIS, IAM, RPM, RP, RR, AlmAck, UnCOVnt, getEvSum,BADDLIST, BGETINFO, BUTCTIMSYNC");
                    const here = new BACnetServices(temp.get("WHOIS"), temp.get("IAM"), temp.get("RPM"), temp.get("RP"), temp.get("RR"), temp.get("AlmAck"), temp.get("UnCOVnt"), temp.get("getEvSum"), temp.get("BADDLIST"), temp.get("BGETINFO"), temp.get("BUTCTIMSYNC"));

                    BACnetSERVICES.set(TIME, here);

                }
                if(array[i][j+1] === "statistics")
                {
                    var lastWord = array[i].length - 1;
                    var TIME = "";

                    var lengthOfLastWord = array[i][lastWord].length ;

                    for(let k = 5; k<lengthOfLastWord; ++k)
                    {
                        TIME += array[lastWord][k];
                    }

                    //i+1, i+2 -> ALQ
                    //after that, each three lines has NLQ0, NLQ1, NLQ2

                    const temp = new Map();

                    let str = "";
                    for(let k = i+1; k<=i+2; k++)
                    {
                        for(let w = 1; w < array[k].length; w++)
                        {
                            str += array[k][w];
                        }
                    }
                    temp.set("ALQ", str);

                    str = "";

                    for(let k = i+3; k<=i+5; k++)
                    {
                        for(let w = 1; w < array[k].length; w++)
                        {
                            str += array[k][w];
                        }
                    }

                    temp.set("NLQ0", str);

                    str = "";

                    for(let k = i+6; k<=i+8; k++)
                    {
                        for(let w = 1; w < array[k].length; w++)
                        {
                            str += array[k][w];
                        }
                    }

                    temp.set("NLQ1", str);

                    str = "";

                    for(let k = i+9; k<=i+11; k++)
                    {
                        for(let w = 1; w < array[k].length; w++)
                        {
                            str += array[k][w];
                        }
                    }

                    temp.set("NLQ2", str);

                    str = "";

                    for(let k = i+12; k<=i+14; k++)
                    {
                        for(let w = 1; w < array[k].length; w++)
                        {
                            str += array[k][w];
                        }
                    }

                    temp.set("NLQ3", str);

                    const here = new BacnetStatics(temp.get("ALQ"), temp.get("NLQ0"), temp.get("NLQ1"), temp.get("NLQ2"), temp.get("NLQ3"));
                    
                    BACnetSTATICS.set(TIME, here);
                    //const BacnetStatics = new makeStruct("ALQ, NLQ0, NLQ1, NLQ2, NLQ3");

                }
            }

            if(array[i][0] === "Ethernet")
            {
                var TIME = array[i][arr[i].length - 1];
                //const EthernetStatics = new makeStruct("Rx_Bytes, Tx_Bytes, Rx_Drop, Tx_Drop, Rx_Error, Tx_Error, Rx_Packets, Tx_Packets");
                var RxBytes = array[i+1][1];
                var TxBytes = array[i+2][1];
                var RxDrop = array[i+3][1];
                var TxDrop = array[i+4][1];
                var RxError = array[i+5][1];
                var TxError = array[i+6][1];
                var RxPackets = array[i+7][1];
                var TxPackets = array[i+8][1];

                const here = new EthernetStatics(RxBytes, TxBytes, RxDrop, TxDrop, RxError, TxError, RxPackets, TxPackets);

                EthernetSTATICS.set(TIME, here);

            }

            if(array[i][0] === "Memory")
            {
                var TIME = array[i][array[i].length -1];

                var TotalMemory = array[i+1][array[i+1].length - 2];
                var AvailableMemory = array[i+2][array[i+2].length - 2];

                const here = new MemoryUsage(TotalMemory, AvailableMemory);

                MemoryUSAGE.set(TIME, here);
            }

            if(array[i][0] === "*********")
            {
                var TIME = array[i][array[i].length - 2];
                
                StartingNow.push(TIME);
            }
        }
    }
    
}







