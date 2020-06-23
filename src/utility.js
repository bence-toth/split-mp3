const formatTrackNumber = number => (`0${number}`.slice(-2))

const isNotBlankLine = line => (line.length > 1)

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

const extractTracksData = tracksRawData => (
  tracksRawData
    .split('\n')
    .trim()
    .filter(isNotBlankLine)
    .map(splitLineToStartTimeAndTitle)
    .map(addEndTime)
    .map(prefixTitleWithTrackNumber)
    .map(suffixTitleWithExtension)
)

const addCommandToTrack = ({audioFilename}) => ({
  startTime,
  endTime,
  fileName
}) => ({
  startTime,
  endTime,
  fileName,
  command: [
    `ffmpeg`,
    `-i ${audioFilename}`,
    `-acodec copy`,
    `-ss ${startTime}`,
    ...(endTime ? [`-to ${endTime}`] : []),
    `"${fileName}"`
  ].join(' ')
})

module.exports = {
  extractTracksData,
  addCommandToTrack
}
