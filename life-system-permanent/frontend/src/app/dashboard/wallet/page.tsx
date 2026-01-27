"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Plus } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Types
interface Transaction {
  id: number
  type: "INCOME" | "EXPENSE"
  amount: number
  category: string
  description: string
  date: string
  is_fixed: boolean
}

export default function WalletPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  
  const { register, handleSubmit, reset, setValue } = useForm()

  const fetchTransactions = async () => {
    try {
      // Assuming API proxy is set up or full URL needed. 
      // Using relative path assuming Next.js rewrites or same domain.
      // If not, might need env var.
      const response = await axios.get("http://localhost:8000/api/v1/finance/")
      setTransactions(response.data)
    } catch (error) {
      console.error("Failed to fetch transactions", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const onSubmit = async (data: any) => {
    try {
      await axios.post("http://localhost:8000/api/v1/finance/", {
        ...data,
        amount: parseFloat(data.amount),
        date: new Date().toISOString(), // Simple 'now' for date
        is_fixed: false // Default for now
      })
      setOpen(false)
      reset()
      fetchTransactions()
    } catch (error) {
      console.error("Failed to create transaction", error)
    }
  }

  // Process data for chart
  const chartData = transactions.reduce((acc: any[], curr) => {
    const date = new Date(curr.date).toLocaleDateString()
    const existing = acc.find(item => item.date === date)
    if (existing) {
      if (curr.type === "INCOME") existing.income += curr.amount
      else existing.expense += curr.amount
    } else {
      acc.push({
        date,
        income: curr.type === "INCOME" ? curr.amount : 0,
        expense: curr.type === "EXPENSE" ? curr.amount : 0
      })
    }
    return acc
  }, []).slice(-7) // Last 7 days/entries

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Record a new income or expense.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select onValueChange={(v) => setValue("type", v)} defaultValue="EXPENSE">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" step="0.01" {...register("amount", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input {...register("category", { required: true })} placeholder="e.g. Food, Salary" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input {...register("description")} />
              </div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Income vs Expense (Recent)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No transactions yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.slice(0, 5).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="font-medium">{t.category}</div>
                        <div className="text-xs text-muted-foreground">{t.description}</div>
                      </TableCell>
                      <TableCell className={`text-right ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
