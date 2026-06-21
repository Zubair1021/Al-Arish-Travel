export const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
]

export const STATUS_LABELS = STATUS_OPTIONS.reduce((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {})

export const STATUS_TONES = {
  new: 'amber',
  in_progress: 'blue',
  contacted: 'purple',
  converted: 'green',
  closed: 'gray',
}

export const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'quote', label: 'Quote' },
  { value: 'contact', label: 'Contact' },
  { value: 'hajj', label: 'Hajj registration' },
]

export const TYPE_LABELS = TYPE_OPTIONS.reduce((acc, item) => {
  if (item.value) acc[item.value] = item.label
  return acc
}, {})

export const CATEGORY_LABELS = {
  '4-star': '4-Star Umrah',
  '5-star': '5-Star Umrah',
  ramadan: 'Ramadan Umrah',
  family: 'Family Package',
}

export const PRESET_OPTIONS = [
  { value: 'pkg-4star', label: '4-Star (Makkah view)' },
  { value: 'pkg-5star', label: '5-Star (Hotel suite)' },
  { value: 'pkg-ramadan', label: 'Ramadan (Madinah night)' },
  { value: 'pkg-family', label: 'Family (Haram outdoor)' },
]
