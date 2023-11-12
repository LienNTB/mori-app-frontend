"use client"
import "./globals.css";
import { Inter, Montserrat } from "next/font/google";
import { NextUIProviders } from "./providers/providers";
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthContextProvider } from "./context/AuthContext";
import { Provider } from 'react-redux';
import store from './redux/store';
import "react-toastify/dist/ReactToastify.css";


const inter = Montserrat({ subsets: ['latin'] })

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthContextProvider>
            {/* <CacheProvider>
              <ChakraProvider> */}
            <NextUIProviders>
              {children}
            </NextUIProviders>
            {/* </ChakraProvider>
            </CacheProvider> */}
          </AuthContextProvider>
        </Provider>
      </body>
    </html>
  );
}
