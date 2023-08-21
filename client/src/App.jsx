import Wallet from "./Wallet.jsx";
import Transfer from "./Transfer.jsx";
import "./App.scss";
import {useState} from "react";

function App() {
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");

    return (
        <div className="app">
            <Wallet
                balance={balance}
                setBalance={setBalance}
                address={address}
                setAddress={setAddress}
            />
            <Transfer
                setBalance={setBalance}
                address={address}
                privateKey={privateKey}
            />
        </div>
    );
}

export default App;
