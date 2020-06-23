# Split mp3

Split mp3 files from the command line.


## Quick start

So you have a long mp3 file you want to split, let's say `full.mp3`.

You have to create a file for the tracks, let's say `tracks.txt`.

In this file, you will have to specify the start time and the title for each track, using the following format:

```
0:00 This is the first track
1:23 Second track here
4:56 I am the third one
7:00 Fourth time is a charm
12:34 Take five
56:00 Six is the last one
```

Once the tracks file is ready, you can split your long mp3 file:

```sh
npx split-mp3 full.mp3 tracks.txt
```

This will create six files:
```
01 - This is the first track.mp3
02 - Second track here.mp3
03 - I am the third one.mp3
04 - Fourth time is a charm.mp3
05 - Take five.mp3
06 - Six is the last one.mp3
```


## Tracks file gotchas

A few things to note regarding the tracks file:

- The start times for tracks must use the `MM:SS` format. Note that the separator is `:`.

- Leading zeros for the start times will be accepted (`1:23` and `01:23` are both fine).

- The start times and the titles must be separated by exactly one space.

- The track titles must not contain funky characters, they will be used in file names.

- Blank lines and tailing white space will be ignored.


## Requirements

You will need Node 12+ and npm 5.2+ to run this.

You will also need [FFmpeg](https://ffmpeg.org/) installed.


## Contributing

If something doesn’t work, please [file an issue](https://github.com/bence-toth/split-mp3/issues).

If you have questions, need help, or would like to contribute, please reach out at [tothab@gmail.com](mailto:tothab@gmail.com).


## Disclaimer

I made this tool to save myself some time.

I did not have great ambitions, I did not make it beautiful, I did not do a lot of testing.

It works on my machine, which is all I needed.

It will probably work on yours, too.


## License

Split mp3 is [licensed under MIT](./LICENSE).
