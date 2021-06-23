const server = require('socket.io')();

class Service {
  constructor(port, token) {
    this.port = port
    this.token = token;
    this.io = null;
  }

  #init(errorCallback) {
    this.io = server;
    this.io.listen(this.port);
  }

  #checkToken() {
    this.io.use((socket, next) => {
      const clientToken = socket.handshake.auth.token;
      if (clientToken == this.token) {
        next()
      } else {
        next(new Error('Connecting failed or wrong token'));
      }
    });
  }

  start({ started: startCallback, printing: printingCallback, closed: closedClientCallback, error: errorCallback }) {
    this.#init(errorCallback);
    this.io.on('error', () => console.error('Port used'))
    startCallback(this.port, this.token);
    //middleware
    this.#checkToken();
    //listen other event

    this.io.on('connection', (socket) => {
      socket.removeAllListeners()
      socket.on('printing', (data) => {
        printingCallback(data, socket);
        socket.removeAllListeners("printing");
      })
      socket.on('disconnect', () => {
        closedClientCallback(socket);
        socket.removeAllListeners("disconnect");
      })
    })
  }

  stop({ stopped: stopCallback }) {
    this.io.close();
    this.io = null;
    if (this.io == null) {
      stopCallback();
      return;
    }
    return new Error('Service failed to Stopped')
  }
}

module.exports = Service;