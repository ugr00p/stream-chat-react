/* eslint-disable */
import React, { PureComponent } from 'react';
import { default as Media } from 'react-player';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import AttachmentActions from './AttachmentActions';

import Audio from './Audio';
import Card from './Card';
import File from './File';

import { Image } from '../Gallery';

export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/ogg',
  'video/webm',
  'video/quicktime',
];

/**
 * Attachment - The message attachment
 *
 * @example ../../docs/Attachment.md
 * @extends PureComponent
 */
class Attachment extends PureComponent {
  attachmentRef = React.createRef();
  static propTypes = {
    /**
     * The attachment to render
     * @see See [Attachment structure](https://getstream.io/chat/docs/#message_format)
     *
     *  */
    attachment: PropTypes.object.isRequired,
    /**
     *
     * Handler for actions. Actions in combination with attachments can be used to build [commands](https://getstream.io/chat/docs/#channel_commands).
     *
     * @param name {string} Name of action
     * @param value {string} Value of action
     * @param event Dom event that triggered this handler
     */
    actionHandler: PropTypes.func.isRequired,
    /**
     * Custom UI component for card type attachment
     * Defaults to [Card](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Card.js)
     */
    Card: PropTypes.elementType,
    /**
     * Custom UI component for file type attachment
     * Defaults to [File](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/File.js)
     */
    File: PropTypes.elementType,
    /**
     * Custom UI component for image type attachment
     * Defaults to [Image](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Image.js)
     */
    Image: PropTypes.elementType,
    /**
     * Custom UI component for audio type attachment
     * Defaults to [Audio](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Audio.js)
     */
    Audio: PropTypes.elementType,
    /**
     * Custom UI component for media type attachment
     * Defaults to [ReactPlayer](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/ReactPlayer.js)
     */
    Media: PropTypes.elementType,
    /**
     * Custom UI component for attachment actions
     * Defaults to [AttachmentActions](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/AttachmentActions.js)
     */
    AttachmentActions: PropTypes.elementType,
  };

  static defaultProps = {
    Card,
    Image,
    Audio,
    File,
    Media,
    AttachmentActions,
  };
  attachmentType(a) {
    let type, extra;
    if (a.actions && a.actions.length > 0) {
      extra = 'actions';
    }
    if (a.type === 'giphy' || a.type === 'imgur') {
      type = 'card';
    } else if (a.type === 'image' && (a.title_link || a.og_scrape_url)) {
      type = 'card';
    } else if (a.type === 'image') {
      type = 'image';
    } else if (
      a.mime_type &&
      SUPPORTED_VIDEO_FORMATS.indexOf(a.mime_type) !== -1
    ) {
      type = 'media';
    } else if (a.type === 'audio') {
      type = 'audio';
    } else if (
      a.type === 'file' ||
      (a.mime_type && SUPPORTED_VIDEO_FORMATS.indexOf(a.mime_type) === -1)
    ) {
      type = 'file';
    } else {
      type = 'card';
      extra = 'no-image';
    }

    return { type, extra };
  }

  renderAttachmentActions = (a) => {
    const { AttachmentActions } = this.props;

    return (
      <AttachmentActions
        key={'key-actions-' + a.id}
        {...a}
        actionHandler={this.props.actionHandler}
      />
    );
  };

  renderAttachment = (a) => (
    <div className="str-chat__attachment" key={`key-image-${a.id}`}>
      <Card {...a} key={`key-card-${a.id}`} />
      {this.renderAttachmentActions(a)}
    </div>
  );

  render() {
    const { attachment, Card, Image, Audio, Media, File } = this.props;
    if (!attachment) {
      return null;
    }

    const a = {
      id: uuidv4(),
      ...attachment,
    };
    const { type, extra } = this.attachmentType(a);
    if (type === 'card' && !a.title_link && !a.og_scrape_url) {
      return null;
    }
    const results = [];
    if (type === 'image') {
      if (a.actions && a.actions.length) {
        results.push(
          <div className="str-chat__attachment" key={`key-image-${a.id}`}>
            <Image {...a} />
            {this.renderAttachmentActions(a)}
          </div>,
        );
      } else {
        results.push(<Image {...a} key={`key-image-${a.id}`} />);
      }
    } else if (type === 'file') {
      a.asset_url &&
        results.push(<File attachment={a} key={`key-file-${a.id}`} />);
    } else if (type === 'audio') {
      results.push(
        <div className="str-chat__attachment" key={`key-video-${a.id}`}>
          <Audio og={a} />
        </div>,
      );
    } else if (type === 'media') {
      if (a.actions && a.actions.length) {
        results.push(
          <div
            className="str-chat__attachment str-chat__attachment-media"
            key={`key-video-${a.id}`}
          >
            <div className="str-chat__player-wrapper">
              <Media
                className="react-player"
                url={a.asset_url}
                width="100%"
                height="100%"
                controls
              />
            </div>
            {this.renderAttachmentActions(a)}
          </div>,
        );
      } else {
        results.push(
          <div className="str-chat__player-wrapper" key={`key-video-${a.id}`}>
            <Media
              className="react-player"
              url={a.asset_url}
              width="100%"
              height="100%"
              controls
            />
          </div>,
        );
      }
    } else {
      if (a.actions && a.actions.length) {
        results.push(this.renderAttachment(a));
      } else {
        results.push(<Card {...a} key={`key-card-${a.id}`} />);
      }
    }

    if (results.length === 0) return null;

    return (
      <div
        className={`str-chat__message-attachment str-chat__message-attachment--${type} str-chat__message-attachment--${a.type} str-chat__message-attachment--${type}--${extra}`}
        ref={this.attachmentRef}
      >
        {results}
      </div>
    );
  }
}

Attachment.propTypes = {};

export default Attachment;
