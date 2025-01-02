// src/app/not-found.tsx or src/pages/404.tsx (depending on your Next.js version)

"use client"; // Enables the component to use React hooks and client-side features

const NotFound = () => {
  // While authentication status is being determined, show a loading indicator
  return (
    <div className="flex h-screen justify-center items-center">
      <p>Not FOund</p>
    </div>
  );
};

export default NotFound;
