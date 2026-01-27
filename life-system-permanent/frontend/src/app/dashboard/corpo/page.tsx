"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Plus } from "lucide-react"
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Body Tracker</h1>
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
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#2563eb" name="Weight (kg)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="muscle" stroke="#16a34a" name="Muscle (kg)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
