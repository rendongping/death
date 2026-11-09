import { loadJSON, saveJSON } from '@/utils/storage'
import { KEYS } from '@/utils/keys'

/**
 * 「生命日历」里的一周，是全站唯一能承载「我活到哪一格」的坐标系。
 * 任何地方想点亮某一格，都走这里，避免各处自己算周数算出两套结果。
 *
 * 生日与点亮格子的读写也只允许经过这里：
 * 之前 LifeCalendar / LifeCountdown / HomePage 各自 localStorage.getItem，
 * 一旦格式或键名变更就要改四处。
 */

/** 读取生日（YYYY-MM-DD），未填写返回 '' */
export function getBirthdate() {
  return localStorage.getItem(KEYS.BIRTHDATE) || ''
}

/** 写入生日；传空字符串视为清除 */
export function setBirthdate(value) {
  if (!value) {
    localStorage.removeItem(KEYS.BIRTHDATE)
    return
  }
  localStorage.setItem(KEYS.BIRTHDATE, value)
}

/** 出生至今走过的周数；没填生日返回 null */
export function weekIndexOf(date = new Date(), birthdate = getBirthdate()) {
  if (!birthdate) return null
  const birth = new Date(birthdate)
  if (Number.isNaN(birth.getTime())) return null
  const diff = date.getTime() - birth.getTime()
  if (diff < 0) return null
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7))
}

export function getWeekMarks() {
  return loadJSON(KEYS.WEEK_MARKS, [])
}

/** 点亮某一格，返回是否为本次新增 */
export function lightUpWeek(index) {
  if (index === null || index === undefined) return false
  const marks = getWeekMarks()
  if (marks.includes(index)) return false
  setWeekMarks([...marks, index])
  return true
}

/** 整表覆盖写入点亮记录，写入路径只留这一处 */
export function setWeekMarks(list) {
  const next = [...new Set(Array.isArray(list) ? list : [])].sort((a, b) => a - b)
  saveJSON(KEYS.WEEK_MARKS, next)
  return next
}
