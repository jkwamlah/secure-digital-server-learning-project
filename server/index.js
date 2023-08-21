const {secp256k1: secp} = require("ethereum-cryptography/secp256k1")
const {hexToBytes} = require("ethereum-cryptography/utils")
const fs = require('fs')
const path = require('path')

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;


app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, '..', 'records.json');
const fsLines = fs.readFileSync(filePath, 'utf8')
const balances = JSON.parse(fsLines)

const getOwnerBalance = (owner) => {
    const record = balances.find((record) => record.wallet === owner)
    return record.balance
}

app.get("/balance/:address", (req, res) => {
    const {address} = req.params;
    const balance = getOwnerBalance(address) || 0;
    res.send({balance});
});

app.post("/send", (req, res) => {
    const {r, s, hashedData, publicKey, recovery, sender, recipient, amount} = req.body;

    let signed = {r, s, recovery, hashedData}
    signed.r = BigInt(r)
    signed.s = BigInt(s)
    signed.recovery = BigInt(recovery)

    if (verifySignedData(signed, hashedData, publicKey)) {
        setInitialBalance(sender);
        setInitialBalance(recipient);

        const senderWallet = balances.find(balance => balance.wallet === sender)
        const recipientWallet = balances.find(balance => balance.wallet === recipient)

        if (recipientWallet) {
            if (senderWallet.balance < amount) {
                res.status(400).send({message: "Not enough funds to complete transaction!"});
            } else {
                senderWallet.balance -= amount;
                recipientWallet.balance += amount;
                res.send({balance: senderWallet.balance});
            }
        } else {
            res.status(400).send({message: "Recipient not found!"});
        }
    } else {
        res.status(400).send({message: "Digital signature verification unsuccessful!"});
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}

function verifySignedData(signed, hashedData, publicKey) {
    return secp.verify(signed, hexToBytes(hashedData), hexToBytes(publicKey))
}
