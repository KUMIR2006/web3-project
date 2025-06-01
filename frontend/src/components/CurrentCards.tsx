import React from 'react';

export type currentCartProps = {
  amount: number;
  id: number;
  color: string;
  alt: string;
  circleText: string | number;
};

const CurrentCart: React.FC<currentCartProps> = ({ id, color, alt, circleText }) => {
  return (
    <div
      className="relative w-30 h-30 border rounded-[25px] overflow-hidden transition-transform duration-200  group "
      style={{ borderColor: color }}>
      <img src={`/nft/${id}.png`} alt={alt} className="w-full h-full object-cover rounded-[25px]" />
      <div
        className={`
          absolute bottom-2 right-2 w-8 h-8 text-sm bg-[rgb(28, 28, 28)] border-white/20
          rounded-full backdrop-blur-sm border
          flex items-center justify-center
          text-white font-semibold
          transition-all duration-300 ease-out
          pointer-events-none
        `}>
        {circleText}
      </div>
    </div>
  );
};

export default CurrentCart;
