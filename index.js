const fs = require('fs')
const shell = require('shelljs')
const {extractTracksData, generateCommandFromTrack} = require('./utility')

// Tracks file example:
// ```
// 0:00 Paper Earth
// 4:48 Slideshow
// 9:53 Wasn't Even There
// 15:27 Interlude
// 19:00 Tone My Crazy
// 24:53 Acceleration
//
// ```

if (!shell.which('ffmpeg')) {
  shell.echo('Sorry, this tool requires ffmpeg')
  shell.exit(1)
}

const audioFilename = process.argv[2]
const tracksFilename = process.argv[3]

fs.readFile(tracksFilename, 'utf8', (_, tracksRawData) => {
  const tracks = extractTracksData(tracksRawData)
  const commands = tracks.map(generateCommandFromTrack({audioFilename}))
  console.log(commands)
})
