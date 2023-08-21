import server from "./server.js";

function Wallet({address, setAddress, balance, setBalance}) {
    async function onChange(evt) {
        const address = evt.target.value;
        setAddress(address);
        if (address) {
            await server.get(`balance/${address}`).then(response => {
                const {data: {balance}} = response;
                setBalance(balance);
            }).catch(error => {
                console.log(error.message)
                setBalance(0);
            });
        } else {
            setBalance(0);
        }
    }

    return (
        <div className="container wallet">
            <h1>Your Wallet</h1>
            <label>
                Wallet Address
                <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}/>
            </label>

            <div className="balance">Balance: {balance}</div>
        </div>
    );
}

export default Wallet;