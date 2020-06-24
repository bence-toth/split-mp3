#!/usr/bin/env node

const fs = require('fs')
const shell = require('shelljs')
const {extractTracksData, addCommandToTrack} = require('./utility')

if (!shell.which('ffmpeg')) {
  console.log('Sorry, this tool requires ffmpeg')
  console.log('')
  shell.exit(1)
}

const areAllRequirementsMet = (
  process.argv[2]
    && fs.existsSync(process.argv[2])
    && (process.argv[2].slice(-4).toLowerCase() === '.mp3')
    && process.argv[3]
    && fs.existsSync(process.argv[3])
)

if (!areAllRequirementsMet) {
  // TODO: Add more info here
  console.log('Usage:')
  console.log('')
  console.log('  npx split-mp3 $MP3_FILE $TRACK_DATA_FILE')
  console.log('')
  shell.exit(1)
}

const audioFilename = process.argv[2]
const tracksFilename = process.argv[3]

fs.readFile(tracksFilename, 'utf8', (_, tracksRawData) => {
  const tracks = extractTracksData(tracksRawData)
  const tracksWithCommands = tracks.map(addCommandToTrack({audioFilename}))
  tracksWithCommands.forEach(({command, fileName}) => {
    const executedCommand = shell.exec(command, {
      silent: true
    })
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
