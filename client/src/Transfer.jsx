import {useState} from "react";
import server from "./server.js";
import signMessage from "./helpers.js";

// import process from 'process';

function Transfer({address, setBalance}) {
    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function transfer(event) {
        event.preventDefault();

        try {
            for (const [field, value] of Object.entries({sendAmount, recipient, address})) {
                const message = value === "" ? "empty" : value

                if (field === 'sendAmount' && [null, "", 0].includes(value)) return alert(`Field '${field}' cannot be ${message}`)
                if (field === 'recipient' && [null, "null", ""].includes(value)) return alert(`Field '${field}' cannot be ${message}`)
                if (field === 'address' && [null, "null", ""].includes(value)) return alert(`Wallet '${field}' cannot be ${message}`)
            }

            const privateKey = '643b7effbe48d491bab7dc3839d841ec1bdf7b2942357964dad2bb839726dcd1'
            const data = {
                sender: address,
                amount: parseInt(sendAmount),
                recipient,
            }
            const signature = signMessage(data, privateKey);
            const serializedSignature = {
                r: signature._signedMessage.r.toString(),
                s: signature._signedMessage.s.toString(),
                recovery: signature._signedMessage.recovery.toString(),
                hashedData: signature.hashedMessage,
                publicKey: signature.publicKey
            };

            await server.post(`send`, {...serializedSignature, ...data})
                .then(response => {
                    if (response.status === 200) {
                        setBalance(response.data.balance);
                        alert(`Debit of ${sendAmount} on Wallet: ${address} successful`)
                    }
                }).catch(error => {
                    if (error.response.data) alert(error.response.data.message)
                    console.log(error)
                    alert("Digital signature verification unsuccessful!")
                });
        } catch (exception) {
            console.log(exception);
        }
    }

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <label>
                Send Amount
                <input
                    placeholder="1, 2, 3..."
                    value={sendAmount}
                    onChange={setValue(setSendAmount)}
                />
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address, for example: 0x2"
                    value={recipient}
                    onChange={setValue(setRecipient)}
                />
            </label>

            <input type="submit" className="button" value="Transfer"/>
        </form>
    );
}

export default Transfer;
