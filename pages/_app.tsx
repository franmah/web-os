import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    const preventContextMenuDefault = (event: MouseEvent) => {
      event.preventDefault();
    }
    document.addEventListener('contextmenu', preventContextMenuDefault, true);

    return () => 
      document.removeEventListener('contextmenu', preventContextMenuDefault, true);
    ;
    
  });

  return <Component {...pageProps}/>;
}

export default MyApp;