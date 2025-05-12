import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NavbarMain } from './NavbarMain';
import { keccak256 } from 'js-sha3';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const contractAddress = "0xC38F4609A3319E78FE30FC615D34B4468b524810";
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "dataHash",
				"type": "bytes32"
			}
		],
		"name": "NewRecord",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum Verimed.Role",
				"name": "role",
				"type": "uint8"
			}
		],
		"name": "RoleAssigned",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "addHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getRole",
		"outputs": [
			{
				"internalType": "enum Verimed.Role",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "recordHashes",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "roles",
		"outputs": [
			{
				"internalType": "enum Verimed.Role",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum Verimed.Role",
				"name": "_role",
				"type": "uint8"
			}
		],
		"name": "setRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export default function Records() {
    const [wallet, setWallet] = useState('');
    const [contract, setContract] = useState(null);
    const [role, setRole] = useState('none');
    const [medicalData, setMedicalData] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [records, setRecords] = useState([]);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
  
    const getUserDetails = async (accessToken) => {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );
      const data = await response.json();
      setUserDetails(data);
    };
  
    useEffect(() => {
      const accessToken = Cookies.get("access_token");
  
      if (!accessToken) {
        navigate("/");
      }
  
      getUserDetails(accessToken);
    }, [navigate]);
  

    const fetchRecords = async () => {
        const response = await fetch('https://verimed-backend-d97h.onrender.com/records');
        const data = await response.json();
        setRecords(data);
    };

    const fetchUserRole = async (userAddress, contractInstance) => {
        const roleInt = await contractInstance.getRole(userAddress);
        const roleMap = { 0: 'none', 1: 'patient', 2: 'doctor' };
        setRole(roleMap[roleInt]);
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const submitRecord = async () => {
        try {
            if (!medicalData) {
                alert('Please enter some data.');
                return;
            }

            const dataHash = '0x' + keccak256(medicalData);
            await contract.addHash(dataHash);

            await fetch('https://verimed-backend-d97h.onrender.com/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: medicalData,
                    isPublic,
                    patientAddress: wallet,
                }),
            });

            setMedicalData('');
            fetchRecords();
        } catch (error) {
            console.error('Error submitting record:', error);
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) throw new Error('Install MetaMask');

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            setWallet(account);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(contractInstance);

            await fetchUserRole(account, contractInstance);
        } catch (error) {
            console.error('Connection error:', error);
            alert(error.message);
        }
    };

    const assignRole = async (selectedRole) => {
        try {
            const roleValue = selectedRole === 'patient' ? 1 : 2;
            await contract.setRole(roleValue);
            setRole(selectedRole);
        } catch (error) {
            console.error('Role assignment error:', error);
        }
    };

    return (
        <div >
            <NavbarMain />
            <div className="container">
            <h1 className="title">Records</h1>
            {!wallet ? (
                <button className="btn-primary" onClick={connectWallet}>Connect Wallet</button>
            ) : role === 'none' ? (
                <div>
                    <p>Select your role (only once):</p>
                    <button className="btn-primary" onClick={() => assignRole('patient')}>Patient</button>
                    <button className="btn-primary" onClick={() => assignRole('doctor')}>Doctor</button>
                </div>
            ) : role === 'patient' ? (
                <div>
                    <textarea
                        value={medicalData}
                        onChange={(e) => setMedicalData(e.target.value)}
                        placeholder="Enter medical data"
                    />
                    <div>
                        <label>
                            Public:
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={() => setIsPublic(!isPublic)}
                            />
                        </label>
                    </div>
                    <button className="btn-primary" onClick={submitRecord}>Save Record</button>

                    <h3>Your Records:</h3>
                    {records
                        .filter((record) => record.patientAddress === wallet)
                        .map((record, i) => (
                            <div key={i}>
                                <p>{record.patientAddress} : {record.data}</p>
                            </div>
                        ))}
                </div>
            ) : (
                <div>
                    <h2>Public Records</h2>
                    {records.map((record, i) => (
                        <div key={i}>
                        <p>{record.patientAddress} : {record.data}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </div>
    );
}
