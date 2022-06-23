//need information from the body
const fs = require("fs");
const bodyParser = require("body-parser");
//const { MAP } = require("requirejs");


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
    TESTCASE = TESTCASE.split("\n");
    TESTCASE[0] = TESTCASE[0].split(" ");
    array = TESTCASE;
    

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
                var TIME = array[i][j+1]; //the timestamp
                j = j+2; //skipping over the mentioned


                var toBe = " ";
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
                        
                        var toBe = " ";
                        for(let w = 1; w<array[k].length; w++)
                        {
                            toBe += array[k][w];
                            toBe += " ";
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

                    let str = " ";
                    for(let k = i+1; k<=i+2; k++)
                    {
                        for(let w = 1; w < array[k].length; w++)
                        {
                            str += array[k][w];
                            str += " ";
                        }
                    }
                    temp.set("ALQ", str);

                    str = " ";

                    for(let k = i+3; k<=i+5; k++)
                    {
                        for(let w = 1; w < array[k].length; w++)
                        {
                            str += array[k][w];
                            str += " ";
                        }
                    }

                    temp.set("NLQ0", str);

                    str = " ";

                    for(let k = i+6; k<=i+8; k++)
                    {
                        for(let w = 1; w < array[k].length; w++)
                        {
                            str += array[k][w];
                            str += " ";
                        }
                        
                    }

                    temp.set("NLQ1", str);

                    str = " ";

                    for(let k = i+9; k<=i+11; k++)
                    {
                        for(let w = 1; w < array[k].length; w++)
                        {
                            str += array[k][w];
                            str += " ";
                        }
                        
                    }

                    temp.set("NLQ2", str);

                    str = " ";

                    for(let k = i+12; k<=i+14; k++)
                    {
                        for(let w = 1; w < array[k].length; w++)
                        {
                            str += array[k][w];
                            str += " ";
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
                
                var timehere = parseInt(TIME, 16)*1000;
                StartingNow.push(timehere);
            }
        }
    }

    //const BacnetStatics = new makeStruct("ALQ, NLQ0, NLQ1, NLQ2, NLQ3");
    //to give -> object for ALQ, NLQ0....
    //bacnet statics -> ALQ, NLQ....

    
    var BackNETSTATICS = [];

    BACnetSTATICS.forEach (function(value, key) {
        //key -> timestamp
        //value -> string

        var arrALQ = value.ALQ.split(" ");
        var arrNLQ0 = value.NLQ0.spilt(" ");
        var arrNLQ1 = value.NLQ1.spilt(" ");
        var arrNLQ2 = value.NLQ2.spilt(" ");
        var arrNLQ3 = value.NLQ3.spilt(" ");

        const BACNETSTATICS = {
            timestamp: parseInt(key,16)*1000,
            data: {
                ALQ: {
                    totalrecordsadded: parseInt(arrALQ[3].slice(0, arrALQ[3].length-1)), 
                    totalrecordsdropped: parseInt(arrALQ[6]),
                    usedrecordscount: parseInt(arrALQ[10].slice(0, arrALQ[10].length - 1)) , 
                    readindex: parseInt(arrALQ[13].slice(0,arrALQ[13].length - 1)), 
                    currentindex : parseInt(arrALQ[16])
                },
                NLQ0: {
                    totalrecordsadded: parseInt(arrNLQ0[3].slice(0, arrNLQ0[3].length-1)), 
                    totalrecordsdropped: parseInt(arrNLQ0[6]),
                    usedrecordscount: parseInt(arrNLQ0[10].slice(0, arrNLQ0[10].length - 1)) , 
                    readindex: parseInt(arrNLQ0[13].slice(0,arrNLQ0[13].length - 1)), 
                    currentindex : parseInt(arrNLQ0[16]),
                    freecount: parseInt(arrNLQ0[20].slice(0, arrNLQ0[20].length - 1)), 
                    dropiam: parseInt(arrNLQ0[23]),
                    nlqloadpctlimit: parseInt(arrNLQ0[26])
                },
                NLQ1: {
                    totalrecordsadded: parseInt(arrNLQ1[3].slice(0, arrNLQ1[3].length-1)), 
                    totalrecordsdropped: parseInt(arrNLQ1[6]),
                    usedrecordscount: parseInt(arrNLQ1[10].slice(0, arrNLQ1[10].length - 1)) , 
                    readindex: parseInt(arrNLQ1[13].slice(0,arrNLQ1[13].length - 1)), 
                    currentindex : parseInt(arrNLQ1[16]),
                    freecount: parseInt(arrNLQ1[20].slice(0, arrNLQ1[20].length - 1)), 
                    dropiam: parseInt(arrNLQ1[23]),
                    nlqloadpctlimit: parseInt(arrNLQ1[26])
                },
                NLQ2: {
                    totalrecordsadded: parseInt(arrNLQ2[3].slice(0, arrNLQ2[3].length-1)), 
                    totalrecordsdropped: parseInt(arrNLQ2[6]),
                    usedrecordscount: parseInt(arrNLQ2[10].slice(0, arrNLQ2[10].length - 1)) , 
                    readindex: parseInt(arrNLQ2[13].slice(0,arrNLQ2[13].length - 1)), 
                    currentindex : parseInt(arrNLQ2[16]),
                    freecount: parseInt(arrNLQ2[20].slice(0, arrNLQ2[20].length - 1)), 
                    dropiam: parseInt(arrNLQ2[23]),
                    nlqloadpctlimit: parseInt(arrNLQ2[26])
                },
                NLQ3: {
                    totalrecordsadded: parseInt(arrNLQ3[3].slice(0, arrNLQ3[3].length-1)), 
                    totalrecordsdropped: parseInt(arrNLQ3[6]),
                    usedrecordscount: parseInt(arrNLQ3[10].slice(0, arrNLQ3[10].length - 1)) , 
                    readindex: parseInt(arrNLQ3[13].slice(0,arrNLQ3[13].length - 1)), 
                    currentindex : parseInt(arrNLQ3[16]),
                    freecount: parseInt(arrNLQ3[20].slice(0, arrNLQ3[20].length - 1)), 
                    dropiam: parseInt(arrNLQ3[23]),
                    nlqloadpctlimit: parseInt(arrNLQ3[26])
                },
            }
        }

        BackNETSTATICS.push(BACNETSTATICS);
        
    });

    var BackNETSERVICES = [];

    BACnetSERVICES.forEach(function (value, key){

        var arrayWHOIS = [];
        var arrayIAM = [];
        var arrayRPM = [];
        var arrayRP = [];
        var arrayRR = [];
        var arrayAlmAck = [];
        var arrayUnCOVnt = [];
        var arraygetEvSum = [];
        var arrayBADDLIST = [];
        var arrayBGETINFO = [];
        var arrayBUTCTIMSYNC = [];

        var whois = value.WHOIS.split(" ");

        for(let i = 0; i < whois.length; i++)
        {
            if(whois[i] != " ")
            {
                arrayWHOIS.push(whois[i]);
            }
        }

        var iam = value.IAM.split(" ");

        for(let i = 0; i < iam.length; i++)
        {
            if(iam[i] != " ")
            {
                arrayIAM.push(iam[i]);
            }
        }

        var rpm = value.RPM.split(" ");

        for(let i = 0; i < rpm.length; i++)
        {
            if(rpm[i] != " ")
            {
                arrayRPM.push(rpm[i]);
            }
        }

        var rr = value.RR.split(" ");

        for(let i = 0; i <rr.length; i++)
        {
            if(rr[i] != " ")
            {
                arrayRR.push(rr[i]);
            }
        }

        var rp = value.RP.split(" ");

        for(let i = 0; i < rp.length; i++)
        {
            if(rp[i] != " ")
            {
                arrayRP.push(rp[i]);
            }
        }

        var almack = value.AlmAck.split(" ");

        for(let i = 0; i < almack.length; i++)
        {
            if(almack[i] != " ")
            {
                arrayAlmAck.push(almack[i]);
            }
        }

        var uncovnt = value.UnCOVnt.split(" ");

        for(let i = 0; i < rp.length; i++)
        {
            if(uncovnt[i] != " ")
            {
                arrayUnCOVnt.push(uncovnt[i]);
            }
        }

        var getevsum = value.getEvSum.split(" ");

        for(let i = 0; i < getevsum.length; i++)
        {
            if(getevsum[i] != " ")
            {
                arraygetEvSum.push(getevsum[i]);
            }
        }

        var baddlist = value.BADDLIST.split(" ");

        for(let i = 0; i < baddlist.length; i++)
        {
            if(baddlist[i] != " ")
            {
                arrayBADDLIST.push(baddlist[i]);
            }
        }


        var bgetinfo = value.BGETINFO.split(" ");

        for(let i = 0; i < bgetinfo.length; i++)
        {
            if(bgetinfo[i] != " ")
            {
                arrayBGETINFO.push(bgetinfo[i]);
            }
        }

        var butctimsync = value.BUTCTIMSYNC.split(" ");

        for(let i = 0; i < butctimsync.length; i++)
        {
            if(butctimsync[i] != " ")
            {
                arrayBUTCTIMSYNC.push(butctimsync[i]);
            }
        }


        const BACNETSERVICES = {

            timestamp: parseInt(key, 16)*1000,

            data:{
                _WHOIS:{
                    totalExecutionTime: whois[0],
                    totalNumberOfRequests: whois[1],
                    timePerRequest: whois[2]
                },
                _IAM:{
                    totalExecutionTime: iam[0],
                    totalNumberOfRequests: iam[1],
                    timePerRequest: iam[2]
                },
                _RPM:{
                    totalExecutionTime: rpm[0],
                    totalNumberOfRequests: rpm[1],
                    timePerRequest: rpm[2]
                },
                _RP:{
                    totalExecutionTime: rp[0],
                    totalNumberOfRequests: rp[1],
                    timePerRequest: rp[2]
                }, 
                _RR:{
                    totalExecutionTime: rr[0],
                    totalNumberOfRequests: rr[1],
                    timePerRequest: rr[2]
                },
                _AlmAck:{
                    totalExecutionTime: almack[0],
                    totalNumberOfRequests: almack[1],
                    timePerRequest: almack[2]
                },
                _UnCOVnt:{
                    totalExecutionTime: uncovnt[0],
                    totalNumberOfRequests: uncovnt[1],
                    timePerRequest: uncovnt[2]
                },
                _getEvSum:{
                    totalExecutionTime: getevsum[0],
                    totalNumberOfRequests: getevsum[1],
                    timePerRequest: getevsum[2]
                },
                _BADDLIST:{
                    totalExecutionTime: baddlist[0],
                    totalNumberOfRequests: baddlist[1],
                    timePerRequest: baddlist[2]
                },
                _BGETINFO:{
                    totalExecutionTime: bgetinfo[0],
                    totalNumberOfRequests: bgetinfo[1],
                    timePerRequest: bgetinfo[2]
                },
                _BUTCTIMSYNC:{
                    totalExecutionTime: butctimsync[0],
                    totalNumberOfRequests: butctimsync[1],
                    timePerRequest: butctimsync[2]
                }

            }

        }
        BackNETSERVICES.push(BACNETSERVICES);
    });

    //const MemoryUsage = new makeStruct("TotalSystemMemory, AvailableSystemMemory");

    var MEMORY = [];
    MemoryUSAGE.forEach(function(value, key){

        const MEMORYUSAGE = {
            timestamp: parseInt(key, 16)*1000,
            data:{
                totalmemory: value.TotalSystemMemory,
                availablememory: value.AvailableSystemMemory
            }
        }

        MEMORY.push(MEMORYUSAGE);
    });

    var RECIPIENT = [];
    // it has 0, number number

    ValidityofRECIPIENT.forEach(function(value, key){

        var arrValidity = value.RecipientIndex.split(" ");

        var arrHere = [];
        var flag = 0;
        for(let i = 0; i < arrValidity.length; i++)
        {
            if(arrValidity[i] != " ")
            {
                if(flag == 0)
                {
                    //the first one has ',' in the end
                    arrHere.push(arrValidity[i].slice(0, arrValidity[i].length - 1));
                    flag = 1;
                }
                else 
                {
                    arrHere.push(arrValidity[i]);
                }
                
            }
        }
        const VALIDITYOFRECIPIENT = {
            timestamp: parseInt(key, 16)*1000,
            data:{
                Recipientindex:arrHere[0],
                NotificationclassId:arrHere[1],
                ObjectId:arrHere[2]
            }
        }

        RECIPIENT.push(VALIDITYOFRECIPIENT);
    });

    var ETHERNET = [];

    EthernetSTATICS.forEach(function(value, key){
    //const EthernetStatics = new makeStruct("Rx_Bytes, Tx_Bytes, Rx_Drop, Tx_Drop, Rx_Error, Tx_Error, Rx_Packets, Tx_Packets");
        const ETHERNETSTATICS = {
            timestamp: parseInt(key, 16)*1000,
            data:{
                rxbytes:value.Rx_Bytes,
                txbytes:value.Tx_Bytes,
                rxdrop:value.Rx_Drop,
                txdrop:value.Tx_Drop,
                rxerror:value.Rx_Error,
                txerror:value.Tx_Error,
                rxpackets:value.Rx_Packets,
                txpackets:value.Tx_Packets
            }
        }

        ETHERNET.push(ETHERNETSTATICS);
    });

    var FINALSENDING = [];

    FINALSENDING.push(BackNETSTATICS );
    FINALSENDING.push(BackNETSERVICES);
    FINALSENDING.push(MEMORY);
    FINALSENDING.push(RECIPIENT);
    FINALSENDING.push(ETHERNET);
    FINALSENDING.push(StartingNow);
    FINALSENDING.push([TotalNumberofErrors, lineNumber, TotalNumberofAlarmEntry,TotalSuccessfulAlarm,TotalMbusCalled]);

    res.send(FINALSENDING);
    
    
    
}

exports.display = displayLogFile;



