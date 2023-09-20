import React, { useState, useEffect } from "react";

const ETHERSCAN_API_KEY = "UGCCH7UQ7F3ISPJSNW23G1TY28GPB2VG9F";
const ETHERSCAN_ENDPOINT = "https://api-goerli.etherscan.io/api";

function TransactionTable({ address }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      if (address) {
        try {
          const response = await fetch(
            `${ETHERSCAN_ENDPOINT}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`
          );
          const data = await response.json();
          if (data.result) {
            setTransactions(data.result);
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      }
    }

    fetchTransactions();
  }, [address]);

  return (
    <table>
      <thead>
        <tr>
          <th>Transaction Hash</th>
          <th>Etherscan Link</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx.hash}>
            <td>{tx.hash}</td>
            <td>
              <a
                href={`https://goerli.etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Etherscan
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;
