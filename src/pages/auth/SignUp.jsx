import { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Invalid email address');
      return;
    }

    try {
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name: username,
            'custom:role': '0',
          },
        },
      });
      console.log('Sign-up successful');
      navigate('/dreamstreamer/signin');
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message);
    }
  };

  return (
    <>
      <div className="bg-black flex flex-col md:flex-row h-screen items-center">

        <img src="https://dreamstreamer-music-assets.s3.ap-southeast-1.amazonaws.com/SingupImage.jpg" className=" max-md:w-full w-7/12 h-full object-cover brightness-75" />
        <div className="absolute top-0 left-0 w-7/12 h-full flex items-center justify-center">
          <div className="text-white">
            <span className="font-[playfairdisplay] text-white text-7xl max-md:hidden font-normal">Melody Haven Harmony</span><br /><br />
            <span className="font-[poppins] text-white text-opacity-60 max-md:hidden text-2xl font-medium"> Where music lovers gather for <br />enchanting experiences in <br />harmonious bliss</span>
          </div>
        </div>
        <div className="w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
          <div className="w-full h-100 mt-6 max-md:relative max-md:bottom-16">
            <h1
              className="font-[poppins] text-gray-200 text-center text-xl md:text-2xl font-semibold leading-tight mb-6 mt-10 max-md:mb-6 max-md:mt-6">
              Create Account</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-person text-xl text-gray-300 mt-1.5"></i>
              </div>
              <input
                className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 mt-2 bg-black text-white pl-10"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mt-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-envelope text-gray-300 mt-1.5"></i>
              </div>
              <input
                className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 mt-2 bg-black text-white pl-10"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-key text-gray-300 mt-1.5"></i>
              </div>
              <input
                className="w-full px-4 py-3 border-0 border-b-2 hover:border-b-blue-500 mt-2 bg-black text-white pl-10"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right mt-4">
              <Link to="/dreamstreamer/signin"
                className="text-sm font-semibold text-gray-400 hover:text-white focus:text-white">
                Already registered?
              </Link>


              <button onClick={handleSignUp}
                className="w-full mt-6 text-center px-4 py-4 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-[#0a174a] focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150">
                REGISTER
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;