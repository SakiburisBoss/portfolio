// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 👇 Add this block */}
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg+xml"
        />
        
        {/* Optional: Safari fallback */}
        <link
          rel="alternate icon"
          href="/favicon.ico"
          type="image/x-icon"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}