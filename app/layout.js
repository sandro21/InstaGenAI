// app/layout.js
export const layout = {
    title: 'InstaGen AI',
    description: 'AI-generated Instagram usernames',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
             rel="stylesheet"
        />
      </head>
        <body>
          {children}
        </body>
      </html>
    );
  }
  