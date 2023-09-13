import Navbar from "@/components/Navbar";
import StoreProvider from "@/redux/StoreProvider";
import SelectedProjectProvider from "@/components/context/SelectedProjectProvider";
import { Inter } from "next/font/google";
import "../../styles/global.scss";

const inter = Inter({ subsets: ["latin"] });


export default async function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SelectedProjectProvider>
                    <StoreProvider>
                        <Navbar />
                        <main>{children}</main>
                    </StoreProvider>
                </SelectedProjectProvider>
            </body>
        </html>
    );
}
