import Navbar from "@/components/Navbar";
import StoreProvider from "@/redux/StoreProvider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Personal Jira",
    description: "Jira, but better and free",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <StoreProvider>
                    <Navbar />
                    <main>{children}</main>
                </StoreProvider>
            </body>
        </html>
    );
}
