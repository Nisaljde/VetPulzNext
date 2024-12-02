'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search } from 'lucide-react'
import { AddClientDialog } from './add-client-dialog'
import { db } from '@/lib/db'
import { Client, Pet } from '@/app/types'

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [pets, setPets] = useState<Pet[]>([])

  const loadData = () => {
    setClients(db.getClients())
    setPets(db.getPets())
  }

  // Initial data load
  useEffect(() => {
    loadData()
  }, [])

  const getPetsByClientId = (clientId: string) => {
    return pets
      .filter(pet => pet.ownerId === clientId)
      .map(pet => `${pet.name} (${pet.species})`)
      .join(', ')
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients & Pets</h1>
        <AddClientDialog onClientAdded={loadData} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Pets</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone || '-'}</TableCell>
                  <TableCell>{getPetsByClientId(client.id) || '-'}</TableCell>
                  <TableCell>
                    <button className="text-sm text-primary hover:underline">
                      View Details
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No clients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}