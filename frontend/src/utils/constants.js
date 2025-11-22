// 奶茶相关常量
export const DEFAULT_BRANDS = ['喜茶', '奈雪的茶', '蜜雪冰城', '一点点', '茶百道', '古茗', 'CoCo', '霸王茶姬', '其他']
export const SUGAR_LEVELS = ['全糖', '七分糖', '半糖', '三分糖', '无糖']
export const ICE_LEVELS = ['正常冰', '少冰', '去冰', '热饮']

// 评分范围 0-10
export const RATING_MIN = 0
export const RATING_MAX = 10

// 日期工具函数
export const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
export const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()
