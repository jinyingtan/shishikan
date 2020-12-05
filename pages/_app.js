import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/react';

import theme from '../styles/theme';
import { AuthProvider } from '@components/auth';
import { AuthModalProvider } from '@components/auth/authModal';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <ThemeProvider theme={theme}>
          <ColorModeProvider
            options={{
              useSystemColorMode: false,
              initialColorMode: 'light',
            }}
          >
            <CSSReset />
            <Component {...pageProps} />
          </ColorModeProvider>
        </ThemeProvider>
      </AuthModalProvider>
    </AuthProvider>
  );
}

export default MyApp;
