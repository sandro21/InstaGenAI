// app/layout.js
export const layout = {
    title: 'InstaGen AI',
    description: 'AI-generated Instagram usernames',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    );
  }
  