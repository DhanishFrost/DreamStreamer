// This file is used to configure the AWS Amplify library.
const awsconfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_NEXT_PUBLIC_REGION,
      userPoolId: import.meta.env.VITE_NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_NEXT_PUBLIC_USER_POOL_APP_CLIENT_ID,
      signUpVerificationMethod: 'code',
    },
  },
};

export default awsconfig;
