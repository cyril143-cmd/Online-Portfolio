
import "./globals.css";

export const metadata = {
  title: "PortfolioGen | Create Your Portfolio",
  description: "Create a professional portfolio in minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}