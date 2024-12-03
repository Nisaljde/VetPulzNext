import { Client, Pet } from '@/app/types'

// Simple in-memory database simulation
class Database {
  private clients: Client[] = []
  private pets: Pet[] = []
  private nextClientId = 1
  private nextPetId = 1

  addClient(client: Omit<Client, 'id'>): Client {
    const newClient = { ...client, id: String(this.nextClientId++) }
    this.clients.push(newClient)
    return newClient
  }

  updateClient(id: string, client: Omit<Client, 'id'>): Client {
    const index = this.clients.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Client not found')
    
    const updatedClient = { ...client, id }
    this.clients[index] = updatedClient
    return updatedClient
  }

  deleteClient(id: string): void {
    const index = this.clients.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Client not found')
    this.clients.splice(index, 1)
  }

  addPet(pet: Omit<Pet, 'id'>): Pet {
    const newPet = { ...pet, id: String(this.nextPetId++) }
    this.pets.push(newPet)
    return newPet
  }

  updatePet(id: string, pet: Omit<Pet, 'id'>): Pet {
    const index = this.pets.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Pet not found')
    
    const updatedPet = { ...pet, id }
    this.pets[index] = updatedPet
    return updatedPet
  }

  deletePet(id: string): void {
    const index = this.pets.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Pet not found')
    this.pets.splice(index, 1)
  }

  getClients(): Client[] {
    return this.clients
  }

  getPets(): Pet[] {
    return this.pets
  }

  getPetsByOwnerId(ownerId: string): Pet[] {
    return this.pets.filter(pet => pet.ownerId === ownerId)
  }

  getClient(id: string): Client | undefined {
    return this.clients.find(client => client.id === id)
  }

  getPet(id: string): Pet | undefined {
    return this.pets.find(pet => pet.id === id)
  }
}

// Export a single instance to be used across the application
export const db = new Database()