"use client";

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CoinFlipProps {
  isFlipping: boolean;
}

const CoinFlip: React.FC<CoinFlipProps> = ({ isFlipping }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isFlipping) {

      controls.start({
        rotateY: [0, 180, 360, 540, 720, 1080],
        transition: {
          times: [0, 0.3, 0.6, 1], 
          duration: 1, 
          ease: ['easeOut', 'easeIn', 'linear'], 
          repeat:Infinity, 
          repeatType: 'loop',
        },
      });
    } else {
      controls.stop();
    }
  }, [isFlipping, controls]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-xl font-bold text-white"
        animate={controls}
      >
        Coin
      </motion.div>
    </div>
  );
};

export default CoinFlip;
