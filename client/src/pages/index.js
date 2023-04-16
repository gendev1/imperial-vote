import Image from 'next/image'
import { Inter } from 'next/font/google'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import Link from 'next/link'
import Header from '../header';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();

   const users = [
    {
      name: "Vote 1",
      picture: "https://fancytailwind.com/static/profile10-9e05bd5638c669c34c11cb0462d95aa9.jpg",
      role: "Founder and Creative direction",
      online: true,
      link: "#userProfile1",
      yesPercentage: "20%",
      noPercentage: "60%",
      abstain: "20%"
    },
    {
      name: "Vote 2",
      picture: "https://fancytailwind.com/static/profile17-d76f5656816ea770a4118ba11f135c58.jpg",
      role: "designer, illustrator and dreamer",
      online: false,
      link: "#userProfile2",
      yesPercentage: "50%",
      noPercentage: "20%",
      abstain: "30%"
    },
    {
      name: "Vote 3",
      picture: "https://fancytailwind.com/static/profile8-34d5f5980ca5030c155a2ffbb50b5802.jpg",
      role: "innovative solutions for web",
      online: true,
      link: "#userProfile3",
      yesPercentage: "80%",
      noPercentage: "20%",
      abstain: "0%"
    },
  ];
  return (
    <main>
      <div className="bg-yellow-200">
        <Header></Header>
        <div className="relative isolate px-6 pt-14 lg:px-4">
          <div className="text-center">
            <Button onClick={onOpen} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              Create Proposal
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader className='bg-slate-400'>Create Proposal</ModalHeader>
                <ModalCloseButton />
                <ModalBody className='bg-slate-400'>
                  <form>
                    <div className="space-y-12">
                      <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <div className="sm:col-span-4">
                            <label htmlFor="proposalname" className="block text-sm font-medium leading-6 text-gray-900">
                              Proposal Name
                            </label>
                            <div className="mt-2">
                              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                  type="text"
                                  name="proposalname"
                                  id="proposalname"
                                  autoComplete="proposalname"
                                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                  placeholder="DAO Voting"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </ModalBody>

                <ModalFooter className='bg-slate-400'>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          <div className="mx-auto max-w-7xl py-3">
            <div className="text-center">
              <h1 className="text-blue-600 text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                Decentralized Polling
              </h1>
              <div className="mx-auto w-full max-w-5xl bg-slate-400">
                <ul className="flex flex-col">
                  {users.map(user => (
                    <li key={user.name} className="border-b-2 border-gray-100 h-36">
                      <div className={`py-5 px-4 flex justify-between border-l-4 border-transparent bg-transparent ${user.online ? "hover:border-green-400 hover:bg-gray-200" : "hover:border-red-500 hover:bg-red-50"}`}>

                        {/* :USER DETAILS */}
                        <div className="sm:pl-32 pr-8 flex md:items-stretch">
                          <div className="space-y-1">
                            {/* :::name */}
                            <p className="text-base text-gray-700 font-bold tracking-wide text-center">{user.name}</p>
                            {/* :::role */}
                            <p className="text-sm text-gray-500 font-medium">{user.role}</p>
                          </div>
                        </div>


                        {/* :USER STATUS & BUTTON */}
                        <div>
                          {/* <a href={user.link} className="text-sm text-gray-500 font-semibold hover:underline hover:text-gray-700">Create Poll</a> */}
                          <Link className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" href="/vote">Vote</Link>
                          {/* <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                            Vote
                          </button> */}
                        </div>
                        <div className="col-span-1 w-72 bg-white-600 rounded-full h-3 mb-4 dark:bg-gray-900">
                          <div>
                            <div className="bg-green-700 h-1.5 rounded-full dark:bg-green-700" style={{ width: user.yesPercentage, marginTop: "5px" }}></div>
                            <p className="text-sm text-gray-500 font-small">{user.yesPercentage}</p>
                          </div>
                          <div>
                            <div className="bg-red-400 h-1.5 rounded-full dark:bg-red-500" style={{ width: user.noPercentage, marginTop: "5px" }}></div>
                            <p className="text-sm text-gray-500 font-small">{user.noPercentage}</p>
                          </div>
                          <div>
                            <div className="bg-slate-400 h-1.5 rounded-full dark:bg-slate-500" style={{ width: user.abstain, marginTop: "5px" }}></div>
                            <p className="text-sm text-gray-500 font-small">{user.abstain}</p>
                          </div>
                        </div>
                      </div>

                    </li>
                  ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
