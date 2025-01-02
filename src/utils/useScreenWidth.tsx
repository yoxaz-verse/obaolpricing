// import { useEffect, useState } from 'react';

// export type ScreenWidth = number | undefined;

// export function useScreenWidth(): ScreenWidth {
//   const [width, setWidth] = useState<ScreenWidth>();

//   useEffect(() => {
//     function handleResize() {
//       setWidth(window.innerWidth);
//     }

//     window.addEventListener('resize', handleResize);

//     handleResize(); // Call handler initially to set initial width

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return width;
// }
