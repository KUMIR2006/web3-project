import React from 'react';

export type arrowProps = {
  firstColor: string;
  secondColor: string;
  upgrading: boolean;
};

const Arrow: React.FC<arrowProps> = ({ firstColor, secondColor, upgrading }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: firstColor }}></div>

      <div
        className="h-[3px] w-[250px] text-center"
        style={{
          backgroundImage: `linear-gradient(to right, ${firstColor}, ${secondColor})`,
        }}>
        {upgrading ? 'burn to earn' : 'upgrading...'}
      </div>

      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: secondColor }}></div>
    </div>
  );
};

export default Arrow;
