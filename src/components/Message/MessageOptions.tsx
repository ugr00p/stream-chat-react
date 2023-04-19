import React from 'react';

import {
  ActionsIcon as DefaultActionsIcon,
  ReactionIcon as DefaultReactionIcon,
  ThreadIcon as DefaultThreadIcon,
} from './icons';
import { MESSAGE_ACTIONS, showMessageActionsBox } from './utils';

import { MessageActions } from '../MessageActions';

import { MessageContextValue, useMessageContext } from '../../context/MessageContext';

import type { DefaultStreamChatGenerics, IconProps } from '../../types/types';

export type MessageOptionsProps<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = Partial<Pick<MessageContextValue<StreamChatGenerics>, 'handleOpenThread'>> & {
  /* Custom component rendering the icon used in message actions button. This button invokes the message actions menu. */
  ActionsIcon?: React.ComponentType<IconProps>;
  displayLeft?: boolean;
  /* If true, show the `ThreadIcon` and enable navigation into a `Thread` component. */
  displayReplies?: boolean;
  /* React mutable ref that can be placed on the message root `div` of MessageActions component */
  messageWrapperRef?: React.RefObject<HTMLDivElement>;
  /* Custom component rendering the icon used in a button invoking reactions selector for a given message. */
  ReactionIcon?: React.ComponentType<IconProps>;
  /* Theme string to be added to CSS class names. */
  theme?: string;
  /* Custom component rendering the icon used in a message options button opening thread */
  ThreadIcon?: React.ComponentType<IconProps>;
};

const UnMemoizedMessageOptions = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  props: MessageOptionsProps<StreamChatGenerics>,
) => {
  const {
    ActionsIcon = DefaultActionsIcon,
    displayLeft = true,
    displayReplies = true,
    handleOpenThread: propHandleOpenThread,
    messageWrapperRef,
    ReactionIcon = DefaultReactionIcon,
    theme = 'simple',
    ThreadIcon = DefaultThreadIcon,
  } = props;

  const {
    customMessageActions,
    getMessageActions,
    handleOpenThread: contextHandleOpenThread,
    initialMessage,
    isMyMessage,
    message,
    onReactionListClick,
    threadList,
  } = useMessageContext<StreamChatGenerics>('MessageOptions');

  const handleOpenThread = propHandleOpenThread || contextHandleOpenThread;

  const messageActions = getMessageActions();
  const showActionsBox =
    showMessageActionsBox(messageActions, threadList) || !!customMessageActions;

  const shouldShowReactions = messageActions.indexOf(MESSAGE_ACTIONS.react) > -1;
  const shouldShowReplies =
    messageActions.indexOf(MESSAGE_ACTIONS.reply) > -1 && displayReplies && !threadList;

  if (
    !message.type ||
    message.type === 'error' ||
    message.type === 'system' ||
    message.type === 'ephemeral' ||
    message.status === 'failed' ||
    message.status === 'sending' ||
    initialMessage
  ) {
    return null;
  }

  if (isMyMessage() && displayLeft) {
    return (
      <div className={`str-chat__message-${theme}__actions`} data-testid='message-options-left'>
        {showActionsBox && (
          <MessageActions ActionsIcon={ActionsIcon} messageWrapperRef={messageWrapperRef} />
        )}
        {shouldShowReplies && (
          <button
            aria-label='Open Thread'
            className={`str-chat__message-${theme}__actions__action str-chat__message-${theme}__actions__action--thread`}
            data-testid='thread-action'
            onClick={handleOpenThread}
          >
            <ThreadIcon />
          </button>
        )}
        {shouldShowReactions && (
          <button
            aria-label='Open Reaction Selector'
            className={`str-chat__message-${theme}__actions__action str-chat__message-${theme}__actions__action--reactions`}
            data-testid='message-reaction-action'
            onClick={onReactionListClick}
          >
            <ReactionIcon />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`str-chat__message-${theme}__actions`} data-testid='message-options'>
      {shouldShowReactions && (
        <button
          aria-label='Open Reaction Selector'
          className={`str-chat__message-${theme}__actions__action str-chat__message-${theme}__actions__action--reactions`}
          data-testid='message-reaction-action'
          onClick={onReactionListClick}
        >
          <ReactionIcon />
        </button>
      )}
      {shouldShowReplies && (
        <button
          aria-label='Open Thread'
          className={`str-chat__message-${theme}__actions__action str-chat__message-${theme}__actions__action--thread`}
          data-testid='thread-action'
          onClick={handleOpenThread}
        >
          <ThreadIcon />
        </button>
      )}
      {showActionsBox && (
        <MessageActions ActionsIcon={ActionsIcon} messageWrapperRef={messageWrapperRef} />
      )}
    </div>
  );
};

export const MessageOptions = React.memo(
  UnMemoizedMessageOptions,
) as typeof UnMemoizedMessageOptions;
