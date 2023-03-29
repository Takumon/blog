
const sharp = require(`sharp`)
const glob = require(`glob`)
const fs = require(`fs`)
const matches = glob.sync(`src/images/thumbnail/**/*.{png,jpg,jpeg}`)
const MAX_WIDTH = 1200 * 2 // maxwidth is 1200 for Twitter, 2times is for retina

Promise.all(
  matches.map(async match => {
    const stream = sharp(match)
    const info = await stream.metadata()

    if (info.width <= MAX_WIDTH) {
      return
    }
    const outputBuffer = await stream.resize(MAX_WIDTH).toBuffer()
    fs.writeFileSync(match, outputBuffer)
    console.log(`success resize thumbnails. ${info.width} -> ${MAX_WIDTH}, ${match}`)

    return 'Success'
  })
)

