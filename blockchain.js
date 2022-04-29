const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //NEW
    }

    calculateHash() {
        return SHA256(
            this.index
            + this.previousHash
            + this.timestamp
            + JSON.stringify(this.data)
            + this.nonce
        ).toString()
    }

    mineBlock(difficulty) {
        //this function gets the hash with a certian number of '0's prior to it. 
        //This hash will be created with the calcuateHash function 
        //while loop to run calculateHash until difficulty is met
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("new block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]; //array of blocks
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2022', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i=1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            
            if(currentBlock.hash !== this.chain[i].calculateHash()) return false;
            if(currentBlock.previousHash !== prevBlock.hash) return false;
        }
        return true;
    }
    
}


// let simpleBlockchain = new Blockchain();

// simpleBlockchain.addBlock(new Block(1, '02/01/2022', {amount: 1}));

// simpleBlockchain.addBlock(new Block(2, '03/01/2022', {amount: 2}));

// console.log(simpleBlockchain.isChainValid());
// console.log(simpleBlockchain.getLatestBlock());

let POWBlockchain = new Blockchain();
POWBlockchain.addBlock(new Block(1, '01/03/2022', { amount: 1 }));
POWBlockchain.addBlock(new Block(1, '01/04/2022', { amount: 4 }));

console.log(POWBlockchain.getLatestBlock().nonce);
console.log(POWBlockchain.getLatestBlock().hash);
console.log(POWBlockchain.getLatestBlock().previousHash);

/*
data to represent:
Timestamp
data
previous block link
current block link
*/