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

  addPet(pet: Omit<Pet, 'id'>): Pet {
    const newPet = { ...pet, id: String(this.nextPetId++) }
    this.pets.push(newPet)
    return newPet
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
}

// Export a single instance to be used across the application
export const db = new Database()