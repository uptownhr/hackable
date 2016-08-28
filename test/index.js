'use static'
const app = require('../index.js'),
  { User } = require('../models'),
  seed = require('../config/seed')

before(done => {

  seed
    .then(addMockProvider)
    .then(done.bind(null, null))
    .catch(function (err) {
      console.log('seed error', err)
    })
})

after(done => {
  app.server.close()
  done()
})

function addMockProvider() {
  return User.findOne({ role: 'admin' }, function (err, user) {
    user.providers.push({
      name: 'mock_provider'
    })

    return user.save()
  })
}
