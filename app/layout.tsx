import { ReactNode } from "react";
import StyledJsxRegistry from "./registry";

export const metadata = {
  title: "Listo",
  description: "Listo app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
