import { ChakraProvider, CSSReset, ColorModeProvider, extendTheme } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';
import { AuthModalProvider } from '@components/auth/authModal';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Head from 'next/head';

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
          <Head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
            />
            <meta name="description" content="Description" />
            <meta name="keywords" content="Keywords" />
            <title>Next.js PWA Example</title>

            <link rel="manifest" href="/manifest.json" />
            <link href="/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
            <link href="/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
            <link rel="apple-touch-icon" href="/apple-icon.png"></link>
            <meta name="theme-color" content="#317EFB" />
          </Head>
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </AuthModalProvider>
  );
}

export default MyApp;
