import "./globals.css";

export const metadata = { title: "Hello Richard.", description: "Catch stars. Make Richard proud." };

export default function Layout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
