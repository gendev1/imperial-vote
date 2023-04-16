import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from "react";
import {
    Button
} from '@chakra-ui/react'

const ethers = require("ethers");
export default function Header() {

    const [isConnected, setIsConnected] = useState(false);
    const [hasMetamask, setHasMetamask] = useState(false);
    const [signer, setSigner] = useState(undefined);
    const [address, serAddress] = useState(undefined);

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            setHasMetamask(true);
        }
    });

    async function connect() {
        if (typeof window.ethereum !== "undefined") {
            try {
                await ethereum.request({ method: "eth_requestAccounts" });
                setIsConnected(true);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setSigner(provider.getSigner());
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                console.log(address);
            } catch (e) {
                console.log(e);
            }
        } else {
            setIsConnected(false);
        }
    }

    async function execute() {
        if (typeof window.ethereum !== "undefined") {
            const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
            const abi = [
                {
                    inputs: [
                        {
                            internalType: "string",
                            name: "_name",
                            type: "string",
                        },
                        {
                            internalType: "uint256",
                            name: "_favoriteNumber",
                            type: "uint256",
                        },
                    ],
                    name: "addPerson",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                },
                {
                    inputs: [
                        {
                            internalType: "string",
                            name: "",
                            type: "string",
                        },
                    ],
                    name: "nameToFavoriteNumber",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "",
                            type: "uint256",
                        },
                    ],
                    name: "people",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "favoriteNumber",
                            type: "uint256",
                        },
                        {
                            internalType: "string",
                            name: "name",
                            type: "string",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                },
                {
                    inputs: [],
                    name: "retrieve",
                    outputs: [
                        {
                            internalType: "uint256",
                            name: "",
                            type: "uint256",
                        },
                    ],
                    stateMutability: "view",
                    type: "function",
                },
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_favoriteNumber",
                            type: "uint256",
                        },
                    ],
                    name: "store",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                },
            ];
            const contract = new ethers.Contract(contractAddress, abi, signer);
            try {
                await contract.store(42);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("Please install MetaMask");
        }
    }


    return (
        <header className="bg-yellow-200">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <p className="md:decoration-4 text-blue-600 text-lg">Imperial Vote</p>
                    </a>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">

                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900 m-4">Features</a>
                    {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900 m-4">Marketplace</a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900 m-4">Company</a> */}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <div>
                        {hasMetamask ? (
                            isConnected ? (
                                <div>
                                </div>
                            ) : (
                                <Button type="button" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    onClick={() => connect()}>Connect</Button>
                            )
                        ) : (
                            "Please install metamask"
                        )}

                        {isConnected ?
                            <Button type="button" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                onClick={() => execute()} disabled>Connected</Button> : ""}
                    </div>

                </div>
            </nav>
            {/* <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10"></div>
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-500 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Imperial Vote</span>
                <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
              </a>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Features</a>
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Marketplace</a>
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Company</a>
                </div>
                <div className="py-6">
                  <div>
                    {hasMetamask ? (
                      isConnected ? (
                        <div>
                        </div>
                      ) : (
                        <button type="button" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={() => connect()}>Connect</button>
                      )
                    ) : (
                      "Please install metamask"
                    )}

                    {isConnected ? <button onClick={() => execute()}>Execute</button> : ""}
                  </div
                </div>
              </div>
            </div>
          </div>
        </div> */}
        </header>
    )
}