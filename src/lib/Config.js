const fs = require('fs');
const path = require("path");

class Config {
    constructor() {
        this.filename = path.resolve(__dirname, "../../config.json");
        this.data = this.get();
    }

    get() {
        try {
            const jsonString = fs.readFileSync(this.filename);
            return JSON.parse(jsonString);
        } catch (error) {
           return null
        }
    }

    update({data, success: successCb, error: errorCb}) {
        fs.writeFile(this.filename, JSON.stringify(data), (err) => {
            if (err) {
                errorCb(err)
            } else {
                this.data = this.get()
                successCb(this.data)
            }
        })
    }
}

module.exports = Config;