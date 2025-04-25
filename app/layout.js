// app/layout.js

export const metadata = {
  title: 'InstaGen AI',
  description: 'AI-generated Instagram usernames',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
