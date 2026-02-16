import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FAVICON_URL } from "@/config/constants";

export const metadata: Metadata = {
  title: "Tablero Kanban - Gestión de Tareas | Portafolio RD",
  description: "Un tablero Kanban usando dnd-kit y zustand",
  icons: {
    icon: FAVICON_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
    </html>
  );
}
