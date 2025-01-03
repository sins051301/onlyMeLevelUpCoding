export function getLevelEmoji(level: number): string {
  if (level >= 200) {
    return "💎";
  } else if (level >= 190) {
    return "🔥";
  } else if (level >= 180) {
    return "🌟";
  } else if (level >= 170) {
    return "⚡";
  } else if (level >= 160) {
    return "🚀";
  } else if (level >= 150) {
    return "🛡️";
  } else if (level >= 140) {
    return "🦸";
  } else if (level >= 130) {
    return "💪";
  } else if (level >= 120) {
    return "⚔️";
  } else if (level >= 110) {
    return "🏅";
  } else if (level >= 100) {
    return "🧑‍💻";
  } else if (level >= 90) {
    return "💥";
  } else if (level >= 80) {
    return "👑";
  } else if (level >= 70) {
    return "💡";
  } else if (level >= 60) {
    return "🎯";
  } else if (level >= 50) {
    return "🥇";
  } else if (level >= 40) {
    return "🎉";
  } else if (level >= 30) {
    return "🌈";
  } else if (level >= 20) {
    return "💼";
  } else if (level >= 10) {
    return "📝";
  } else {
    return "🧑‍💻";
  }
}
