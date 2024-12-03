'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Plus } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { petSpeciesData } from '@/lib/pet-data'
import { db } from '@/lib/db'
import { Client, Pet } from '@/app/types'
import { Checkbox } from '@/components/ui/checkbox'

interface PetForm {
  name: string
  species: string
  breed: string
  gender: 'Male' | 'Female'
  age: {
    years: string
    months: string
    days: string
    weeks: string
  }
  dob: string
  attitude: string
}

interface AddClientDialogProps {
  onClientAdded: () => void
  editData?: {
    isOpen: boolean
    client?: Client
    pet?: Pet
  }
  onClose?: () => void
}

const generatePID = () => {
  return `P${Math.random().toString(36).substr(2, 6).toUpperCase()}`
}

export function AddClientDialog({ onClientAdded, editData, onClose }: AddClientDialogProps) {
  const { toast } = useToast()
  const [clientData, setClientData] = useState({
    title: 'Mr.',
    name: '',
    email: '',
    phone: '',
    secondaryPhone: '',
    address: '',
    nic: '',
    preferredLanguage: 'English',
    smsNotifications: true,
  })
  const [pets, setPets] = useState<PetForm[]>([{
    name: '',
    species: '',
    breed: '',
    gender: 'Male',
    age: {
      years: '',
      months: '',
      days: '',
      weeks: ''
    },
    dob: '',
    attitude: ''
  }])
  const [open, setOpen] = useState(false)
  const [unknownPatient, setUnknownPatient] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const resetForm = useCallback(() => {
    setClientData({
      title: 'Mr.',
      name: '',
      email: '',
      phone: '',
      secondaryPhone: '',
      address: '',
      nic: '',
      preferredLanguage: 'English',
      smsNotifications: true,
    })
    setPets([{
      name: '',
      species: '',
      breed: '',
      gender: 'Male',
      age: {
        years: '',
        months: '',
        days: '',
        weeks: ''
      },
      dob: '',
      attitude: ''
    }])
    setUnknownPatient(false)
    setIsEditing(false)
  }, [])

  const initializeForm = useCallback(() => {
    if (editData?.isOpen && editData.client && editData.pet) {
      setClientData(editData.client)
      setPets([{
        name: editData.pet.name,
        species: editData.pet.species,
        breed: editData.pet.breed,
        gender: editData.pet.gender,
        age: {
          years: editData.pet.age.years.toString(),
          months: editData.pet.age.months.toString(),
          days: editData.pet.age.days.toString(),
          weeks: editData.pet.age.weeks.toString()
        },
        dob: editData.pet.dob || '',
        attitude: editData.pet.attitude || ''
      }])
      setIsEditing(true)
      setOpen(true)
    }
  }, [editData])

  useEffect(() => {
    initializeForm()
  }, [initializeForm])

  const handleClientChange = (field: keyof typeof clientData, value: string | boolean) => {
    setClientData(prev => ({ ...prev, [field]: value }))
  }

  const handlePetChange = (index: number, field: keyof PetForm | keyof PetForm['age'], value: string) => {
    setPets(prev => {
      const newPets = [...prev]
      if (field in newPets[index].age) {
        newPets[index] = {
          ...newPets[index],
          age: {
            ...newPets[index].age,
            [field]: value
          }
        }
      } else {
        newPets[index] = {
          ...newPets[index],
          [field]: value
        }
      }
      return newPets
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && editData?.client && editData.pet) {
        db.updateClient(editData.client.id, clientData)
        db.updatePet(editData.pet.id, {
          ...pets[0],
          pid: editData.pet.pid,
          age: {
            years: parseInt(pets[0].age.years) || 0,
            months: parseInt(pets[0].age.months) || 0,
            days: parseInt(pets[0].age.days) || 0,
            weeks: parseInt(pets[0].age.weeks) || 0
          },
          ownerId: editData.client.id
        })

        toast({
          title: 'Success',
          description: 'Records updated successfully.',
        })
      } else {
        const newClient = db.addClient(clientData)

        pets.forEach(pet => {
          if (pet.name || unknownPatient) {
            db.addPet({
              ...pet,
              pid: generatePID(),
              age: {
                years: parseInt(pet.age.years) || 0,
                months: parseInt(pet.age.months) || 0,
                days: parseInt(pet.age.days) || 0,
                weeks: parseInt(pet.age.weeks) || 0
              },
              ownerId: newClient.id,
              id: ''
            })
          }
        })

        toast({
          title: 'Success',
          description: 'Client and pets have been registered successfully.',
        })
      }

      onClientAdded()
      setOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'register'} client. Please try again.`,
        variant: 'destructive',
      })
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Client' : 'Register New Client'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Select value={clientData.title} onValueChange={(value) => handleClientChange('title', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'].map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={clientData.name}
                  onChange={(e) => handleClientChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={clientData.phone}
                  onChange={(e) => handleClientChange('phone', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Phone</Label>
                <Input
                  value={clientData.secondaryPhone}
                  onChange={(e) => handleClientChange('secondaryPhone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={clientData.email}
                  onChange={(e) => handleClientChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>NIC</Label>
                <Input
                  value={clientData.nic}
                  onChange={(e) => handleClientChange('nic', e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Address</Label>
                <Input
                  value={clientData.address}
                  onChange={(e) => handleClientChange('address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select 
                  value={clientData.preferredLanguage}
                  onValueChange={(value) => handleClientChange('preferredLanguage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {['English', 'Spanish', 'French'].map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smsNotifications"
                  checked={clientData.smsNotifications}
                  onCheckedChange={(checked) => 
                    handleClientChange('smsNotifications', checked as boolean)
                  }
                />
                <Label htmlFor="smsNotifications">Enable SMS Notifications</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium">Pet Information</h3>
              <Checkbox
                id="unknownPatient"
                checked={unknownPatient}
                onCheckedChange={(checked) => setUnknownPatient(checked as boolean)}
              />
              <Label htmlFor="unknownPatient">Unknown Patient</Label>
            </div>
            
            {pets.map((pet, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pet Name</Label>
                    <Input
                      value={pet.name}
                      onChange={(e) => handlePetChange(index, 'name', e.target.value)}
                      required={!unknownPatient}
                      disabled={unknownPatient}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Species</Label>
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
                    <Label>Breed</Label>
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
                        {petSpeciesData
                          .find(data => data.species === pet.species)
                          ?.breeds.map((breed) => (
                            <SelectItem key={breed} value={breed}>
                              {breed}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={pet.gender}
                      onValueChange={(value) => handlePetChange(index, 'gender', value as 'Male' | 'Female')}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Years</Label>
                      <Input
                        type="number"
                        min="0"
                        value={pet.age.years}
                        onChange={(e) => handlePetChange(index, 'years', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Months</Label>
                      <Input
                        type="number"
                        min="0"
                        max="11"
                        value={pet.age.months}
                        onChange={(e) => handlePetChange(index, 'months', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weeks</Label>
                      <Input
                        type="number"
                        min="0"
                        max="3"
                        value={pet.age.weeks}
                        onChange={(e) => handlePetChange(index, 'weeks', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Days</Label>
                      <Input
                        type="number"
                        min="0"
                        max="6"
                        value={pet.age.days}
                        onChange={(e) => handlePetChange(index, 'days', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={pet.dob}
                      onChange={(e) => handlePetChange(index, 'dob', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Attitude/Personality</Label>
                    <Input
                      value={pet.attitude}
                      onChange={(e) => handlePetChange(index, 'attitude', e.target.value)}
                      placeholder="e.g., Friendly, Aggressive, Shy"
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
            <Button type="submit">{isEditing ? 'Update' : 'Register'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}