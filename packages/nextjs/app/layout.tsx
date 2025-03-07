import "@rainbow-me/rainbowkit/styles.css";
import { NotificationProvider } from "~~/app/context/NotificationContext";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "muffled birds",
  description: "birdy game",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nosifer&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik+Scribble&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Faster+One&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?Bruno+Ace+SC&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?Modak&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider enableSystem>
          <NotificationProvider>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
