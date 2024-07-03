import React from 'react';
import dynamic from 'next/dynamic.js';

const Web = dynamic(() => import('./Web'), {
  ssr: false
});

const Mobile = dynamic(() => import('./Mobile'), {
  ssr: false
});

export default function List({ data }: { data: any }) {
  
  return (
    <div>
      <Mobile data={data} />
      <Web data={data} />
    </div>
  );
}
