import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLettersStore = defineStore('letters', () => {
  const STORAGE_KEY = 'mv-letters'
  const letters = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

  const sortedLetters = computed(() =>
    [...letters.value].sort((a, b) => b.createdAt - a.createdAt)
  )

  const deliveredLetters = computed(() =>
    sortedLetters.value.filter(l => isDelivered(l))
  )

  const pendingLetters = computed(() =>
    sortedLetters.value.filter(l => !isDelivered(l))
  )

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters.value))
  }

  function addLetter({ to, subject, body, deliverAt }) {
    letters.value.push({
      id: Date.now(),
      to: to || '',
      subject: subject || '',
      body: body || '',
      deliverAt: deliverAt || '',
      createdAt: Date.now()
    })
    save()
  }

  function deleteLetter(id) {
    letters.value = letters.value.filter(l => l.id !== id)
    save()
  }

  function isDelivered(letter) {
    if (!letter.deliverAt) return true
    return new Date(letter.deliverAt) <= new Date()
  }

  return {
    letters,
    sortedLetters,
    deliveredLetters,
    pendingLetters,
    addLetter,
    deleteLetter,
    isDelivered
  }
})
