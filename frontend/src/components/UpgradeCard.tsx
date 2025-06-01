import React from 'react';

import PixelCard from '../blocks/Components/PixelCard/PixelCard';

interface UpgradeCardProps {
  title: string;
  count?: number;
  borderColor: string;
  colors: string;
  textColor: string;
  onClick?: () => void;
  disabled?: boolean;
  animate?: boolean;
  type: 'burn' | 'get';
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({
  title,
  count,
  borderColor,
  colors,
  textColor,
  onClick,
  disabled = false,
  animate = false,
  type,
}) => {
  return (
    <div
      className="cursor-pointer max-w-[150px] max-h-[175px]"
      style={{
        opacity: disabled ? 0.5 : 1,
        animation: animate ? 'pulse 2s infinite' : 'none',
      }}
      onClick={!disabled ? onClick : undefined}>
      <PixelCard
        variant="pink"
        className={`max-w-[150px] max-h-[175px]`}
        colors={colors}
        border={borderColor}>
        <div
          className={`absolute text-[20px] select-none font-semibold mix-blend-difference text-center`}
          style={{ color: textColor }}>
          {title}
          {type === 'burn' && <p className="text-[12px]">Have: {count ?? 0}</p>}
        </div>
      </PixelCard>
    </div>
  );
};

export default UpgradeCard;
