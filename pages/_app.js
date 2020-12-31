import { ChakraProvider, CSSReset, ColorModeProvider, extendTheme } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';
import { AuthModalProvider } from '@components/auth/authModal';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthModalProvider>
      <ChakraProvider theme={extendTheme(theme)}>
        <ColorModeProvider
          options={{
            useSystemColorMode: false,
            initialColorMode: 'light',
          }}
        >
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </AuthModalProvider>
  );
}

export default MyApp;
