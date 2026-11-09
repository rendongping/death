import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'
import { KEYS } from '@/utils/keys'

/** 信件的唯一持有者，编辑器只调这里的 addLetter / deleteLetter */
export const useLettersStore = defineStore('letters', () => {
  const STORAGE_KEY = KEYS.LETTERS
  const letters = ref(loadJSON(STORAGE_KEY, []))

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
    saveJSON(STORAGE_KEY, letters.value)
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
