const formatTrackNumber = number => (`0${number}`.slice(-2))

const isNotBlankLine = line => (line.length > 0)

const getTimeFromTimestamp = timestamp => {
  const segments = timestamp.split(':')
  if (segments.length === 3) {
    const [hours, minutes, seconds] = segments
    return (
      (Number(hours) * 60 * 60)
        + (Number(minutes) * 60)
        + Number(seconds)
    )
  }
  const [minutes, seconds] = segments
  return (Number(minutes) * 60) + Number(seconds)
}

const splitLineToStartTimeAndTitle = line => {
  const firstSpacePosition = line.indexOf(' ')
  const startTimestamp = line.substr(0, firstSpacePosition)
  const startTime = getTimeFromTimestamp(startTimestamp)
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
    .map(line => line.trim())
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
