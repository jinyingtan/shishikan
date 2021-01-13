import { ChakraProvider, CSSReset, ColorModeProvider, extendTheme } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';
import { AuthModalProvider } from '@components/auth/authModal';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Head from 'next/head';
import { GOOGLE_PLACE_AUTOCOMPLETE_URL } from '@constants/google';
import { GoogleMapsProvider } from '@components/googleMaps';

function MyApp({ Component, pageProps }) {
  return (
    <GoogleMapsProvider>
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
                content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover"
              />
              <meta name="description" content="Managing your food list" />
              <meta name="keywords" content="food,list" />
              <title>ShiShiKan</title>

              <link rel="manifest" href="/manifest.json" />
              <link href="/favicon" rel="icon" type="image/png" sizes="48x48" />
              <link rel="apple-touch-icon" href="/ssk.png"></link>
              <meta name="theme-color" content="#ffffff" />

              <script async defer src={`${GOOGLE_PLACE_AUTOCOMPLETE_URL}&callback=mapCallback`} />
            </Head>
            <Component {...pageProps} />
          </ColorModeProvider>
        </ChakraProvider>
      </AuthModalProvider>
    </GoogleMapsProvider>
  );
}

export default MyApp;
