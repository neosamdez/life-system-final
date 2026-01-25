import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, Zap } from 'lucide-react';
import { Quest } from '@/services/gamification';

interface QuestBoardProps {
  quests: Quest[];
  onComplete: (questId: number) => void;
}

const QuestBoard: React.FC<QuestBoardProps> = ({ quests, onComplete }) => {
  return (
    <div className="w-full">
      <h2 className="text-[#45A29E] text-lg font-bold mb-4 border-b border-[#45A29E]/30 pb-2">
        Active Quests
      </h2>
      
      <div className="space-y-4">
        <AnimatePresence>
          {quests.length === 0 ? (
            <div className="text-gray-500 italic text-center py-8">No active quests.</div>
          ) : (
            quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onComplete={onComplete} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const QuestCard = ({ quest, onComplete }: { quest: Quest, onComplete: (id: number) => void }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'S': return 'border-[#FFD700] shadow-[0_0_10px_#FFD700]';
      case 'A': return 'border-red-500 shadow-[0_0_10px_#ef4444]';
      case 'B': return 'border-blue-500 shadow-[0_0_10px_#3b82f6]';
      case 'C': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-[#0B0C10] border-l-4 p-4 rounded-r-lg relative overflow-hidden group ${getDifficultyColor(quest.difficulty)}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded bg-opacity-20 ${
              quest.difficulty === 'S' ? 'bg-[#FFD700] text-[#FFD700]' : 'bg-gray-500 text-gray-300'
            }`}>
              RANK {quest.difficulty}
            </span>
            <h3 className="text-white font-bold">{quest.title}</h3>
          </div>
          <p className="text-gray-400 text-sm mb-3">{quest.description}</p>
          
          <div className="flex gap-4 text-xs text-[#45A29E]">
            <div className="flex items-center gap-1">
              <AlertTriangle size={12} />
              <span>XP: {quest.xp_reward}</span>
            </div>
            {quest.attribute_reward && (
              <div className="flex items-center gap-1">
                <Zap size={12} />
                <span>Reward: {quest.attribute_reward}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onComplete(quest.id)}
          className="ml-4 p-2 rounded-full border border-[#45A29E] text-[#45A29E] hover:bg-[#45A29E] hover:text-black transition-all duration-300 group-hover:scale-110"
        >
          <CheckCircle size={24} />
        </button>
      </div>
    </motion.div>
  );
};

export default QuestBoard;
