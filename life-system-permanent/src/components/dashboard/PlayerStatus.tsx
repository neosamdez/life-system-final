import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Brain, Activity } from 'lucide-react';
import { PlayerStats } from '@/services/gamification';

interface PlayerStatusProps {
  stats: PlayerStats | null;
}

const PlayerStatus: React.FC<PlayerStatusProps> = ({ stats }) => {
  if (!stats) return <div className="text-white">Loading System...</div>;

  const xpPercentage = (stats.current_xp / (stats.level * 100)) * 100;

  return (
    <div className="bg-[#0B0C10] border-2 border-[#45A29E] p-6 rounded-lg shadow-[0_0_15px_rgba(69,162,158,0.3)] w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#45A29E] text-sm tracking-widest uppercase font-bold">Player Status</h2>
          <h1 className="text-white text-2xl font-bold mt-1">Shadow Monarch</h1>
        </div>
        <div className="text-right">
          <span className="text-[#45A29E] text-xs uppercase">Level</span>
          <div className="text-[#FFD700] text-4xl font-mono font-bold leading-none">{stats.level}</div>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#45A29E] mb-1">
          <span>HP</span>
          <span className="font-mono">{stats.hp} / {stats.hp}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-red-600"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-[#45A29E] mb-1">
          <span>XP</span>
          <span className="font-mono">{stats.current_xp} / {stats.level * 100}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#45A29E]"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 gap-4">
        <AttributeBox icon={<Shield size={18} />} label="Strength" value={stats.strength} />
        <AttributeBox icon={<Brain size={18} />} label="Intelligence" value={stats.intelligence} />
        <AttributeBox icon={<Activity size={18} />} label="Vitality" value={stats.focus} /> {/* Using Focus as Vitality equivalent for now based on prompt mapping */}
        <AttributeBox icon={<Zap size={18} />} label="Agility" value={stats.focus} /> {/* Placeholder, using Focus again or maybe derive? */}
      </div>
    </div>
  );
};

const AttributeBox = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="bg-[#1F2833] p-3 rounded border border-[#45A29E]/30 flex items-center justify-between">
    <div className="flex items-center gap-2 text-[#45A29E]">
      {icon}
      <span className="text-xs uppercase">{label}</span>
    </div>
    <span className="text-white font-mono font-bold">{value}</span>
  </div>
);

export default PlayerStatus;
