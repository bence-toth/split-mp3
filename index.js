const fs = require('fs')
const shell = require('shelljs')
const {extractTracksData, addCommandToTrack} = require('./utility')

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
  console.log('Sorry, this tool requires ffmpeg')
  console.log('')
  shell.exit(1)
}

const audioFilename = process.argv[2]
const tracksFilename = process.argv[3]

fs.readFile(tracksFilename, 'utf8', (_, tracksRawData) => {
  const tracks = extractTracksData(tracksRawData)
  const tracksWithCommands = tracks.map(addCommandToTrack({audioFilename}))
  tracksWithCommands.forEach(({command, fileName}) => {
    const executedCommand = shell.exec(command)
    if (executedCommand.code === 0) {
      console.log(`File was saved: "${fileName}"`)
    }
    else {
      console.log(`Saving file "${fileName}" has failed`)
      console.log('')
      console.log('Maybe try running the following command manually and see what happens:')
      console.log('')
      console.log(`  ${command}`)
      console.log('')
      shell.exit(1)
    }
  })
})
