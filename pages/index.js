import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the Mars Clock component (client-side only)
const MarsClockLive = dynamic(() => import('../app'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>The Mars Clock - Live Earth & Mars Time Synchronization</title>
        <meta name="description" content="Real-time Mars clock tracking time on two worlds. Coordinated Mars Time (MTC) using NASA Mars24 Algorithm." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1e293b" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Mars Clock" />
        <meta property="og:description" content="Tracking time on two worlds. Real-time Earth and Mars synchronization." />
        <meta property="og:site_name" content="The Mars Clock" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Mars Clock" />
        <meta name="twitter:description" content="Real-time Mars time tracking using NASA Mars24 Algorithm." />
        
        {/* Favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔴⏰</text></svg>" />
        
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://cdn.tailwindcss.com" />
      </Head>

      <main className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <MarsClockLive />
      </main>
    </>
  );
}
