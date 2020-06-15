export const moveChannelUp = (cid, channels) => {
  // get channel index
  const channelIndex = channels.findIndex((channel) => channel.cid === cid);

  if (channelIndex <= 0) return channels;

  // get channel from channels
  const channel = channels[channelIndex];

  // remove channel from current position
  channels.splice(channelIndex, 1);
  // add channel at the start
  channels.unshift(channel);

  return [...channels];
};

export const getChannel = async (client, type, id) => {
  const channel = client.channel(type, id);
  await channel.watch();
  return channel;
};

export const MAX_QUERY_CHANNELS_LIMIT = 30;
