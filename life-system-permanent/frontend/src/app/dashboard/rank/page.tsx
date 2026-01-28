"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Trophy, Medal, Crown } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Types
interface RankUser {
  id: number
  name: string
  email: string
  level: number
  current_xp: number
  title?: string
}

export default function RankPage() {
  const [users, setUsers] = useState<RankUser[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRank = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/rank/")
      setUsers(response.data)
    } catch (error) {
      console.error("Failed to fetch rank", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRank()
  }, [])

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-500" />
      case 1: return <Medal className="h-6 w-6 text-gray-400" />
      case 2: return <Medal className="h-6 w-6 text-amber-700" />
      default: return <span className="font-bold text-muted-foreground">#{index + 1}</span>
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Hunters</CardTitle>
          <CardDescription>The strongest players in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading rankings...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Hunter</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Level</TableHead>
                  <TableHead className="text-right">XP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(index)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.title || "Novice"}</TableCell>
                    <TableCell className="text-right font-bold text-lg">{user.level}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{user.current_xp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
