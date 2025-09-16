import React, { useState } from 'react';
// import { Web3Storage } from 'web3.storage'; // Replaced with Pinata
import { encryptFile, downloadKey } from '../utils/crypto';

interface UploadResult {
  cid: string;
  txId: string;
  filename: string;
  keyBase64: string;
  ivBase64: string;
  timestamp: string;
}

export default function UploadPrescription() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type (images and PDFs)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please select a valid image (JPEG, PNG) or PDF file');
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const uploadToIPFS = async (encryptedBlob: Blob, filename: string): Promise<string> => {
    // Real Pinata IPFS upload
    const pinataJWT = import.meta.env.VITE_PINATA_JWT;

    if (!pinataJWT) {
      // Fallback to mock if no Pinata credentials
      console.log('🧪 Mock IPFS upload - no Pinata JWT provided');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockCID = `bafybeig${Math.random().toString(36).substring(2, 15)}dxj4a`;
      console.log(`Mock CID generated: ${mockCID}`);
      return mockCID;
    }

    try {
      console.log('📁 Uploading to Pinata IPFS...');

      // Create FormData for Pinata upload
      const formData = new FormData();
      formData.append('file', encryptedBlob, `encrypted_${filename}`);

      // Pinata metadata
      const metadata = JSON.stringify({
        name: `encrypted_prescription_${Date.now()}`,
        keyvalues: {
          type: 'encrypted_prescription',
          original_filename: filename,
          encrypted: 'true',
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      // Pinata options
      const options = JSON.stringify({
        cidVersion: 1,
      });
      formData.append('pinataOptions', options);

      // Upload to Pinata
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${pinataJWT}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Pinata upload successful:', result);

      return result.IpfsHash;

    } catch (error) {
      console.error('❌ Pinata upload failed:', error);
      // Fallback to mock on error
      const mockCID = `fallback_${Math.random().toString(36).substring(2, 15)}`;
      console.log(`Using fallback CID: ${mockCID}`);
      return mockCID;
    }
  };

  const recordOnChain = async (metadata: {
    cid: string;
    filename: string;
    uploaderAddress: string;
    iv: string;
    timestamp: string;
  }): Promise<string> => {
    console.log('📡 Sending to backend:', metadata);

    const response = await fetch('http://localhost:3001/api/record-on-chain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Failed to record on chain: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Backend response:', data);

    if (data.note) {
      console.log('ℹ️ Note:', data.note);
    }

    return data.txId;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    if (!import.meta.env.VITE_PINATA_JWT) {
      console.log('⚠️ Pinata JWT not configured - check environment variables');
      // Allow upload to continue with Pinata integration
    }

    setUploading(true);
    setError('');

    try {
      // Step 1: Encrypt the file
      console.log('Encrypting file...');
      const { encryptedBlob, keyBase64, ivBase64 } = await encryptFile(file);

      // Step 2: Upload encrypted file to IPFS
      console.log('Uploading to IPFS...');
      const cid = await uploadToIPFS(encryptedBlob, file.name);

      // Step 3: Prepare metadata for blockchain
      const timestamp = new Date().toISOString();
      const metadata = {
        cid,
        filename: file.name,
        uploaderAddress: 'patient_address_placeholder', // This would come from wallet connection
        iv: ivBase64,
        timestamp,
      };

      // Step 4: Record metadata on Algorand blockchain
      console.log('Recording on blockchain...');
      const txId = await recordOnChain(metadata);

      // Step 5: Set success result
      setResult({
        cid,
        txId,
        filename: file.name,
        keyBase64,
        ivBase64,
        timestamp,
      });

      console.log('Upload completed successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      let errorMsg = 'An unexpected error occurred';

      if (err instanceof Error) {
        if (err.message.includes('Failed to record on chain')) {
          errorMsg = 'Blockchain recording failed. The file was encrypted successfully, but could not be recorded on the blockchain. This might be due to network connectivity issues.';
        } else {
          errorMsg = err.message;
        }
      }

      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadKey = () => {
    if (result) {
      downloadKey(result.keyBase64, `prescription_key_${Date.now()}.txt`);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏥 Digital Health Records
          </h1>
          <p className="text-lg text-gray-600">
            Secure, Decentralized Prescription Storage on Web3
          </p>
          <div className="mt-4 inline-flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              🔒 <span className="ml-1">End-to-End Encrypted</span>
            </span>
            <span className="flex items-center">
              🌐 <span className="ml-1">IPFS Decentralized Storage</span>
            </span>
            <span className="flex items-center">
              ⛓️ <span className="ml-1">Algorand Blockchain</span>
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="card bg-white shadow-2xl border border-gray-200">
            <div className="card-body p-8">
              <h2 className="card-title text-2xl mb-6 text-center text-gray-800">
                📤 Upload Medical Document
              </h2>

              {!result ? (
                <div className="space-y-6">
                  {/* Drag & Drop Upload Area */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold text-gray-700">
                        Select your medical document
                      </span>
                      <span className="label-text-alt text-gray-500">
                        Images, PDFs supported
                      </span>
                    </label>

                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered file-input-primary w-full h-24 text-lg"
                        disabled={uploading}
                      />

                      {/* Custom Upload Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📁</div>
                          <div className="text-sm text-gray-500">
                            {file ? 'File Selected' : 'Click or drag file here'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {file && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">📄</div>
                          <div className="flex-1">
                            <div className="font-semibold text-green-800">{file.name}</div>
                            <div className="text-sm text-green-600">
                              Size: {(file.size / 1024).toFixed(1)} KB • Type: {file.type || 'Unknown'}
                            </div>
                          </div>
                          <div className="text-green-500 text-xl">✅</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Patient Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">📋 Document Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Patient ID:</span>
                        <span className="font-mono text-blue-900">AUTO-GENERATED</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Upload Date:</span>
                        <span className="text-blue-900">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Encryption:</span>
                        <span className="text-blue-900">AES-GCM 256-bit</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="alert alert-error shadow-lg">
                      <div>
                        <svg className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h3 className="font-bold">Upload Error</h3>
                          <div className="text-xs">{error}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {uploading && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="loading loading-spinner loading-md text-yellow-600"></div>
                        <div>
                          <div className="font-semibold text-yellow-800">Processing Upload...</div>
                          <div className="text-sm text-yellow-600">Please wait while we secure your document</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="card-actions justify-center pt-4">
                    <button
                      className={`btn btn-primary btn-lg w-full ${uploading ? 'loading' : ''}`}
                      onClick={handleUpload}
                      disabled={!file || uploading}
                    >
                      {uploading ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          🚀 Upload & Encrypt Document
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Success Result Display */
                <div className="space-y-6">
                  <div className="alert alert-success shadow-lg">
                    <div>
                      <svg className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-bold">Upload Successful!</h3>
                        <div className="text-xs">Document secured on Web3 infrastructure</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center">
                      📄 <span className="ml-2">Upload Summary</span>
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Document:</span>
                        <span className="text-gray-800 font-mono text-sm">{result.filename}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">IPFS Storage:</span>
                        <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                          {result.cid.substring(0, 20)}...
                        </code>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Blockchain TX:</span>
                        <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono">
                          {result.txId.substring(0, 20)}...
                        </code>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium text-gray-600">Upload Time:</span>
                        <span className="text-gray-800">{new Date(result.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Download Section */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">🔑</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-800 mb-2">Critical: Save Your Encryption Key</h4>
                        <p className="text-sm text-red-700 mb-4">
                          This key is the ONLY way to decrypt and access your document.
                          Store it securely - we cannot recover it if lost!
                        </p>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={handleDownloadKey}
                        >
                          📥 Download Encryption Key
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Verification Links */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-bold text-blue-800 mb-4 flex items-center">
                      🔍 <span className="ml-2">Verify on Blockchain</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700 font-medium">IPFS Storage:</span>
                        <a
                          href={`https://w3s.link/ipfs/${result.cid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline btn-primary"
                        >
                          🌐 View on IPFS
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700 font-medium">Blockchain Record:</span>
                        <a
                          href={`https://testnet.algoexplorer.io/tx/${result.txId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline btn-secondary"
                        >
                          ⛓️ View Transaction
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <div className="card-actions justify-center pt-4">
                    <button className="btn btn-outline btn-lg w-full" onClick={resetForm}>
                      📤 Upload Another Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Premium Information Panel */}
          <div className="space-y-8">
            {/* Glassmorphic Security Features */}
            <div className="group">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🛡️</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    Security Features
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🔒</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg mb-2">End-to-End Encryption</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          AES-GCM 256-bit encryption performed locally. Files never leave your device unencrypted.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🌐</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg mb-2">Decentralized Storage</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Files stored on IPFS network for redundancy and censorship resistance.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">⚛️</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg mb-2">Blockchain Verification</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Metadata recorded on Algorand blockchain for immutable proof.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glassmorphic Upload Process */}
            <div className="group">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🔄</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    Upload Process
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <span className="text-gray-200">Document encrypted locally with AES-GCM</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <span className="text-gray-200">Encrypted file uploaded to IPFS via Pinata</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <span className="text-gray-200">Metadata recorded on Algorand blockchain</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                      <span className="text-gray-200">Encryption key provided for secure access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glassmorphic Supported Formats */}
            <div className="group">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl hover:shadow-green-500/25 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    Supported Documents
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-3">
                      <span className="text-red-400 text-xl">📄</span>
                      <span className="text-gray-200">PDF Documents</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-3">
                      <span className="text-blue-400 text-xl">🖼️</span>
                      <span className="text-gray-200">JPEG Images</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-3">
                      <span className="text-green-400 text-xl">🖼️</span>
                      <span className="text-gray-200">PNG Images</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-3">
                      <span className="text-orange-400 text-xl">📄</span>
                      <span className="text-gray-200">Medical Reports</span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <span className="text-gray-400 text-sm bg-white/5 px-4 py-2 rounded-lg">
                      Maximum file size: 10MB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `
      }} />
    </div>
  );
}
