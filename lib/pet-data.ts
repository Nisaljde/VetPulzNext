export interface BreedInfo {
  species: string
  breeds: string[]
}

export const petSpeciesData: BreedInfo[] = [
  {
    species: 'Dog',
    breeds: [
      'Labrador Retriever',
      'German Shepherd',
      'Golden Retriever',
      'French Bulldog',
      'Bulldog',
      'Poodle',
      'Beagle',
      'Rottweiler',
      'Mixed Breed',
      'Other'
    ]
  },
  {
    species: 'Cat',
    breeds: [
      'Persian',
      'Maine Coon',
      'Siamese',
      'British Shorthair',
      'Ragdoll',
      'American Shorthair',
      'Mixed Breed',
      'Other'
    ]
  },
  {
    species: 'Bird',
    breeds: [
      'Parakeet',
      'Cockatiel',
      'African Grey Parrot',
      'Cockatoo',
      'Macaw',
      'Other'
    ]
  },
  {
    species: 'Rabbit',
    breeds: [
      'Holland Lop',
      'Mini Rex',
      'Netherland Dwarf',
      'Dutch',
      'Other'
    ]
  },
  {
    species: 'Other',
    breeds: ['Other']
  }
]