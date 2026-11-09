/**
 * localStorage key · 单一数据源
 *
 * 全站所有 mv-* 键只在这里声明一次。
 * 之前同一个键（如 mv-bucketlist / mv-birthdate）散落在 store 与组件里各写一份，
 * 两边各自 loadJSON→saveJSON，后写的会整份覆盖先写的。
 * 键名收敛后，任何一份数据的读写路径都能被 grep 出来。
 */
export const STORAGE_PREFIX = 'mv-'

export const KEYS = {
  /** 遗愿清单：src/stores/bucketlist.js 唯一持有 */
  BUCKETLIST: 'mv-bucketlist',
  /** 信件：src/stores/letters.js 唯一持有 */
  LETTERS: 'mv-letters',
  /** 感恩时刻（按日） */
  GRATITUDE: 'mv-gratitude',
  /** 生日：读写统一走 src/utils/week-of-life.js */
  BIRTHDATE: 'mv-birthdate',
  /** 生命日历每格备注 */
  WEEK_NOTES: 'mv-week-notes',
  /** 生命日历里被点亮的格子 */
  WEEK_MARKS: 'mv-week-marks',
  /** 生前预嘱 */
  ADVANCE_DIRECTIVES: 'mv-advance-directives',
  /** 哀悼空间的蜡烛 */
  MEMORIAL: 'mv-memorial',
  /** 约定（生之出口的去向） */
  COMMITMENTS: 'mv-commitments',
  FAVORITES: 'mv-favorites',
  /** 每日凝视记录 */
  GAZE_LOG: 'mv-gaze-log',
  PROFILE: 'mv-profile',
  /** 写下的每一行：反思、练习记录、约定完成后的回响 */
  REFLECTIONS: 'mv-reflections',
  /** 今日一页 / 详情页的已读记录 */
  READ_LOG: 'mv-read-log',
  /** 一万种死法页「我想活着去做的事」 */
  LIFE_WISHES: 'mv-life-wishes',
  /** 一万种死法页的凝视次数 */
  WAYS_GAZE: 'mv-ways-gaze'
}
