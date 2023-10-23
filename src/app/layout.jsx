"use client"
import "./globals.css";
import { Inter } from "next/font/google";
import { NextUIProviders } from "./providers/providers";
import { AuthContextProvider } from "./context/AuthContext";
import { Provider } from 'react-redux';
import store from './redux/store';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthContextProvider>
            <NextUIProviders>
              {children}
            </NextUIProviders>
          </AuthContextProvider>
        </Provider>
      </body>
    </html>
  );
}
