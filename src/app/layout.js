import Navbar from "@/components/Navbar";
import StoreProvider from "@/redux/StoreProvider";
import SelectedProjectProvider from "@/components/context/SelectedProjectProvider";
import { Inter } from "next/font/google";
import "../../styles/global.scss";
import DnDContextProvider from "@/components/dnd/DnDContextProvider";

const inter = Inter({ subsets: ["latin"] });


export default async function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SelectedProjectProvider>
                    <StoreProvider>
                        <Navbar />
                        <DnDContextProvider>
                            <main>{children}</main>
                        </DnDContextProvider>
                    </StoreProvider>
                </SelectedProjectProvider>
            </body>
        </html>
    );
}
