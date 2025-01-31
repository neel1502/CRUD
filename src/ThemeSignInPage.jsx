// import * as React from 'react';
// import { AppProvider } from '@toolpad/core/AppProvider';
// import { SignInPage } from '@toolpad/core/SignInPage';
// import { useTheme } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; 

// const API_BASE_URL = "http://localhost:8000";


// const providers = [{ id: 'credentials', name: 'Email and password' }];
 
// const signIn = async (provider, formData) => {
//   const email = formData.get('email');
//   const password = formData.get('password');

//   try {
//     const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password });
//     if(response.data.token){
//       localStorage.setItem('token',response.data.token);
//     }
//     return {
//       type: 'CredentialsSignin',
//       error: null,
//       token: response.data.token,
//     };
//   } catch (error) {
//     return {
//       type: 'CredentialsSignin',
//       error: error.response?.data?.message || 'Login failed.',
//     };
//   }
// };
 
// export default function ThemeSignInPage() {
//   const theme = useTheme();
//   const navigate = useNavigate(); // Hook to navigate to different routes
 
//   const handleSignIn = async (provider, formData) => {
//     const result = await signIn(provider, formData);
//     if (!result.error) {
//       // Navigate to the users page on successful sign-in
//       navigate('/users');
//     } else {
//       // Handle error (e.g., show an error message)
//       console.log(result.error);
//     }
//   };
 
//   return (
//     <AppProvider theme={theme}>
//       <SignInPage
//         signIn={handleSignIn} // Use the custom signIn function that includes navigation
//         providers={providers}
//         slotProps={{ emailField: { autoFocus: false } }}
//       />
//     </AppProvider>
//   );
// }
 









import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8000";

const providers = [{ id: 'credentials', name: 'Email and password' }];

const signIn = async (provider, formData) => {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return {
      type: 'CredentialsSignin',
      error: null,
      token: response.data.token,
    };
  } catch (error) {
    return {
      type: 'CredentialsSignin',
      error: error.response?.data?.message || 'Login failed.',
    };
  }
};

export default function ThemeSignInPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastSeverity, setToastSeverity] = React.useState('info'); // Severity can be 'info', 'success', 'error', etc.
  const [toastOpen, setToastOpen] = React.useState(false);

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const handleSignIn = async (provider, formData) => {
    const result = await signIn(provider, formData);
    if (!result.error) {
      setToastMessage('User logged in successfully!');
      setToastSeverity('success');
      setToastOpen(true);

      // Navigate to the list page after a short delay for the toast
      
        setTimeout(() => {
          navigate('/users');
        }, 2000);
    
    } else {
      setToastMessage(result.error);
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={handleSignIn}
        providers={providers}
        slotProps={{
          emailField: { autoFocus: false },
          signInButton: { children: 'Login' }, // Change button text to "Login"
        }}
      />
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </AppProvider>
  );
}
