'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, FileText, Eye, Edit, Trash, History } from 'lucide-react'
import { AddClientDialog } from './add-client-dialog'
import { db } from '@/lib/db'
import { Client, Pet } from '@/app/types'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/components/ui/use-toast'

export default function ClientsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [registeredToday, setRegisteredToday] = useState(0)
  const [inQueue, setInQueue] = useState(0)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    clientId: string
    petId: string
  }>({ isOpen: false, clientId: '', petId: '' })
  const [editData, setEditData] = useState<{
    isOpen: boolean
    client?: Client
    pet?: Pet
  }>({ isOpen: false })

  const loadData = () => {
    setClients(db.getClients())
    setPets(db.getPets())
    setRegisteredToday(0)
    setInQueue(0)
  }

  useEffect(() => {
    loadData()
  }, [])

  const getPetsByClientId = (clientId: string) => {
    return pets.filter(pet => pet.ownerId === clientId)
  }

  const handleDelete = async () => {
    try {
      const { clientId, petId } = deleteDialog
      db.deletePet(petId)
      
      // Check if this was the client's last pet
      const remainingPets = db.getPetsByOwnerId(clientId)
      if (remainingPets.length === 0) {
        db.deleteClient(clientId)
      }
      
      toast({
        title: 'Success',
        description: 'Record deleted successfully.',
      })
      
      loadData()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete record.',
        variant: 'destructive',
      })
    } finally {
      setDeleteDialog({ isOpen: false, clientId: '', petId: '' })
    }
  }

  const handleEdit = (client: Client, pet: Pet) => {
    setEditData({
      isOpen: true,
      client,
      pet,
    })
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients & Pets</h1>
        <div className="flex items-center gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Registered Today</div>
              <div className="stat-value text-primary">{registeredToday}</div>
            </div>
            <div className="stat">
              <div className="stat-title">In Queue</div>
              <div className="stat-value text-secondary">{inQueue}</div>
            </div>
          </div>
          <AddClientDialog 
            onClientAdded={loadData} 
            editData={editData} 
            onClose={() => setEditData({ isOpen: false })}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, mobile number..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>PID</TableHead>
                  <TableHead>Species & Breed</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Mobile No & NIC</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const clientPets = getPetsByClientId(client.id)
                  return clientPets.map((pet, petIndex) => (
                    <TableRow key={`${client.id}-${pet.id}`}>
                      <TableCell>
                        {petIndex === 0 ? `${client.title} ${client.name}` : ''}
                      </TableCell>
                      <TableCell>{pet.name}</TableCell>
                      <TableCell>{pet.pid}</TableCell>
                      <TableCell>{`${pet.species} / ${pet.breed}`}</TableCell>
                      <TableCell>{pet.gender}</TableCell>
                      <TableCell>
                        {petIndex === 0 ? (
                          <div>
                            <div>{client.phone}</div>
                            {client.nic && <div className="text-sm text-gray-500">{client.nic}</div>}
                          </div>
                        ) : ''}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(client, pet)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <History className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => setDeleteDialog({
                              isOpen: true,
                              clientId: client.id,
                              petId: pet.id,
                            })}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                })}
                {filteredClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No clients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredClients.length} of {clients.length} entries
            </div>
            <div className="join">
              <Button variant="outline" className="join-item">First</Button>
              <Button variant="outline" className="join-item">Previous</Button>
              <Button variant="outline" className="join-item">1</Button>
              <Button variant="outline" className="join-item">Next</Button>
              <Button variant="outline" className="join-item">Last</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => 
        setDeleteDialog(prev => ({ ...prev, isOpen }))
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}