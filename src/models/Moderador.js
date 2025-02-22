const DatabaseManager = require('./DatabaseManager');

class Moderador {
    constructor() {
        this.dbShop = new DatabaseManager('data/shop.json');
        this.dbEconomy = new DatabaseManager('data/economy.json');
        this.economy = this.dbEconomy.data;
        this.shopItems = this.dbShop.data;
    }

    save() {
        this.dbShop.saveData();
        this.dbEconomy.saveData();
    }

    addItemToUser(userId, itemId, amount) {
        const user = this.economy[userId] || { inventory: {} };
        user.inventory[itemId] = (user.inventory[itemId] || 0) + amount;
        this.economy[userId] = user;
        this.save();
    }

    removeItemFromUser(userId, itemId, amount) {
        const user = this.economy[userId] || { inventory: {} };
        user.inventory[itemId] = Math.max((user.inventory[itemId] || 0) - amount, 0);
        this.economy[userId] = user;
        this.save();
    }

    addMoneyToUser(userId, amount, type) {
        const user = this.economy[userId] || { wallet: 0, bank: 0 };
        if (type === 'wallet') {
            user.wallet += amount;
        } else if (type === 'bank') {
            user.bank += amount;
        }
        this.economy[userId] = user;
        this.save();
    }

    removeMoneyFromUser(userId, amount, type) {
        const user = this.economy[userId] || { wallet: 0, bank: 0 };
        if (type === 'wallet') {
            user.wallet = Math.max(user.wallet - amount, 0);
        } else if (type === 'bank') {
            user.bank = Math.max(user.bank - amount, 0);
        }
        this.economy[userId] = user;
        this.save();
    }



}

module.exports = Moderador;