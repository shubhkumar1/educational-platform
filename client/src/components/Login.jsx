import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const Login = () => {
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const deviceId = result.visitorId;
      login(credentialResponse.credential, deviceId);
    } catch (error) {
      console.error("Fingerprinting error:", error);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h2>Welcome to the Platform</h2>
        <p>Please sign in to continue.</p>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
};

export default Login;