<template>
  <svg
    :viewBox="viewBox"
    :width="width"
    :height="height"
    class="illustration"
    role="img"
    :aria-label="alt"
    v-html="svgContent"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: 'dandelion'
  },
  width: {
    type: [String, Number],
    default: 200
  },
  height: {
    type: [String, Number],
    default: 'auto'
  }
})

const illustrations = {
  dandelion: {
    viewBox: '0 0 200 240',
    alt: '蒲公英种子飘散',
    content: `<g opacity="0.7">
      <line x1="100" y1="180" x2="100" y2="100" stroke="#C2956B" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="100" cy="85" r="2" fill="#C2956B"/>
      <g transform="rotate(0, 100, 85)">
        <line x1="100" y1="85" x2="100" y2="55" stroke="#D4B08C" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="92" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="108" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <circle cx="100" cy="55" r="1.5" fill="#D4B08C" opacity="0.6"/>
      </g>
      <g transform="rotate(45, 100, 85)">
        <line x1="100" y1="85" x2="100" y2="55" stroke="#D4B08C" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="92" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="108" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <circle cx="100" cy="55" r="1.5" fill="#D4B08C" opacity="0.6"/>
      </g>
      <g transform="rotate(90, 100, 85)">
        <line x1="100" y1="85" x2="100" y2="55" stroke="#D4B08C" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="92" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="108" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <circle cx="100" cy="55" r="1.5" fill="#D4B08C" opacity="0.6"/>
      </g>
      <g transform="rotate(135, 100, 85)">
        <line x1="100" y1="85" x2="100" y2="55" stroke="#D4B08C" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="92" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="108" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <circle cx="100" cy="55" r="1.5" fill="#D4B08C" opacity="0.6"/>
      </g>
      <g transform="rotate(180, 100, 85)">
        <line x1="100" y1="85" x2="100" y2="55" stroke="#D4B08C" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="92" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="108" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <circle cx="100" cy="55" r="1.5" fill="#D4B08C" opacity="0.6"/>
      </g>
      <g transform="rotate(225, 100, 85)">
        <line x1="100" y1="85" x2="100" y2="55" stroke="#D4B08C" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="92" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="108" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <circle cx="100" cy="55" r="1.5" fill="#D4B08C" opacity="0.6"/>
      </g>
      <g transform="rotate(270, 100, 85)">
        <line x1="100" y1="85" x2="100" y2="55" stroke="#D4B08C" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="92" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="108" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <circle cx="100" cy="55" r="1.5" fill="#D4B08C" opacity="0.6"/>
      </g>
      <g transform="rotate(315, 100, 85)">
        <line x1="100" y1="85" x2="100" y2="55" stroke="#D4B08C" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="92" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="108" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
        <circle cx="100" cy="55" r="1.5" fill="#D4B08C" opacity="0.6"/>
      </g>
    </g>`
  },
  calendar: {
    viewBox: '0 0 200 160',
    alt: '生命日历',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="20" y="30" width="160" height="120" rx="8" fill="#FFF8F0" stroke="#C2956B" stroke-width="1.5"/>
      <line x1="20" y1="55" x2="180" y2="55" stroke="#C2956B" stroke-width="1.5"/>
      <circle cx="45" cy="25" r="4" fill="#C2956B" stroke="none"/>
      <circle cx="155" cy="25" r="4" fill="#C2956B" stroke="none"/>
      <g stroke-width="1">
        <rect x="40" y="70" width="16" height="16" rx="2" fill="#C2956B" stroke="#C2956B"/>
        <rect x="62" y="70" width="16" height="16" rx="2" fill="#C2956B" stroke="#C2956B"/>
        <rect x="84" y="70" width="16" height="16" rx="2" fill="#C2956B" stroke="#C2956B"/>
        <rect x="106" y="70" width="16" height="16" rx="2" fill="#D4B08C" stroke="#D4B08C"/>
        <rect x="128" y="70" width="16" height="16" rx="2" fill="#E8DDD0" stroke="#E8DDD0"/>
        <rect x="150" y="70" width="16" height="16" rx="2" fill="#E8DDD0" stroke="#E8DDD0"/>
      </g>
      <g stroke-width="1">
        <rect x="40" y="92" width="16" height="16" rx="2" fill="#E8DDD0" stroke="#E8DDD0"/>
        <rect x="62" y="92" width="16" height="16" rx="2" fill="#E8DDD0" stroke="#E8DDD0"/>
        <rect x="84" y="92" width="16" height="16" rx="2" fill="#E8DDD0" stroke="#E8DDD0"/>
        <rect x="106" y="92" width="16" height="16" rx="2" fill="#E8DDD0" stroke="#E8DDD0"/>
      </g>
    </g>`
  },
  bucketlist: {
    viewBox: '0 0 200 160',
    alt: '遗愿清单',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="40" y="20" width="120" height="130" rx="6" fill="#FFF8F0" stroke="#C2956B" stroke-width="1.5"/>
      <line x1="65" y1="20" x2="65" y2="10" stroke="#C2956B" stroke-width="1.5"/>
      <line x1="135" y1="20" x2="135" y2="10" stroke="#C2956B" stroke-width="1.5"/>
      <circle cx="65" cy="8" r="3" fill="#C2956B" stroke="none"/>
      <circle cx="135" cy="8" r="3" fill="#C2956B" stroke="none"/>
      <rect x="60" y="45" width="14" height="14" rx="2" fill="#8B9D83" stroke="#8B9D83"/>
      <path d="M64 51 l3 3 5-5" stroke="#fff" stroke-width="1.5"/>
      <line x1="82" y1="52" x2="150" y2="52" stroke="#C2956B" stroke-width="1.5"/>
      <rect x="60" y="72" width="14" height="14" rx="2" fill="#C2956B" stroke="#C2956B"/>
      <path d="M64 78 l3 3 5-5" stroke="#fff" stroke-width="1.5"/>
      <line x1="82" y1="79" x2="150" y2="79" stroke="#C2956B" stroke-width="1.5"/>
      <rect x="60" y="99" width="14" height="14" rx="2" fill="#E8DDD0" stroke="#C2956B" stroke-width="1"/>
      <line x1="82" y1="106" x2="150" y2="106" stroke="#C2956B" stroke-width="1.5"/>
    </g>`
  },
  letters: {
    viewBox: '0 0 200 160',
    alt: '信件',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="40" y="40" width="120" height="90" rx="6" fill="#FFF8F0" stroke="#C4929E" stroke-width="1.5"/>
      <path d="M40 46 L100 90 L160 46" fill="none" stroke="#C4929E" stroke-width="1.5"/>
      <circle cx="155" cy="35" r="8" fill="#C4929E" stroke="none"/>
      <path d="M152 35 l3 3 5-5" stroke="#fff" stroke-width="1.5" fill="none"/>
      <line x1="60" y1="105" x2="140" y2="105" stroke="#D4AAB3" stroke-width="1.5"/>
      <line x1="60" y1="115" x2="120" y2="115" stroke="#D4AAB3" stroke-width="1.5"/>
    </g>`
  },
  memorial: {
    viewBox: '0 0 200 160',
    alt: '蜡烛',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="85" y="80" width="30" height="60" rx="4" fill="#FFF8F0" stroke="#C4929E" stroke-width="1.5"/>
      <ellipse cx="100" cy="80" rx="15" ry="4" fill="#D4AAB3" stroke="#C4929E" stroke-width="1"/>
      <path d="M100 80 Q100 60 92 55 Q100 50 100 35 Q100 50 108 55 Q100 60 100 80" fill="#D4B08C" opacity="0.8" stroke="none"/>
      <path d="M100 80 Q100 62 95 58 Q100 54 100 42 Q100 54 105 58 Q100 62 100 80" fill="#FFF8F0" opacity="0.9" stroke="none"/>
      <line x1="100" y1="50" x2="100" y2="70" stroke="#8B7D6B" stroke-width="1.5"/>
    </g>`
  },
  advance: {
    viewBox: '0 0 200 160',
    alt: '生前预嘱',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="40" y="20" width="120" height="130" rx="6" fill="#FFF8F0" stroke="#8B9D83" stroke-width="1.5"/>
      <line x1="60" y1="50" x2="140" y2="50" stroke="#8B9D83" stroke-width="1.5"/>
      <line x1="60" y1="70" x2="140" y2="70" stroke="#A8B8A1" stroke-width="1"/>
      <line x1="60" y1="85" x2="120" y2="85" stroke="#A8B8A1" stroke-width="1"/>
      <line x1="60" y1="100" x2="140" y2="100" stroke="#A8B8A1" stroke-width="1"/>
      <line x1="60" y1="115" x2="110" y2="115" stroke="#A8B8A1" stroke-width="1"/>
      <path d="M130 125 L145 140 L170 110" stroke="#8B9D83" stroke-width="2" fill="none"/>
    </g>`
  },
  recommendations: {
    viewBox: '0 0 200 160',
    alt: '书籍与电影',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="35" y="40" width="50" height="80" rx="3" fill="#FFF8F0" stroke="#8B7D6B" stroke-width="1.5"/>
      <line x1="42" y1="50" x2="78" y2="50" stroke="#C2956B" stroke-width="1.5"/>
      <line x1="42" y1="60" x2="78" y2="60" stroke="#C2956B" stroke-width="1.5"/>
      <line x1="42" y1="70" x2="78" y2="70" stroke="#C2956B" stroke-width="1.5"/>
      <rect x="95" y="30" width="70" height="90" rx="3" fill="#FFF8F0" stroke="#8B7D6B" stroke-width="1.5"/>
      <circle cx="130" cy="55" r="12" fill="#D4B08C" stroke="none"/>
      <path d="M130 43 L130 55 L140 60" stroke="#FFF8F0" stroke-width="2" fill="none"/>
      <rect x="100" y="85" width="60" height="8" rx="2" fill="#D4B08C" stroke="none"/>
      <rect x="105" y="100" width="50" height="6" rx="2" fill="#E8DDD0" stroke="none"/>
    </g>`
  },
  poetry: {
    viewBox: '0 0 200 160',
    alt: '诗歌',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M40 140 Q70 40 100 80 Q130 120 160 30" stroke="#C2956B" stroke-width="1.5" fill="none"/>
      <path d="M45 130 Q75 60 100 90 Q125 110 155 50" stroke="#D4B08C" stroke-width="1" fill="none"/>
      <circle cx="100" cy="80" r="4" fill="#C2956B" stroke="none"/>
    </g>`
  },
  practices: {
    viewBox: '0 0 200 160',
    alt: '练习',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="100" cy="80" r="50" fill="#FFF8F0" stroke="#8B9D83" stroke-width="1.5"/>
      <circle cx="100" cy="80" r="35" fill="none" stroke="#A8B8A1" stroke-width="1"/>
      <circle cx="100" cy="80" r="20" fill="none" stroke="#C2956B" stroke-width="1"/>
      <path d="M100 80 L100 55" stroke="#8B9D83" stroke-width="1.5"/>
      <path d="M100 80 L118 92" stroke="#C2956B" stroke-width="1.5"/>
      <circle cx="100" cy="80" r="3" fill="#8B9D83" stroke="none"/>
    </g>`
  },
  stories: {
    viewBox: '0 0 200 160',
    alt: '故事',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="45" y="25" width="110" height="120" rx="6" fill="#FFF8F0" stroke="#8B7D6B" stroke-width="1.5"/>
      <line x1="65" y1="50" x2="135" y2="50" stroke="#8B7D6B" stroke-width="1.5"/>
      <line x1="65" y1="70" x2="135" y2="70" stroke="#A89885" stroke-width="1"/>
      <line x1="65" y1="85" x2="120" y2="85" stroke="#A89885" stroke-width="1"/>
      <line x1="65" y1="100" x2="135" y2="100" stroke="#A89885" stroke-width="1"/>
      <line x1="65" y1="115" x2="110" y2="115" stroke="#A89885" stroke-width="1"/>
      <circle cx="150" cy="125" r="12" fill="#C2956B" stroke="none"/>
      <path d="M146 125 l3 3 6-6" stroke="#fff" stroke-width="1.5" fill="none"/>
    </g>`
  },
  gratitude: {
    viewBox: '0 0 200 160',
    alt: '感恩',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M100 140 C60 100 40 80 40 55 C40 35 60 20 80 20 C95 20 100 35 100 35 C100 35 105 20 120 20 C140 20 160 35 160 55 C160 80 140 100 100 140 Z" fill="#FFF8F0" stroke="#C4929E" stroke-width="1.5"/>
      <path d="M70 60 Q80 50 90 60" stroke="#C4929E" stroke-width="1.5" fill="none"/>
      <path d="M110 60 Q120 50 130 60" stroke="#C4929E" stroke-width="1.5" fill="none"/>
      <path d="M90 80 Q100 90 110 80" stroke="#C4929E" stroke-width="1.5" fill="none"/>
    </g>`
  },
  empty: {
    viewBox: '0 0 200 160',
    alt: '空状态',
    content: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="100" cy="70" r="40" fill="#FFF8F0" stroke="#D4B08C" stroke-width="1.5"/>
      <circle cx="85" cy="65" r="3" fill="#C2956B" stroke="none"/>
      <circle cx="115" cy="65" r="3" fill="#C2956B" stroke="none"/>
      <path d="M90 85 Q100 92 110 85" stroke="#C2956B" stroke-width="1.5" fill="none"/>
      <line x1="70" y1="50" x2="50" y2="35" stroke="#D4B08C" stroke-width="1.5"/>
      <line x1="130" y1="50" x2="150" y2="35" stroke="#D4B08C" stroke-width="1.5"/>
    </g>`
  }
}

const config = computed(() => illustrations[props.name] || illustrations.dandelion)
const viewBox = computed(() => config.value.viewBox)
const alt = computed(() => config.value.alt)
const svgContent = computed(() => config.value.content)
</script>

<style scoped>
.illustration {
  display: block;
  height: auto;
}
</style>
