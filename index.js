const fs = require('fs')
const shell = require('shelljs')

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

const formatTrackNumber = number => `0${number}`.slice(-2)

const isNotBlankLine = line => line.length > 1

const splitLineToStartTimeAndTitle = line => {
  const firstSpacePosition = line.indexOf(' ')
  const startTimestamp = line.substr(0, firstSpacePosition)
  const [startMinutes, startSeconds] = startTimestamp.split(':')
  const startTime = (Number(startMinutes) * 60) + Number(startSeconds)
  const title = line.substr(firstSpacePosition + 1)
  return {
    startTime,
    title
  }
}

const addEndTime = (track, trackIndex, tracks) => ({
  ...track,
  endTime: (
    tracks[trackIndex + 1]
      ? tracks[trackIndex + 1].startTime
      : null
  )
})

const prefixTitleWithTrackNumber = (track, trackIndex) => ({
  ...track,
  title: `${formatTrackNumber(trackIndex + 1)} - ${track.title}`
})

const suffixTitleWithExtension = track => ({
  startTime: track.startTime,
  endTime: track.endTime,
  fileName: `${track.title}.mp3`
})

const generateCommandFromTrack = ({
  startTime,
  endTime,
  fileName
}) => `ffmpeg -i ${audioFilename} -acodec copy -ss ${startTime} -to ${endTime} "${fileName}"`

fs.readFile(tracksFilename, 'utf8', (_, tracksRawData) => {
  const tracks = (
    tracksRawData
      .split('\n')
      .filter(isNotBlankLine)
      .map(splitLineToStartTimeAndTitle)
      .map(addEndTime)
      .map(prefixTitleWithTrackNumber)
      .map(suffixTitleWithExtension)
  )
  const commands = tracks.map(generateCommandFromTrack)
  console.log(commands)
})
