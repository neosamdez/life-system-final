"use client"

import { useState, useEffect } from "react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import axios from "axios"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function ProfilePage() {
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/stats/")
      setStats(response.data)
    } catch (error) {
      console.error("Failed to fetch stats", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) return <div className="p-6">Loading...</div>
  if (!stats) return <div className="p-6">Failed to load profile.</div>

  const chartData = [
    { subject: 'Strength', A: stats.strength, fullMark: 100 },
    { subject: 'Intelligence', A: stats.intelligence, fullMark: 100 },
    { subject: 'Focus', A: stats.focus, fullMark: 100 },
    // Adding dummy points to make it a polygon if needed, or just these 3
    // A triangle is fine.
  ]

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
            <CardDescription>Your current stats</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                <Radar name="Player" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Level & Progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Level</span>
              <span>{stats.level}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">XP</span>
              <span>{stats.current_xp}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">HP</span>
              <span>{stats.hp}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Quests Completed</span>
              <span>{stats.quests_completed}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
