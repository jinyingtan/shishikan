import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/react';

import theme from '../styles/theme';
import { AuthProvider } from '@components/auth';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default MyApp;
