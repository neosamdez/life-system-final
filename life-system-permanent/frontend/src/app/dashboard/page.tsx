'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PlayerStatus from '@/components/dashboard/PlayerStatus';
import QuestBoard from '@/components/dashboard/QuestBoard';
import { gamificationService, PlayerStats, Quest } from '@/services/gamification';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelUp, setLevelUp] = useState<{ show: boolean; level: number }>({ show: false, level: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const [statsData, questsData] = await Promise.all([
          gamificationService.getStats(token),
          gamificationService.getQuests(token)
        ]);
        setStats(statsData);
        setQuests(questsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleCompleteQuest = async (questId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await gamificationService.completeQuest(questId, token);
      
      // Update local state
      setQuests(prev => prev.filter(q => q.id !== questId));
      
      // Refresh stats
      const newStats = await gamificationService.getStats(token);
      setStats(newStats);

      // Check for Level Up
      if (response.level_up && response.new_level) {
        setLevelUp({ show: true, level: response.new_level });
        setTimeout(() => setLevelUp({ show: false, level: 0 }), 3000);
      }
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-[#45A29E]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#45A29E] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white p-4 md:p-8 font-sans selection:bg-[#45A29E] selection:text-black">
      {/* Level Up Overlay */}
      {levelUp.show && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div className="text-center">
            <h1 className="text-[#FFD700] text-6xl font-bold mb-4 animate-pulse">LEVEL UP!</h1>
            <p className="text-white text-2xl">You have reached Level {levelUp.level}</p>
          </div>
        </motion.div>
      )}

      <header className="mb-8 border-b border-[#45A29E]/30 pb-4">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-[#45A29E]">SYSTEM</span> DASHBOARD
        </h1>
        <p className="text-gray-400 text-sm mt-1">Daily Quests: Player Neosam</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Player Stats */}
        <div className="lg:col-span-1">
          <PlayerStatus stats={stats} />
        </div>

        {/* Right Column: Quest Board */}
        <div className="lg:col-span-2">
          <QuestBoard quests={quests} onComplete={handleCompleteQuest} />
        </div>
      </div>
    </div>
  );
}
