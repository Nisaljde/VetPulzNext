'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface QueueItem {
  token: number
  patientName: string
  appointmentType: string
  status: 'waiting' | 'in-progress' | 'completed'
  waitingTime: number
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      token: 1,
      patientName: 'Max (John Doe)',
      appointmentType: 'Consultation',
      status: 'in-progress',
      waitingTime: 15
    },
    {
      token: 2,
      patientName: 'Luna (Jane Smith)',
      appointmentType: 'Vaccination',
      status: 'waiting',
      waitingTime: 0
    }
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setQueue(currentQueue =>
        currentQueue.map(item => ({
          ...item,
          waitingTime: item.status === 'waiting' ? item.waitingTime + 1 : item.waitingTime
        }))
      )
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Queue Management</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waiting Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((item) => (
                  <TableRow key={item.token}>
                    <TableCell className="font-medium">#{item.token}</TableCell>
                    <TableCell>{item.patientName}</TableCell>
                    <TableCell>{item.appointmentType}</TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === 'waiting' ? 'secondary' :
                        item.status === 'in-progress' ? 'default' : 'success'
                      }>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.waitingTime} mins</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Now Serving</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-6xl font-bold text-primary mb-4">
                #{queue.find(item => item.status === 'in-progress')?.token || '-'}
              </p>
              <p className="text-lg text-muted-foreground">
                {queue.find(item => item.status === 'in-progress')?.patientName || 'No patient currently being served'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}