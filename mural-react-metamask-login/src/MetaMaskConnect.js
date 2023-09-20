import React, { useState } from "react";
import TransactionTable from "./TransactionTable";
import SendFundsButton from "./SendFundsButton";
import MultiSigSetup from "./MultiSegWalletCreate";
import Web3 from "web3";

function MetaMaskButton() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(null);

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        // Fetch account balance
        const balanceWei = await web3.eth.getBalance(accounts[0]);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        setBalance(balanceEth);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  return (
    <div>
      {account ? (
        <div>
          Connected: {account} <br />
          Balance: {balance} ETH
        </div>
      ) : (
        <button onClick={connectMetaMask}>Connect with MetaMask</button>
      )}
      {account ? <TransactionTable address={account} /> : <div />}
      {account ? <SendFundsButton sender={account} /> : <div />}
      {account ? <MultiSigSetup account={account} /> : <div />}
    </div>
  );
}

export default MetaMaskButton;
