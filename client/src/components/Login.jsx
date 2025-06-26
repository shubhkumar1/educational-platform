import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const handleSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    // TODO: Send credentialResponse.credential to the backend
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h2 className="text-3xl font-bold underline">Welcome to the Platform</h2>
        <p>Please sign in to continue.</p>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
};

export default Login;