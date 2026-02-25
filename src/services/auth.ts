// Helper: Convert ArrayBuffer to Hex String
const bufferToHex = (buffer: ArrayBuffer): string => {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Helper: Convert Hex String to Uint8Array
const hexToBuffer = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
};

export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return bufferToHex(array);
};

export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const enc = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const saltBuffer = hexToBuffer(salt);

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256"
    },
    passwordKey,
    256 // 256 bits
  );

  return bufferToHex(derivedBits);
};

export const verifyPassword = async (password: string, storedHash: string, salt: string): Promise<boolean> => {
  const newHash = await hashPassword(password, salt);
  return newHash === storedHash;
};
