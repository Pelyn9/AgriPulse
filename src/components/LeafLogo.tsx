import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface LeafLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-10 w-10 rounded-xl',
  md: 'h-14 w-14 rounded-2xl',
  lg: 'h-24 w-24 rounded-[1.75rem]',
};

export function LeafLogo({ size = 'md', animated = false, className }: LeafLogoProps) {
  const image = (
    <img
      src="/riceleaf-icon.svg"
      alt="RiceLeaf AI"
      className={cn(sizeMap[size], 'shadow-glass ring-1 ring-white/35', className)}
    />
  );

  if (!animated) {
    return image;
  }

  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [-2, 3, -2] }}
      transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
    >
      {image}
    </motion.div>
  );
}
