'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { petSpeciesData } from '@/lib/pet-data'
import { db } from '@/lib/db'

interface PetForm {
  name: string
  species: string
  breed: string
  age: string
}

export function AddClientDialog({ onClientAdded }: { onClientAdded: () => void }) {
  const { toast } = useToast()
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [pets, setPets] = useState<PetForm[]>([{ name: '', species: '', breed: '', age: '' }])
  const [open, setOpen] = useState(false)

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientData({
      ...clientData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePetChange = (index: number, field: keyof PetForm, value: string) => {
    const newPets = [...pets]
    newPets[index] = {
      ...newPets[index],
      [field]: value,
    }
    // Reset breed if species changes
    if (field === 'species') {
      newPets[index].breed = ''
    }
    setPets(newPets)
  }

  const getBreedsBySpecies = (species: string) => {
    return petSpeciesData.find(data => data.species === species)?.breeds || []
  }

  const addPet = () => {
    setPets([...pets, { name: '', species: '', breed: '', age: '' }])
  }

  const removePet = (index: number) => {
    setPets(pets.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Add client to database
      const newClient = db.addClient(clientData)
      
      // Add pets to database
      pets.forEach(pet => {
        if (pet.name) { // Only add pets with names
          db.addPet({
            ...pet,
            age: parseInt(pet.age) || 0,
            ownerId: newClient.id
          })
        }
      })
      
      // Show success message
      toast({
        title: 'Success',
        description: 'Client and pets have been registered successfully.',
      })
      
      // Update the client list
      onClientAdded()
      
      // Close dialog and reset form
      setOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register client. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setClientData({ name: '', email: '', phone: '', address: '' })
    setPets([{ name: '', species: '', breed: '', age: '' }])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={clientData.name}
                  onChange={handleClientChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={clientData.email}
                  onChange={handleClientChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={clientData.phone}
                  onChange={handleClientChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={clientData.address}
                  onChange={handleClientChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Pets</h3>
              <Button type="button" variant="outline" size="sm" onClick={addPet}>
                <Plus className="h-4 w-4 mr-1" /> Add Pet
              </Button>
            </div>
            {pets.map((pet, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                {pets.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removePet(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`pet-name-${index}`}>Pet Name</Label>
                    <Input
                      id={`pet-name-${index}`}
                      value={pet.name}
                      onChange={(e) => handlePetChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pet-species-${index}`}>Species</Label>
                    <Select
                      value={pet.species}
                      onValueChange={(value) => handlePetChange(index, 'species', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent>
                        {petSpeciesData.map((data) => (
                          <SelectItem key={data.species} value={data.species}>
                            {data.species}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pet-breed-${index}`}>Breed</Label>
                    <Select
                      value={pet.breed}
                      onValueChange={(value) => handlePetChange(index, 'breed', value)}
                      disabled={!pet.species}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select breed" />
                      </SelectTrigger>
                      <SelectContent>
                        {getBreedsBySpecies(pet.species).map((breed) => (
                          <SelectItem key={breed} value={breed}>
                            {breed}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pet-age-${index}`}>Age</Label>
                    <Input
                      id={`pet-age-${index}`}
                      type="number"
                      min="0"
                      value={pet.age}
                      onChange={(e) => handlePetChange(index, 'age', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Register Client</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}