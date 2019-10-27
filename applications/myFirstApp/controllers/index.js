const testHtml = async (ctx) => {
  await ctx.render('applications/myFirstApp/views/test.ejs', {
    env: ctx.state.CUSTOM_ENV
  })
}

module.exports = {
  testHtml
}
