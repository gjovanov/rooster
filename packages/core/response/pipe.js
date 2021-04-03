
const define = (Response) => {
  Response.prototype.pipe = function (stream, size, compressed = false) {
    const self = this
    this.stream = true

    if (compressed) {
      const compressedStream = this.compress(stream, this._headers)

      if (compressedStream) {
        stream = compressedStream
      }
    }

    this.onAborted(() => {
      if (stream) {
        stream.destroy()
      }
      if (stream) {
        stream.destroy()
      }
      self._isDone = true
    })

    if (compressed || !size) {
      stream.on('data', (buffer) => {
        if (self._isDone) {
          stream.destroy()
          return
        }
        this.write(
          buffer.buffer.slice(
            buffer.byteOffset,
            buffer.byteOffset + buffer.byteLength
          )
        )
      })
    } else {
      stream.on('data', (buffer) => {
        if (self._isDone) {
          stream.destroy()
          return
        }
        buffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength
        )
        const lastOffset = this.getWriteOffset()

        // First try
        const [ok, done] = this.tryEnd(buffer, size)

        if (done) {
          stream.destroy()
        } else if (!ok) {
          // pause because backpressure
          stream.pause()

          // Register async handlers for drainage
          this.onWritable((offset) => {
            const [writeOk, writeDone] = this.tryEnd(
              buffer.slice(offset - lastOffset),
              size
            )
            if (writeDone) {
              stream.end()
            } else if (writeOk) {
              stream.resume()
            }
            return writeOk
          })
        }
      })
    }
    stream
      .on('error', () => {
        this.stream = -1
        if (!self._isDone) {
          this.writeStatus('500 Internal server error')
          this.end()
        }
        stream.destroy()
      })
      .on('end', () => {
        this.stream = 1
        if (!self._isDone) {
          this.end()
        }
      })

    return this
  }
}

module.exports = define
