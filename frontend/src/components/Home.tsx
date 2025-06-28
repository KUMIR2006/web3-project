import React from 'react';
import { Github, Zap, Coins, Flame, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Types
interface NFTCharacter {
  color: string;
  helmet: string;
}

interface Feature {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  title: string;
  description: string;
}

interface ListItem {
  text: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    iconColor: 'text-[#a07b3b]',
    title: 'Daily Minting',
    description: 'Mint new NFTs every 24h with cooldown logic.',
  },
  {
    icon: Flame,
    iconColor: 'text-[#4f4f9e]',
    title: 'Upgrade with Burning',
    description: 'Burn 3 same-tier NFTs to get a higher-tier one',
  },
  {
    icon: Wrench,
    iconColor: 'text-[#94459b]',
    title: 'ERC-20 & ERC-1155',
    description: 'Smooth integration of both standards.',
  },
];

// Components
const Button: React.FC<{
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}> = ({ variant = 'primary', children, onClick, className = '', fullWidth = false }) => {
  const baseClasses = 'px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-110';
  const widthClass = fullWidth ? 'w-full' : '';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#451e48] to-[#232c7e] hover:from-[#351738] hover:to-[#1c246b]',
    secondary: 'border border-gray-600 hover:border-gray-400',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      onClick={onClick}>
      {children}
    </button>
  );
};

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  const IconComponent = feature.icon;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <IconComponent className={feature.iconColor} size={32} />
        <h3 className="text-[22px]">{feature.title}</h3>
      </div>
      <p className="text-gray-300">{feature.description}</p>
    </div>
  );
};

const FeatureList: React.FC<{ items: ListItem[]; iconColor?: string }> = ({
  items,
  iconColor = 'bg-green-400',
}) => (
  <ul className="space-y-4">
    {items.map((item, index) => (
      <li key={index} className="flex items-center gap-3">
        <div className={`w-2 h-2 ${iconColor} rounded-full`}></div>
        <span>{item.text}</span>
      </li>
    ))}
  </ul>
);

const TokenFeatureList: React.FC<{ items: ListItem[] }> = ({ items }) => {
  const icons = [Coins, Flame, Zap];
  const colors = ['text-green-400', 'text-orange-400', 'text-blue-400'];

  return (
    <ul className="space-y-4">
      {items.map((item, index) => {
        const IconComponent = icons[index];
        return (
          <li key={index} className="flex items-center gap-3">
            <IconComponent className={colors[index]} size={20} />
            <span>{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between mb-20">
      <div className="lg:w-1/2 mb-8 lg:mb-0">
        <h1 className="text-6xl mb-6 leading-tight">
          Upgrade your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2e39a0] to-[#6f3075]">
            NFT Army
          </span>{' '}
          on
          <br />
          Monad
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          A dynamic NFT experience with real on-chain mechanics.
        </p>
        <div className="flex gap-4">
          <Button className="cursor-pointer" onClick={() => navigate('/nft')}>
            Mint NFT
          </Button>
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => window.open('https://github.com/KUMIR2006/web3-project', '_blank')}>
            <Github size={20} />
            GitHub Repo
          </Button>
        </div>
      </div>

      <div className="lg:w-1/2 flex justify-center">
        <div className="flex gap-4">
          <img src="/nftcollection.png" alt="NFTcollection" />
        </div>
      </div>
    </div>
  );
};

const FeaturesSection: React.FC = () => (
  <div className="mb-2">
    <h2 className="text-4xl text-center mb-12">Core Mechanics of Affiliate</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {FEATURES.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </div>
  </div>
);

// Main Component
const Home: React.FC = () => {
  return (
    <div className="text-white">
      <div className="container mx-auto px-40 py-16">
        <HeroSection />
        <FeaturesSection />
      </div>
    </div>
  );
};

export default Home;
