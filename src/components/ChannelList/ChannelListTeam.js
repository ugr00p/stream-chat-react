/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Avatar } from '../Avatar';
import { ChatDown } from '../ChatDown';
import { LoadingChannels } from '../Loading';
import { withChatContext } from '../../context';

import chevrondown from '../../assets/str-chat__icon-chevron-down.svg';

/**
 * ChannelList - A preview list of channels, allowing you to select the channel you want to open
 * @example ../../docs/ChannelList.md
 */
export const ChannelListTeam = ({
  error,
  loading,
  sidebarImage,
  client,
  showSidebar,
  LoadingErrorIndicator,
  LoadingIndicator,
  children,
}) => {
  if (error) {
    return <LoadingErrorIndicator type="Connection Error" />;
  } else if (loading) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="str-chat__channel-list-team">
        {showSidebar && (
          <div className="str-chat__channel-list-team__sidebar">
            <div className="str-chat__channel-list-team__sidebar--top">
              <Avatar image={sidebarImage} size={50} />
            </div>
          </div>
        )}
        <div className="str-chat__channel-list-team__main">
          <div className="str-chat__channel-list-team__header">
            <div className="str-chat__channel-list-team__header--left">
              <Avatar
                source={client.user.image}
                name={client.user.name || client.user.id}
                size={40}
              />
            </div>
            <div className="str-chat__channel-list-team__header--middle">
              <div className="str-chat__channel-list-team__header--title">
                {client.user.name || client.user.id}
              </div>
              <div
                className={`str-chat__channel-list-team__header--status ${client.user.status}`}
              >
                {client.user.status}
              </div>
            </div>
            <div className="str-chat__channel-list-team__header--right">
              <button className="str-chat__channel-list-team__header--button">
                <img src={chevrondown} />
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }
};

ChannelListTeam.propTypes = {
  /** When true, loading indicator is shown - [LoadingChannels](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadingChannels.js) */
  loading: PropTypes.bool,
  /** When true, error indicator is shown - [ChatDown](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChatDown.js) */
  error: PropTypes.bool,
  /** Stream chat client object */
  client: PropTypes.object,
  /** When true, sidebar containing logo of the team is visible */
  showSidebar: PropTypes.bool,
  /** Url for sidebar logo image. */
  sidebarImage: PropTypes.string,
  /**
   * Loading indicator UI Component. It will be displayed if `loading` prop is true.
   *
   * Defaults to and accepts same props as:
   * [LoadingChannels](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadingChannels.js)
   *
   */
  LoadingIndicator: PropTypes.elementType,
  /**
   * Error indicator UI Component. It will be displayed if `error` prop is true
   *
   * Defaults to and accepts same props as:
   * [ChatDown](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChatDown.js)
   *
   */
  LoadingErrorIndicator: PropTypes.elementType,
};

ChannelListTeam.defaultProps = {
  error: false,
  LoadingIndicator: LoadingChannels,
  LoadingErrorIndicator: ChatDown,
};
export default withChatContext(ChannelListTeam);
