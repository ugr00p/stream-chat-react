import { nanoid } from 'nanoid';

export const generateChannel = (options = { channel: {} }) => {
  const { channel: optionsChannel, config, ...optionsBesidesChannel } = options;
  const id = optionsChannel?.id ?? nanoid();
  const type = optionsChannel?.type ?? 'messaging';
  return {
    members: [],
    messages: [],
    pinnedMessages: [],
    ...optionsBesidesChannel,
    // eslint-disable-next-line sort-keys
    channel: {
      cid: `${type}:${id}`,
      // eslint-disable-next-line sort-keys
      config: {
        automod: 'disabled',
        automod_behavior: 'flag',
        commands: [
          {
            args: '[text]',
            description: 'Post a random gif to the channel',
            name: 'giphy',
            set: 'fun_set',
          },
        ],
        connect_events: true,
        created_at: '2020-04-24T11:36:43.859020368Z',
        max_message_length: 5000,
        message_retention: 'infinite',
        mutes: true,
        name: 'messaging',
        reactions: true,
        read_events: true,
        replies: true,
        search: true,
        typing_events: true,
        updated_at: '2020-04-24T11:36:43.859022903Z',
        uploads: true,
        url_enrichment: true,
        ...config,
      },

      created_at: '2020-04-28T11:20:48.578147Z',

      created_by: {
        banned: false,
        created_at: '2020-04-27T13:05:13.847572Z',
        id: 'vishal',
        last_active: '2020-04-28T11:21:08.353026Z',
        online: false,
        role: 'user',
        updated_at: '2020-04-28T11:21:08.357468Z',
      },
      frozen: false,
      id,
      type,
      updated_at: '2020-04-28T11:20:48.578147Z',
      ...optionsChannel,
    },
  };
};
