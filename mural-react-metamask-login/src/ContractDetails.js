import React, { useState, useEffect } from "react";

const ContractDetails = ({
  approvers,
  changeNickName,
  threshold,
  changeThreshold,
  addApprover,
}) => {
  const [nickNames, setNickNames] = useState({});
  const [newthreshold, setNewThreshold] = useState(threshold);
  const [newApprover, setNewApprover] = useState("");

  const handleNickNameChange = (e, index) => {
    setNickNames({
      ...nickNames,
      [approvers[index]]: e.target.value,
    });
  };

  const handleNewApproverChange = (e) => {
    setNewApprover(e.target.value);
  };

  const handleThresholdChange = (e) => {
    setNewThreshold(e.target.value);
  };
  return (
    <div>
      <h3>MultiSigWallet Details</h3>
      <div>
        <table>
          <thead>
            <tr>
              <th>Approvers</th>
            </tr>
          </thead>
          <tbody>
            {approvers ? (
              approvers.map((approver, index) => (
                <tr key={index}>
                  <td>{approver}</td>
                  <td>
                    <input
                      type="text"
                      onChange={(e) => handleNickNameChange(e, index)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        changeNickName(approver, nickNames[approver])
                      }
                    >
                      Change Nickname
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr></tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <label>Add Approver</label>
        <input type="string" onChange={(e) => handleNewApproverChange(e)} />
        <button onClick={() => addApprover(newApprover)}>Add Approver</button>
      </div>
      <div>
        <label>Update Threshold</label>
        <input type="number" onChange={(e) => handleThresholdChange(e)} />
        <button onClick={() => changeThreshold(newthreshold)}>
          Change Threshold
        </button>
      </div>
    </div>
  );
};

export default ContractDetails;
