export const scoreRules = {
  daysOfInactivity: 14,
  inactivityScore: -2,
  clickOnProduct: {
    limit: 24,
    score: 2
  },
  newsletterRead: {
    score: 2,
    limit: 168
  },
  profileCompleteness: {
    20: 10,
    40: 20,
    60: 30,
    80: 40,
    100: 50
  },
  dailyLimit: 60,
  flood: 60,
  message: {
    send: 3
  },
  reaction: {
    send: 2,
    receive: 3
  },
  thread: {
    send: 3,
    receive: 1
  }
}

export const levels = (() => {
  const badges = [
    'levelOne',
    'levelTwo',
    'levelThree',
    'levelFour',
    'levelFive',
    'levelSix',
    'levelSeven',
    'levelEight',
    'levelNine',
    'levelTen'
  ]
  const scores = [50, 100, 150, 250, 400, 650, 1050, 1700, 2780]

  return badges.map((badge, index) => {
    const min = scores[index - 1] || 0
    const max = scores[index] ? scores[index] - 1 : null
    return {
      badge,
      level: index + 1,
      currentRange: { min, max },
      scoreToNextLevel: scores[index] || null
    }
  })
})()
