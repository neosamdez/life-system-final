"use client"

import { useState, useEffect } from "react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import axios from "axios"
import { User, Mail, Shield, Zap, Brain, Target, Heart } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Types
interface PlayerStats {
  level: number
  current_xp: number
  hp: number
  strength: number
  intelligence: number
  focus: number
  quests_completed: number
}

interface UserProfile {
  id: number
  username: string
  email: string
  is_active: boolean
  created_at: string
}

export default function ProfilePage() {
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [statsRes, userRes] = await Promise.all([
        axios.get("http://localhost:8000/api/v1/stats/"),
        axios.get("http://localhost:8000/api/v1/auth/me")
      ])
      setStats(statsRes.data)
      setUser(userRes.data)
    } catch (error) {
      console.error("Failed to fetch profile data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div className="p-6 text-center">Loading profile...</div>
  if (!stats || !user) return <div className="p-6 text-center">Failed to load profile.</div>

  const chartData = [
    { subject: 'Strength', A: stats.strength, fullMark: 100 },
    { subject: 'Intelligence', A: stats.intelligence, fullMark: 100 },
    { subject: 'Focus', A: stats.focus, fullMark: 100 },
    { subject: 'Vitality', A: Math.min(stats.hp / 10, 100), fullMark: 100 }, // Scaling HP roughly
    { subject: 'Agility', A: 50, fullMark: 100 }, // Mock data for shape
    { subject: 'Sense', A: 60, fullMark: 100 }, // Mock data for shape
  ]

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Hunter Profile</h1>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="text-2xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <Badge className="mt-2" variant="outline">Rank E-Hunter</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Level</span>
              </div>
              <span className="font-bold">{stats.level}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>XP Progress</span>
                <span>{stats.current_xp} / {stats.level * 1000}</span>
              </div>
              <Progress value={(stats.current_xp / (stats.level * 1000)) * 100} className="h-2" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Quests</span>
              </div>
              <span className="font-bold">{stats.quests_completed}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Radar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ability Parameters</CardTitle>
            <CardDescription>Current combat capabilities</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Player" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              <div className="text-2xl font-bold">{stats.strength}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <div className="text-2xl font-bold">{stats.intelligence}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              <div className="text-2xl font-bold">{stats.focus}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
