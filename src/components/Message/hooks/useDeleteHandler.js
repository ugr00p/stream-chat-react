// @ts-check
import { useContext } from 'react';
import { ChannelContext } from '../../../context';

/**
 * @type {(message: import('stream-chat').MessageResponse | undefined) =>  (event: React.MouseEvent<HTMLElement>) => Promise<void>}
 */
export const useDeleteHandler = (message) => {
  const { updateMessage, client } = useContext(ChannelContext);
  return async (event) => {
    event.preventDefault();
    if (!message?.id || !client || !updateMessage) {
      return;
    }
    const data = await client.deleteMessage(message.id);
    updateMessage(data.message);
  };
};
