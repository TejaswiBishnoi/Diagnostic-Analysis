export default function func(log, uplim, dwnlim) {
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
    Resp.mbus = log.mbus;
    Resp.error = log.error;
    Resp.success = log.success;
    Resp.alarm = log.alarm;

    var i = 0;
    while (i < log.BACNetStat.length) {
        if (log.BACNetStat[i].Time <= uplim && log.BACNetStat[i].Time >= dwnlim) {
            Resp.BACNetStat.push(log.BACNetStat[i]);
        }
        i++;
    }
    i = 0;
    while (i < log.BACSerStat.length) {
        if (log.BACSerStat[i].Time <= uplim && log.BACSerStat[i].Time >= dwnlim) {
            Resp.BACSerStat.push(log.BACSerStat[i]);
        }
        i++;
    }
    i = 0;
    while (i < log.MemStat.length) {
        if (log.MemStat[i].Time <= uplim && log.MemStat[i].Time >= dwnlim) {
            Resp.MemStat.push(log.MemStat[i]);
        }
        i++;
    }
    i = 0;
    while (i < log.EthNetStat.length) {
        if (log.EthNetStat[i].Time <= uplim && log.EthNetStat[i].Time >= dwnlim) {
            Resp.EthNetStat.push(log.EthNetStat[i]);
        }
        i++;
    }
    i = 0;
    while (i < log.ValRecStat.length) {
        if (log.ValRecStat[i].Time <= uplim && log.ValRecStat[i].Time >= dwnlim) {
            Resp.ValRecStat.push(log.ValRecStat[i]);
        }
        i++;
    }
    i = 0;
    while (i < log.StartStat.length) {
        if (log.StartStat[i].Time <= uplim && log.StartStat[i].Time >= dwnlim) {
            Resp.StartStat.push(log.StartStat[i]);
        }
        i++;
    }
    i = 0;
    while (i < log.alerts.length) {
        if (log.alerts[i].Time == null) continue;
        if (log.alerts[i].Time <= uplim && log.alerts[i].Time >= dwnlim) {
            Resp.alerts.push(log.alerts[i]);
        }
        i++;
    }
    return Resp;
}