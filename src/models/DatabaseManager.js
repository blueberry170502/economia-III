const fs = require('fs');

class DatabaseManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = this.loadData();
    }

    loadData() {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify({}));
        }
        return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    }

    saveData() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    }

    getUserData(userId) {
        if (!this.data[userId]) {
            this.data[userId] = { wallet: 0, bank: 0, inventory: {} };
        }
        return this.data[userId];
    }
}

module.exports = DatabaseManager;
