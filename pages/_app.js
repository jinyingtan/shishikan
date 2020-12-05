import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/react';
import theme from '../styles/theme';
import { AuthModalProvider } from '@components/auth/authModal';

function MyApp({ Component, pageProps }) {
  return (
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
  );
}

export default MyApp;
