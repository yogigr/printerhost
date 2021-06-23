let $ = require('jquery');
require('popper.js');
require('bootstrap');
const Config = require('./../lib/Config.js');
const Printer = require('./../lib/Printer.js');
const Service = require('./../lib/Service.js');

let config = new Config();

const printer = new Printer();
const printerName = printer.getDefaultPrinterName();

let service = null

let logs = [];

//element
const inputPort = document.getElementById('input-port')
const inputToken = document.getElementById('input-token');
const saveConfigBtn = document.getElementById('save-config-btn');

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const testPrintBtn = document.getElementById('test-print-btn');

const logWrapper = document.getElementById('logWrapper');

//methods
const replaceInput = (selector, value) => {
    const element = document.getElementById(selector)
    if(element) element.value = value
}

const pushLogs = (msg) => {
    var d = new Date();
    content = '['+d.toLocaleTimeString()+'] '+msg;
    logs.push(content);
}

const displayLogs = () => {
    content = ''
    logs.forEach(e => {
        content += e + '\n';
    });

    logWrapper.value = content
    logWrapper.scrollTop = logWrapper.scrollHeight;
}

const onServiceStarted = (msg) => {
    pushLogs(msg)
    displayLogs()
    //disable update config
    saveConfigBtn.setAttribute('disabled', true)
    //enable stop btn
    stopBtn.removeAttribute('disabled')
    //disabled start button
    startBtn.setAttribute('disabled', true)

    inputPort.setAttribute('disabled', true)
    inputToken.setAttribute('disabled', true)
}

const onServiceStopped = (msg) => {
    pushLogs(msg)
    displayLogs()
    //enable update config
    saveConfigBtn.removeAttribute('disabled')
    //disable stop btn
    stopBtn.setAttribute('disabled', true)
    //enable start button
    startBtn.removeAttribute('disabled')
    inputPort.removeAttribute('disabled')
    inputToken.removeAttribute('disabled')
}

const onPrinting = (msg, data) => {
    printer.print(data, printerName, {
        success: (jobId) => {
            pushLogs(msg+jobId)
            displayLogs();
        },
        error: (err) => {
            console.log(err)
        }
    })
}

//init
window.addEventListener('DOMContentLoaded', () => {
    replaceInput('input-port', config.data.port)
    replaceInput('input-token', config.data.token)
    replaceInput('default-printer', printerName)

    stopBtn.setAttribute('disabled', true)
})

//update config
saveConfigBtn.addEventListener('click', () => {
    config.update({
        data: {
            port: document.getElementById('input-port').value,
            token: document.getElementById('input-token').value
        },
        success: (data) => {
            replaceInput('input-port', data.port)
            replaceInput('input-token', data.token)
            pushLogs('config saved, port: '+data.port+', token: '+data.token)
            displayLogs()
        },
        error: (err) => {
            console.log(error)
        }
    })
});

//if click start button
startBtn.addEventListener('click', () => {
    service = new Service(config.data.port, config.data.token);
    service.start({
        started: (port, token) => {
            onServiceStarted('service started: port '+port+', token '+token)
        },
        printing: (data, socket) => {
            onPrinting('client '+socket.id+' printing, with jobId: ', data)
        },
        closed(socket) {
            pushLogs('client ' + socket.id+' closed')
            displayLogs()
        },
        error: (err) => {
            console.log(err)
        }
    })
})

//if click stop button
stopBtn.addEventListener('click', () => {
    if (service != null) {
        service.stop({
            stopped: () => {
                service = null
                onServiceStopped('Service Stopped')
            }
        })
    }
})

//if test print btn click
testPrintBtn.addEventListener('click', () => {
    printer.print('Test Printing', printerName, {
        success: (jobId) => {
            pushLogs('Test Printing jobId: '+jobId)
            displayLogs()
        },
        error: (err) => {
            console.log(err)
        }
    })
})