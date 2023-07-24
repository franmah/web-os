'use client';

import { FC, useContext, useEffect, useState } from 'react';
import { FileSystemContext } from '../../contexts/FileSystemContext';
import { Document, Page, pdfjs } from 'react-pdf';

const PdfReader: FC<{ params: any }> = ({ params }) => {

  console.log('open pdf');

  const fs = useContext(FileSystemContext);

  const [pdfAsString, setPdfAsString] = useState<string>('');

  useEffect(() => {
    // TODO: only load worker if not already loaded
   pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  });

  useEffect(() => {
    const filePath = params.filePath;

    try {
      const fileItem = fs.readFile(filePath);
      // const reader =
      setPdfAsString(fileItem?.content);

    } catch (error) {
      console.error(`Error reading pdf file content: ${error}`);
    }

  });

  return (
    <Document file='/resume.pdf' style={{width: '100%', height: '100%'}}>
      <Page pageNumber={1}/>
    </Document>
  );

};

export default PdfReader;
