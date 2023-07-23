import React, { FC, useEffect, useRef, useState } from 'react';

import { DosPlayer as Instance, DosPlayerFactoryType } from 'js-dos';

declare const Dos: DosPlayerFactoryType;

const DosComponent: FC<{ params: any }> = ({ params }) => {

  const rootRef = useRef<HTMLDivElement>(null);

  const [dos, setDos] = useState<Instance | null>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (rootRef === null || rootRef.current === null) {
      return;
    }

    loadScript()
    .then(() => loadStyle())
    .then(() => {

      (window as any).emulators.pathPrefix = '/js-dos/';
      const root = rootRef.current as HTMLDivElement;
      const instance = Dos(root);

      setDos(instance);
      instanceRef.current = instance;
    })
    .catch(error => console.error(error));

    return (() => instanceRef?.current?.stop());
  }, [rootRef]);

  useEffect(() => {
    if (dos !== null) {
      dos.run(params.dosFilePath);
    }
  }, [dos]);

  return (
    <div ref={rootRef} style={{ width: '100%', height: '100%' }}>
    </div>
  );
};

export default DosComponent;

export const loadScript = (): Promise<Event> =>
  new Promise((resolve, reject) => {
    const src = '/js-dos/js-dos.js';
    const loadedScripts = [...document.scripts];

    if (loadedScripts.find(script => script.src.endsWith(src))) {
      resolve(new Event('Already loaded.'));
    } else {
      const script = document.createElement('script');

      script.async = false;
      script.src = src;
      script.onerror = event => reject(event);
      script.onload = event => resolve(event);

      document.head.appendChild(script);
    }
 }
);

export const loadStyle = (): Promise<Event> =>
  new Promise((resolve, reject) => {
    const href = '/js-dos/js-dos.css';
    const loadedLinks = [...document.getElementsByTagName('link')];

    if (loadedLinks.find(link => link.href.endsWith(href))) {
      resolve(new Event('Already loaded.'));
    } else {
      const link = document.createElement('link');

      link.rel = 'stylesheet';
      link.href = href;
      link.onerror = event => reject(event);
      link.onload = event => resolve(event);

      document.head.appendChild(link);
    }
  }
);
