import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'
import { KEYS } from '@/utils/keys'

export const useProfileStore = defineStore('profile', () => {
  const STORAGE_KEY = KEYS.PROFILE
  const profile = ref(loadJSON(STORAGE_KEY, {
    name: '',
    birthdate: '',
    focus: [], // ['farewell', 'meaning', 'relationship', 'career']
    badges: [],
    lastRead: null, // { type, slug, title }
    journeyStartedAt: null
  }))

  const hasProfile = computed(() => !!profile.value.name || profile.value.focus.length > 0)

  function save() {
    saveJSON(STORAGE_KEY, profile.value)
  }

  function setProfile(data) {
    profile.value = { ...profile.value, ...data }
    if (!profile.value.journeyStartedAt) {
      profile.value.journeyStartedAt = Date.now()
    }
    save()
  }

  function addBadge(badge) {
    if (!profile.value.badges.includes(badge)) {
      profile.value.badges.push(badge)
      save()
    }
  }

  function setLastRead(payload) {
    profile.value.lastRead = payload
    save()
  }

  function clearProfile() {
    profile.value = {
      name: '',
      birthdate: '',
      focus: [],
      badges: [],
      lastRead: null,
      journeyStartedAt: null
    }
    save()
  }

  return { profile, hasProfile, setProfile, addBadge, setLastRead, clearProfile }
})
