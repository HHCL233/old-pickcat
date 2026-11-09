export var CATEGORY_ICONS = {
  'creative-works': 'palette',
  'learning-technology': 'book',
  'q-and-a': 'question',
  'events-competitions': 'trophy',
  'interest-plaza': 'smile'
}

export var CATEGORY_COLORS = {
  'creative-works': 'info',
  'learning-technology': 'violet',
  'q-and-a': 'warning',
  'events-competitions': 'warning',
  'interest-plaza': 'violet'
}

export function categoryIcon (slug) {
  return CATEGORY_ICONS[slug] || 'grid'
}

export function categoryColor (slug) {
  return CATEGORY_COLORS[slug] || 'info'
}
