export function createAlphaPayload() {
  const data = {
    id: "alpha",
    payload: {
      message: "Alpha variant",
      timestamp: Date.now()
    }
  };

  function format(data: { message: string; timestamp: number }) {
    return `${data.message}:${data.timestamp}`;
  }

  return {
    snapshot: data,
    summary: format({ message: data.payload.message, timestamp: data.payload.timestamp })
  };
}
