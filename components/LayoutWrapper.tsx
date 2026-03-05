"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Maintenance veya Preview sayfalarındaysak Header ve Footer'ı gizle
    const isIsolatedPage = pathname === "/maintenance" || pathname === "/preview";

    if (isIsolatedPage) {
        return <main className="flex-1 flex flex-col">{children}</main>;
    }

    return (
        <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
}
