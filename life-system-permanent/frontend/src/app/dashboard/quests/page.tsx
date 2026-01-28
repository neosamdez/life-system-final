"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { CheckCircle, Clock, AlertTriangle, Sword } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Types
interface Quest {
  id: number
  title: string
  description: string
  xp_reward: number
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EPIC"
  category: "DAILY" | "STORY" | "SIDE_QUEST"
  is_completed: boolean
  expires_at?: string
  penalty_hp?: number
  is_healing?: boolean
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/quests/")
      setQuests(response.data)
    } catch (error) {
      console.error("Failed to fetch quests", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuests()
  }, [])

  const handleComplete = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/quests/${id}/complete`)
      fetchQuests() // Refresh list
    } catch (error) {
      console.error("Failed to complete quest", error)
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "EASY": return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "MEDIUM": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "HARD": return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      case "EPIC": return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
      default: return "bg-slate-500/10 text-slate-500"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quests</h1>
        <Button onClick={fetchQuests} variant="outline" size="sm">
          <Clock className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading quests...</div>
      ) : quests.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No active quests available.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quests.map((quest) => (
            <Card key={quest.id} className={`relative overflow-hidden border-l-4 ${quest.is_completed ? 'opacity-60' : ''} ${
              quest.difficulty === 'EPIC' ? 'border-l-purple-500' : 
              quest.difficulty === 'HARD' ? 'border-l-orange-500' : 
              quest.difficulty === 'MEDIUM' ? 'border-l-blue-500' : 'border-l-green-500'
            }`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
                    {quest.difficulty}
                  </Badge>
                  <Badge variant="secondary">{quest.category.replace('_', ' ')}</Badge>
                </div>
                <CardTitle className="mt-2 flex items-center gap-2">
                  {quest.is_healing && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  {quest.title}
                </CardTitle>
                <CardDescription>{quest.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-4 text-sm mt-2">
                  <div className="flex items-center gap-1 text-yellow-500 font-medium">
                    <Sword className="h-4 w-4" />
                    +{quest.xp_reward} XP
                  </div>
                  {quest.penalty_hp && quest.penalty_hp > 0 && (
                    <div className="flex items-center gap-1 text-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      -{quest.penalty_hp} HP
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={quest.is_completed}
                  onClick={() => handleComplete(quest.id)}
                  variant={quest.is_completed ? "secondary" : "default"}
                >
                  {quest.is_completed ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Completed
                    </>
                  ) : "Complete Quest"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
