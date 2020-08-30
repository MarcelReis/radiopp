export function extractRadio(data: any) {
  return {
    id: data.id as number,
    name: data.name as string,
    originalURL: data.originalURL as string,
    thumb: data.thumb as string,
    website: data.website as string,
    streamURL: data.streamURL as string,
    location: extractLocation(data),
    schedule: data.schedule as any,
  };
}

export function extractLocation(data: any) {
  return {
    city: data.city as string,
    state: data.state as string,
    country: data.country as string,
    region: data.region as string,
  };
}
