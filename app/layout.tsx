import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Provider } from "@/app/providers";
import { ThemeProvider } from "./components/theme-provider";

const inter = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Based World",
  description:
    "Explore through the most based communities all around the world. Base is for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" forcedTheme="dark" enableSystem>
          <Provider>{children}</Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
