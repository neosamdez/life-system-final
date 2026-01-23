"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sword, Shield, Zap, Heart } from "lucide-react";

export default function DashboardPage() {
  // Mock data for now
  const playerStats = {
    level: 1,
    xp: 450,
    xpRequired: 1000,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    strength: 10,
    agility: 8,
    intelligence: 5,
  };

  const xpPercentage = (playerStats.xp / playerStats.xpRequired) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, Hunter</h2>
        <p className="text-muted-foreground">Ready to complete your daily quests?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <TrophyIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{playerStats.level}</div>
            <p className="text-xs text-muted-foreground">
              {playerStats.xp} / {playerStats.xpRequired} XP
            </p>
            <Progress value={xpPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{playerStats.hp} / {playerStats.maxHp}</div>
            <Progress value={(playerStats.hp / playerStats.maxHp) * 100} className="mt-2 h-2 bg-red-950 [&>div]:bg-red-500" />
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mana</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{playerStats.mp} / {playerStats.maxMp}</div>
            <Progress value={(playerStats.mp / playerStats.maxMp) * 100} className="mt-2 h-2 bg-blue-950 [&>div]:bg-blue-500" />
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stats</CardTitle>
            <Sword className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Sword className="h-3 w-3 text-red-400" /> STR: {playerStats.strength}
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-blue-400" /> AGI: {playerStats.agility}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Active Quests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No active quests. Check the Quest Board.</p>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You logged in.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
