/**
 * Decodes a JWT token to extract its payload
 * Note: This is a simple decode function, not a verification function
 * It does not verify the signature, just extracts the payload
 */
export const decodeToken = (token: string): { userId: number } | null => {
  try {
    // JWT tokens are in format: header.payload.signature
    // We're only interested in the payload part
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;
    
    // Base64Url decode the payload
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    
    // Parse the payload
    return JSON.parse(payload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Gets the current user ID from the stored token
 */
export const getCurrentUserId = (): number | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const decodedToken = decodeToken(token);
  return decodedToken?.userId || null;
};