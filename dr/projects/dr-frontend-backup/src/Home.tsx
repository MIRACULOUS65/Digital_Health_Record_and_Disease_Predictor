// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import UploadPrescription from './components/UploadPrescription'

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState<boolean>(false)
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  const togglePrescriptionUpload = () => {
    setShowPrescriptionUpload(!showPrescriptionUpload)
  }

  return (
    <div className="hero min-h-screen bg-teal-400">
      <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
        <div className="max-w-md">
          <h1 className="text-4xl">
            Welcome to <div className="font-bold">DR Health 🏥</div>
          </h1>
          <p className="py-6">
            AI-Powered Decentralized Digital Health Record & Prescription-to-Disease System built on Algorand blockchain.
          </p>

          <div className="grid">
            <a
              data-test-id="getting-started"
              className="btn btn-primary m-2"
              target="_blank"
              href="https://github.com/algorandfoundation/algokit-cli"
            >
              Getting started
            </a>

            <div className="divider" />

            {!activeAddress && (
              <div className="alert alert-warning mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span><strong>Wallet Required:</strong> Please connect your wallet to continue using the platform.</span>
              </div>
            )}

            <button
              data-test-id="connect-wallet"
              className="btn btn-primary m-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 text-white font-semibold"
              onClick={toggleWalletModal}
            >
              {activeAddress ? (
                <>
                  🔗 Wallet Connected
                  <span className="text-xs opacity-75 ml-2">({activeAddress.slice(0, 6)}...{activeAddress.slice(-4)})</span>
                </>
              ) : (
                <>
                  🔌 Connect Wallet
                  <span className="text-xs opacity-75 ml-2">(MetaMask, Lute & More)</span>
                </>
              )}
            </button>

            {activeAddress && (
              <button data-test-id="transactions-demo" className="btn m-2" onClick={toggleDemoModal}>
                Transactions Demo
              </button>
            )}

            <button
              data-test-id="prescription-upload"
              className={`btn btn-accent m-2 ${!activeAddress ? 'btn-disabled opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={activeAddress ? togglePrescriptionUpload : undefined}
              disabled={!activeAddress}
            >
              📋 Web3 Prescription Upload
              {!activeAddress && <span className="text-xs opacity-75 ml-2">(Connect wallet first)</span>}
            </button>
          </div>

          <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
          <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />

          {/* Premium Web3 Prescription Upload Modal - Fullscreen */}
          {showPrescriptionUpload && (
            <div className="modal modal-open">
              <div className="modal-box max-w-none w-screen h-screen p-0 bg-transparent shadow-none overflow-hidden">
                <div className="absolute top-4 right-4 z-50">
                  <button
                    className="btn btn-circle btn-ghost bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                    onClick={togglePrescriptionUpload}
                  >
                    ✕
                  </button>
                </div>
                <UploadPrescription />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
