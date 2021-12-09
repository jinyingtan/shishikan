import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthModalProvider } from '@components/auth/authModal';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Head from 'next/head';
import { GoogleMapsProvider } from '@components/googleMaps';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function MyApp({ Component, pageProps }) {
  return (
    <GoogleMapsProvider>
      <AuthModalProvider>
        <ChakraProvider theme={theme}>
          <Head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover" />
            <meta name="description" content="Managing your food list" />
            <meta name="keywords" content="food,list" />
            <title>ShiShiKan</title>

            <link rel="manifest" href="/manifest.json" />
            <link href="/favicon" rel="icon" type="image/png" sizes="48x48" />
            <link rel="apple-touch-icon" href="/ssk.png"></link>
            <meta name="theme-color" content="#ffffff" />
          </Head>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthModalProvider>
    </GoogleMapsProvider>
  );
}

export default MyApp;
