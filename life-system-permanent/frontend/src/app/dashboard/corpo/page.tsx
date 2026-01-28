"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { Plus, Activity, Scale, Dumbbell } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Types
interface BodyMetric {
  id: number
  date: string
  weight: number
  muscle_mass?: number
  fat_percentage?: number
  photo_url?: string
}

export default function BodyPage() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  
  const { register, handleSubmit, reset } = useForm()

  const fetchMetrics = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/body/")
      // Sort by date ascending for chart
      const sorted = response.data.sort((a: BodyMetric, b: BodyMetric) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      setMetrics(sorted)
    } catch (error) {
      console.error("Failed to fetch body metrics", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      await axios.post("http://localhost:8000/api/v1/body/", {
        ...data,
        weight: parseFloat(data.weight),
        muscle_mass: data.muscle_mass ? parseFloat(data.muscle_mass) : undefined,
        fat_percentage: data.fat_percentage ? parseFloat(data.fat_percentage) : undefined,
        date: new Date().toISOString()
      })
      setOpen(false)
      reset()
      fetchMetrics()
    } catch (error) {
      console.error("Failed to create body metric", error)
    }
  }

  const chartData = metrics.map(m => ({
    date: new Date(m.date).toLocaleDateString(),
    weight: m.weight,
    muscle: m.muscle_mass
  }))

  const currentWeight = metrics.length > 0 ? metrics[metrics.length - 1].weight : 0
  const currentMuscle = metrics.length > 0 ? metrics[metrics.length - 1].muscle_mass : 0

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8" /> Body Tracker
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Log Stats
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Body Stats</DialogTitle>
              <DialogDescription>
                Track your physical evolution.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="number" step="0.1" {...register("weight", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Muscle Mass (kg) (Optional)</Label>
                <Input type="number" step="0.1" {...register("muscle_mass")} />
              </div>
              <div className="space-y-2">
                <Label>Fat Percentage (%) (Optional)</Label>
                <Input type="number" step="0.1" {...register("fat_percentage")} />
              </div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeight} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Muscle Mass</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMuscle || "-"} kg</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Evolution</CardTitle>
            <CardDescription>Weight & Muscle Mass over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {metrics.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data yet. Start logging!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis yAxisId="left" stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#3b82f6" name="Weight (kg)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="muscle" stroke="#22c55e" name="Muscle (kg)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
