const formatSortCondition = require('./format-sort-conditions.js')

module.exports = (req) => {
  const limit = +req.query.perPage || 1000
  const page = +req.query.page || 1
  let offset = page * limit
  if (page === 1) {
    offset = 0
  }
  if (req.query.offset) {
    offset = +req.query.offset
  }

  const sort = req.query.sort
  const order = [formatSortCondition(sort)]

  return {
    order,
    offset,
    limit,
    page
  }
}
