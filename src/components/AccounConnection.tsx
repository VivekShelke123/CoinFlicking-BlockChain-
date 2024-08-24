"use client";

import { useEffect, useState } from 'react';
import Web3, { errors } from 'web3';
import type { Contract } from 'web3-eth-contract';
import CoinFlip from '../components/FlickingAnimation';

declare global {
    interface Window {
      ethereum: any;
    }
}
type CoinFlipAbi = any;

type CoinFlipResultEvent = {
    player: string;
    win: boolean;
    amountBet: string;
  }
  

export const AccounConnection = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [userChoice, setUserChoice] = useState('0'); // 0 for heads, 1 for tails
  const [message, setMessage] = useState('');
  const [contract, setContract] = useState<Contract<CoinFlipAbi> | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const contractAddress = '0x1b72Cf4ddB7013A01a35a39FF165944bf0185358'; 
  
  const abi =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "win",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountBet",
				"type": "uint256"
			}
		],
		"name": "CoinFlipResult",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "enum CoinFlip.Choice",
				"name": "userChoice",
				"type": "uint8"
			}
		],
		"name": "flipCoin",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const coinflipContract = new web3.eth.Contract(abi, contractAddress);
      setContract(coinflipContract);

      // **Handle the CoinFlipResult event**
      coinflipContract.events.CoinFlipResult()
        .on('data', (event) => {
          const { player , win, amountBet } = event.returnValues as CoinFlipResultEvent;

          if (player.toLowerCase() === account.toLowerCase()) {
            setMessage(win ? 'You won!' : 'You lost!');
          }
        })
    }
  }, [account]);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const balanceInWei = await web3.eth.getBalance(accounts[0]);
      const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
      setBalance(balanceInEther);
      const coinflipContract = new web3.eth.Contract(abi, contractAddress);
      setContract(coinflipContract);
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleBet = async () => {
    setMessage('');
    if (contract && account) {
      try {
        setIsFlipping(true);
        await contract.methods.flipCoin(userChoice).send({
          from: account,
          value: Web3.utils.toWei(betAmount, 'ether')
        });
      } catch (error) {
        setMessage('Transaction failed!');
        console.error(error);
      } finally {
        setIsFlipping(false); 
      }
    } else {
      alert('Please connect your wallet first.');
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-6 text-center space-y-6 transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-bold text-gray-800">Coin Flip DApp</h2>

        <button 
          onClick={connectWallet} 
          className="w-full py-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-lg transform hover:translate-y-1 hover:shadow-xl transition-all duration-300"
        >
          Connect Wallet
        </button>

        {account && (
          <div className="text-left">
            <p className="text-lg font-medium text-gray-700">Connected Account:</p>
            <p className="text-sm text-gray-500 truncate">{account}</p>
            <p className="text-lg font-medium text-gray-700 mt-4">Remaining Balance:</p>
            <p className="text-2xl font-bold text-green-500">{balance} ETH</p>
          </div>
        )}

        <input
          type="text"
          placeholder="Bet amount in ETH"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="w-full mt-4 py-3 px-4 rounded-full bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <select
          value={userChoice}
          onChange={(e) => setUserChoice(e.target.value)}
          className="w-full mt-4 py-3 px-4 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="0">Heads</option>
          <option value="1">Tails</option>
        </select>

        <button 
          onClick={handleBet}
          className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg transform hover:translate-y-1 hover:shadow-xl transition-all duration-300"
        >
          Flip Coin
        </button>

        {message && (
          <p className="text-center mt-4 text-red-500">{message}</p>
        )}
      </div>
      {isFlipping && <CoinFlip isFlipping={isFlipping}/>}
    </div>
  );
};
