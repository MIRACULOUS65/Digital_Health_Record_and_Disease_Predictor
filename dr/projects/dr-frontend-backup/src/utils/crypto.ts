/**
 * Crypto utilities for AES-GCM encryption/decryption
 * Used for client-side encryption of prescription files before IPFS upload
 */

// Generate a new AES-GCM key
export async function generateKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

// Export key to base64 string for storage/download
export async function exportKeyBase64(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

// Import key from base64 string
export async function importKeyBase64(base64Key: string): Promise<CryptoKey> {
  const keyData = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

// Encrypt ArrayBuffer using AES-GCM
export async function encryptArrayBuffer(
  data: ArrayBuffer,
  key: CryptoKey
): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );

  return { encryptedData, iv };
}

// Decrypt ArrayBuffer using AES-GCM
export async function decryptArrayBuffer(
  encryptedData: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array
): Promise<ArrayBuffer> {
  return window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedData
  );
}

// Convert Uint8Array to base64 string
export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  return btoa(String.fromCharCode(...uint8Array));
}

// Convert base64 string to Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

// File-specific encryption function
export async function encryptFile(file: File): Promise<{
  encryptedBlob: Blob;
  key: CryptoKey;
  iv: Uint8Array;
  keyBase64: string;
  ivBase64: string;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const key = await generateKey();
  const { encryptedData, iv } = await encryptArrayBuffer(arrayBuffer, key);

  const keyBase64 = await exportKeyBase64(key);
  const ivBase64 = uint8ArrayToBase64(iv);
  const encryptedBlob = new Blob([encryptedData]);

  return {
    encryptedBlob,
    key,
    iv,
    keyBase64,
    ivBase64,
  };
}

// File-specific decryption function for use with IPFS CID
export async function decryptFile(
  cid: string,
  keyBase64: string,
  ivBase64: string
): Promise<Blob> {
  try {
    // Fetch encrypted file from IPFS
    const response = await fetch(`https://w3s.link/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from IPFS: ${response.statusText}`);
    }

    const encryptedArrayBuffer = await response.arrayBuffer();
    const key = await importKeyBase64(keyBase64);
    const iv = base64ToUint8Array(ivBase64);

    const decryptedArrayBuffer = await decryptArrayBuffer(encryptedArrayBuffer, key, iv);

    return new Blob([decryptedArrayBuffer]);
  } catch (error) {
    console.error('Error decrypting file:', error);
    throw error;
  }
}

// Utility to download the encryption key as a file
export function downloadKey(keyBase64: string, filename: string = 'prescription-key.txt') {
  const blob = new Blob([keyBase64], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
