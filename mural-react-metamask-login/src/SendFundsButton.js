import React, { useState } from "react";
import Web3 from "web3";

function SendFundsButton({ sender }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleSendFunds = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      try {
        const txDetails = {
          from: sender,
          to: recipient,
          value: web3.utils.toWei(amount, "ether"),
        };

        const result = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [txDetails],
        });

        console.log("Transaction Hash:", result);
      } catch (error) {
        console.error("Error sending funds:", error.message);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  return (
    <div>
      <input
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSendFunds}>Send Funds</button>
    </div>
  );
}

export default SendFundsButton;
