'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ['0%', '0%', '50%', '50%', '0%'],
        }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
        }}
      >
        <Image src="/images/active.png" alt="logo" width={100} height={100} />
      </motion.div>
    </div>
  );
};

export default Loading;
