import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import Account from './Account'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  // Custom wallet display names for better UX
  const getWalletDisplayName = (wallet: Wallet) => {
    if (isKmd(wallet)) return 'LocalNet Wallet'
    if (wallet.id === WalletId.WALLETCONNECT) return 'MetaMask & Others'
    if (wallet.id === WalletId.LUTE) return 'Lute Wallet'
    return wallet.metadata.name
  }

  if (!openModal) return null

  return (
    <>
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.6); }
        }
        .floating-blob {
          animation: float 6s ease-in-out infinite;
        }
        .wallet-card:hover {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        ></div>

        {/* Animated background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden pointer-events-none">
          {/* Floating blobs */}
          <div className="floating-blob absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"></div>
          <div className="floating-blob absolute top-40 right-32 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl" style={{ animationDelay: '2s' }}></div>
          <div className="floating-blob absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-xl" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Modal Content */}
        <div className="relative max-w-2xl mx-4 w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-6">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            onClick={closeModal}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="font-bold text-3xl gradient-text mb-2">Connect Your Wallet</h3>
            <p className="text-slate-400">Choose your preferred wallet provider to access the platform</p>
            <div className="text-sm text-yellow-400 mt-2 bg-yellow-500/10 p-2 rounded-lg">
              ⚠️ <strong>Testnet Mode:</strong> Connect with real wallets for Algorand Testnet
            </div>
          </div>

          <div className="space-y-4">
            {activeAddress && (
              <>
                <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
                  <Account />
                </div>
                <div className="divider divider-neutral" />
              </>
            )}

            {!activeAddress && (
              <div className="grid gap-4">
                {wallets?.map((wallet) => (
                  <button
                    data-test-id={`${wallet.id}-connect`}
                    className="wallet-card group relative bg-slate-700/30 backdrop-blur-sm hover:bg-slate-700/50 border border-slate-600/50 hover:border-cyan-500/50 rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    key={`provider-${wallet.id}`}
                    onClick={async () => {
                      try {
                        console.log('Attempting to connect to wallet:', wallet.id, wallet.metadata.name)

                        // Show loading state
                        const button = document.querySelector(`[data-test-id="${wallet.id}-connect"]`) as HTMLButtonElement
                        if (button) {
                          button.textContent = 'Connecting...'
                          button.disabled = true
                        }

                        await wallet.connect()
                        console.log('Wallet connected successfully:', wallet.id)

                        // Show success message
                        alert(`✅ Successfully connected to ${getWalletDisplayName(wallet)}!`)

                        // Close modal after successful connection
                        setTimeout(() => closeModal(), 1000)
                      } catch (error) {
                        console.error('Wallet connection failed:', error)

                        // Reset button state
                        const button = document.querySelector(`[data-test-id="${wallet.id}-connect"]`) as HTMLButtonElement
                        if (button) {
                          button.disabled = false
                        }

                        // Show detailed error message
                        let errorMessage = `Failed to connect to ${getWalletDisplayName(wallet)}`
                        if (error instanceof Error) {
                          errorMessage += `\n\nError: ${error.message}`
                        }

                        if (wallet.id === WalletId.WALLETCONNECT) {
                          errorMessage += '\n\nFor MetaMask:\n1. Make sure MetaMask is installed\n2. Switch to Algorand Testnet in MetaMask\n3. Try the connection again'
                        } else if (wallet.id === WalletId.LUTE) {
                          errorMessage += '\n\nFor Lute Wallet:\n1. Make sure Lute extension is installed\n2. Create/unlock your Lute wallet\n3. Try the connection again'
                        }

                        alert(errorMessage)
                      }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      {!isKmd(wallet) && (
                        <div className="relative">
                          <img
                            alt={`wallet_icon_${wallet.id}`}
                            src={wallet.metadata.icon}
                            className="w-12 h-12 rounded-lg object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                          {wallet.id === WalletId.WALLETCONNECT && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      )}
                      {isKmd(wallet) && (
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}

                      <div className="flex-1 text-left">
                        <div className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">
                          {getWalletDisplayName(wallet)}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {wallet.id === WalletId.WALLETCONNECT
                            ? 'Connect via WalletConnect (MetaMask, Trust Wallet, etc.)'
                            : wallet.id === WalletId.LUTE
                              ? 'Secure Algorand wallet with hardware support'
                              : isKmd(wallet)
                                ? 'Development wallet for local testing'
                                : 'Algorand native wallet'
                          }
                        </div>
                      </div>

                      <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
            <button
              data-test-id="close-wallet-modal"
              className="btn btn-ghost text-slate-400 hover:text-white hover:bg-slate-700/50"
              onClick={closeModal}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>

            {activeAddress && (
              <button
                className="btn btn-error hover:btn-error/80 text-white"
                data-test-id="logout"
                onClick={async () => {
                  try {
                    if (wallets) {
                      const activeWallet = wallets.find((w) => w.isActive)
                      if (activeWallet) {
                        await activeWallet.disconnect()
                      } else {
                        // Required for logout/cleanup of inactive providers
                        localStorage.removeItem('@txnlab/use-wallet:v3')
                        window.location.reload()
                      }
                    }
                  } catch (error) {
                    console.error('Logout failed:', error)
                  }
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ConnectWallet
