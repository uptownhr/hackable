const router = require('koa-router')({ prefix: '/blog' })

const Post = require('../models/Post')
const Remarkable = require('remarkable')

const md = new Remarkable()
/*


var marked = require('marked')

marked.setOptions({
  gfm: false
})*/

router.get('/', async ctx => {
  let posts = await Post.find({ status: 'launched' }).populate('_author')

  posts = posts.map(post => {
    post.content = md.render(post.content)
    return post
  })

  ctx.render('post/list', {
    posts
  })

})

router.get('/post/:id', async ctx => {
  var id = ctx.params.id
  const post = await Post.findOne({ _id: id, status: 'launched' }).populate('_author')

  if (!post) return ctx.redirect('/blog')

  post.content = md.render(post.content)
  ctx.render('post/view', {
    post
  })

})

module.exports = router
