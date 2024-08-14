"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Provider } from "react-redux";
import store from "@/store/store";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
