const { compileETag } = require("express/lib/utils");


function getData(req, res, next) {
    const Resp = {
        'BACNetStat': [],
        'BACSerStat': [],
        'MemStat': [],
        'EthNetStat': [],
        'ValRecStat': [],
        'StartStat': [],
        'mbus': 0,
        'error': 0,
        'success': 0,
        'alarm': 0,
        'alerts': []
    }
    var errsnc = 0;
    var latestTime = null;
    let datarr = String(req.file.buffer);
    //let data = String(req.file.buffer);
    //    let datarr = `BACnet statistics at TIME	62b1b36a
    //ALQ : totalrecordsadded = -340000768, totalrecordsdropped = 23
    //ALQ : usedrecordscount = 0, readindex = 13631488, currentindex = 13631488
    //NLQ0 : totalrecordsadded = 0, totalrecordsdropped = 0
    //NLQ0 : usedrecordscount = 0, readindex = 0, currentindex = 0
    //NLQ0 : freecount = 0, dropiam = 0 nlqloadpctlimit = 52
    //NLQ1 : totalrecordsadded = 31, totalrecordsdropped = 0
    //NLQ1 : usedrecordscount = 0, readindex = 0, currentindex = 127
    //NLQ1 : freecount = 0, dropiam = 0 nlqloadpctlimit = 26
    //NLQ2 : totalrecordsadded = 65470464, totalrecordsdropped = 351862784
    //NLQ2 : usedrecordscount = 50397184, readindex = 50397184, currentindex = 8323072
    //NLQ2 : freecount = 999, dropiam = 0 nlqloadpctlimit = 800
    //NLQ3 : totalrecordsadded = 150, totalrecordsdropped = 149
    //NLQ3 : usedrecordscount = 0, readindex = 127, currentindex = 0
    //NLQ3 : freecount = 0, dropiam = 0 nlqloadpctlimit = 120
    //Memory Usage at TIME:  62b1b36a
    // Total System Memory            :       215052 KB
    // Available System Memory        :        85724 KB
    //Mbus frame send: 0x10 0x40 0x23 0x63 0x16 	 END
    //SenCOVMessage(): Failed to send COV update to trend Object 0x5000021 error 0x6461
    //Ethernet Statistics at TIME:  62b1b36a
    //Rx_Bytes b309dc1
    //Tx_Bytes 1099a70
    //Rx_Drop 0
    //Tx_Drop 0
    //Rx_Error 0
    //Tx_Error 0
    //Rx_Packets 251ca3
    //Tx_Packets 2593d`;
    const data = datarr.split('\n');
    var i = 0;
    while (i < data.length) {
        if (data[i].match(/BACnet\sstatistics/g) != null) {
            var obj = {
                Time: null,
                data: {
                    ALQ: {

                    },
                    NLQ0: {

                    },
                    NLQ1: {

                    },
                    NLQ2: {

                    },
                    NLQ3: {

                    },
                }
            }

            obj['Time'] = parseInt(data[i].match(/\t[0-9a-z]+/g)[0], 16) * 1000;
            i++;
            console.log(data.length * 100);
            while (i < data.length) {
                console.log(69);
                let Alqs = data[i].match(/ALQ/g);

                if (Alqs == null) break;

                Alqs = data[i].match(/[a-zA-Z]+/g);
                let alqd = data[i].match(/-?[0-9]+/g);
                var j = 0;
                while (j < alqd.length) {
                    obj.data.ALQ[Alqs[j + 1]] = alqd[j];
                    j++;
                }
                i++;
            }
            while (i < data.length) {
                let Alqs = data[i].match(/NLQ0/g);
                if (Alqs == null) break;
                Alqs = data[i].match(/[a-zA-Z]+/g);
                let alqd = data[i].match(/-?[0-9]+/g);
                var j = 0;
                while (j < alqd.length) {
                    obj.data.NLQ0[Alqs[j + 1]] = alqd[j];
                    j++;
                }
                i++;
            }
            while (i < data.length) {
                let Alqs = data[i].match(/NLQ1/g);
                if (Alqs == null) break;
                Alqs = data[i].match(/[a-zA-Z]+/g);
                let alqd = data[i].match(/-?[0-9]+/g);
                console.log(JSON.stringify(alqd));
                var j = 0;
                while (j < alqd.length) {
                    obj.data.NLQ1[Alqs[j + 1]] = alqd[j];
                    j++;
                }
                i++;
            }
            while (i < data.length) {
                let Alqs = data[i].match(/NLQ2/g);
                if (Alqs == null) break;
                Alqs = data[i].match(/[a-zA-Z]+/g);
                let alqd = data[i].match(/-?[0-9]+/g);
                var j = 0;
                while (j < alqd.length) {
                    obj.data.NLQ2[Alqs[j + 1]] = alqd[j];
                    j++;
                }
                i++;
            }
            while (i < data.length) {
                let Alqs = data[i].match(/NLQ3/g);
                if (Alqs == null) break;
                Alqs = data[i].match(/[a-zA-Z]+/g);
                let alqd = data[i].match(/-?[0-9]/g);
                var j = 0;
                while (j < alqd.length) {
                    obj.data.NLQ3[Alqs[j + 1]] = alqd[j];
                    j++;
                }
                i++;
            }
            i--;
            Resp.BACNetStat.push(obj);
            latestTime = obj.Time;
        }
        else if (data[i].match(/Memory Usage at TIME/g) != null) {
            var obj = {
                Time: null,
                data: {
                    TotalMem: 0,
                    AvlMem: 0,
                }
            }
            let reg = data[i].match(/\s[0-9a-f]+/g);
            obj["Time"] = parseInt(reg[reg.length - 1], 16) * 1000;
            i++;
            obj.data.TotalMem = parseInt(data[i++].match(/[0-9]+/g)[0]);
            obj.data.AvlMem = parseInt(data[i].match(/[0-9]+/g)[0]);
            Resp.MemStat.push(obj);
            latestTime = obj.Time;
            if (obj.data.TotalMem * 0.2 >= obj.data.AvlMem) {
                Resp.alerts.push({
                    Time: obj.Time,
                    Message: "Device may run out of memory!"
                })
            }
        }
        else if (data[i].match(/Ethernet Statistics/g) != null) {
            var obj = {
                Time: null,
                data: {
                    Rx_Bytes: null,
                    Tx_Bytes: null,
                    Rx_Drop: null,
                    Tx_Drop: null,
                    Rx_Error: null,
                    Tx_Error: null,
                    Rx_Packets: null,
                    Tx_Packets: null,
                }
            }
            let regt = data[i].match(/\s[0-9a-f]+/g);
            obj["Time"] = parseInt(regt[regt.length - 1], 16) * 1000;
            var j = 0; i++;
            while (j < 8 && i < data.length) {
                let reg = data[i].match(/[0-9a-f]+/g);
                obj.data[data[i].match(/[a-z]+_[a-z]+/i)[0]] = parseInt(reg[reg.length - 1], 16);
                j++; i++;
            }
            i--;
            Resp.EthNetStat.push(obj);
            latestTime = obj.Time;
        }
        else if (data[i].match(/Mbus/g) != null) Resp.mbus++;
        else if (data[i].match(/failed/gi) != null) {
            Resp.error++; errsnc++;
            if (errsnc == 25) {
                Resp.alerts.push({
                    Time: latestTime,
                    Message: "Too many errors encountered during operation!",
                })
            }
        }
        else if (data[i].match(/success/gi) != null) Resp.success++;
        else if (data[i].match(/started now/gi) != null || data[i].match(/Device Beginning Now/gi)) {
            var obj = { Time: null }
            obj["Time"] = parseInt(data[i].match(/\s[0-9a-f]+\s/)[0], 16) * 1000;
            Resp.StartStat.push(obj);
            latestTime = obj.Time;
            errsnc = 0;
        }
        else if (data[i].match(/CheckForValidityOfRecipient\(\):/g) != null) {
            var obj = {
                Time: null,
                data: {
                    Recipientindex: null,
                    NotificationclassId: null,
                    ObjectId: null
                }
            }
            obj.Time = parseInt(data[i].match(/\s[0-9a-f]+\s/g)[0], 16) * 1000;
            obj.data.NotificationclassId = data[i].match(/\s[0-9a-f]+\s/g)[1].trim();
            obj.data.ObjectId = data[i].match(/\s[0-9a-f]+/g)[3].trim();
            obj.data.Recipientindex = 0;
            Resp.ValRecStat.push(obj);
            latestTime = obj.Time;
        }
        else if (data[i].match(/CreateAlarmEntry():objid:/) != null) Resp.alarm++;
        else if (data[i].match(/BACnet Services stats at TIME/) != null) {
            var obj = {
                Time: null,
                data: {

                }
            }
            obj.Time = parseInt(data[i].match(/\t[0-9a-f]+/g), 16) * 1000;
            i++;
            while (i < data.length) {
                if (data[i].match(/\t[0-9]+\.[0-9]+\t[0-9]+\.[0-9]/g) == null) break;
                var subobj = {
                    totalExecutionTime: parseFloat(data[i].match(/\t[0-9]+\.[0-9]+/g)[0]),
                    totalNumberOfRequests: parseFloat(data[i].match(/\t[0-9]+\.[0-9]+/g)[1]),
                    timePerRequest: parseFloat(data[i].match(/\t[0-9]+\.[0-9]+/g)[2])
                }
                obj.data[data[i].match(/[a-z]+\t/gi)[0].trim()] = subobj;
                i++;
            }
            Resp.BACSerStat.push(obj);
            i--;
            latestTime = obj.Time;
        }
        i++;
    }
    console.log(JSON.stringify(Resp));
    res.send(Resp);
}

exports.gd = getData;