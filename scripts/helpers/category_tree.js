'use strict'

hexo.extend.helper.register('category_tree', function () {
  const categories = this.site.categories
  if (!categories || !categories.length) return []

  const categoryMap = new Map()
  categories.forEach(cat => {
    if (!cat.length) return

    const parentId = cat.parent || 'root'
    if (!categoryMap.has(parentId)) categoryMap.set(parentId, [])

    categoryMap.get(parentId).push({
      id: cat._id,
      name: cat.name,
      path: cat.path,
      count: cat.length
    })
  })

  const sortByName = (a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  }

  for (const list of categoryMap.values()) {
    list.sort(sortByName)
  }

  const buildTree = (parentId = 'root') => {
    return (categoryMap.get(parentId) || []).map(cat => ({
      ...cat,
      children: buildTree(cat.id)
    }))
  }

  return buildTree()
})
