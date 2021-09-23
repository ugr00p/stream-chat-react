import React, { PropsWithChildren } from 'react';
import emojiRegex from 'emoji-regex';
import * as linkify from 'linkifyjs';
//@ts-expect-error
import findAndReplace from 'mdast-util-find-and-replace';
import RootReactMarkdown, { NodeType } from 'react-markdown';
import ReactMarkdown from 'react-markdown/with-html';
import uniqBy from 'lodash.uniqby';

import type { UserResponse } from 'stream-chat';

import type { DefaultUserType, UnknownType } from './types/types';

export const isOnlyEmojis = (text?: string) => {
  if (!text) return false;

  const noEmojis = text.replace(emojiRegex(), '');
  const noSpace = noEmojis.replace(/[\s\n]/gm, '');

  return !noSpace;
};

const allowedMarkups: NodeType[] = [
  'html',
  // @ts-expect-error
  'root',
  'text',
  'break',
  'paragraph',
  'emphasis',
  'strong',
  'link',
  'list',
  'listItem',
  'code',
  'inlineCode',
  'blockquote',
  'delete',
];

const matchMarkdownLinks = (message: string) => {
  const regexMdLinks = /\[([^[]+)\](\(.*\))/gm;
  const matches = message.match(regexMdLinks);
  const singleMatch = /\[([^[]+)\]\((.*)\)/;

  const links = matches
    ? matches.map((match) => {
        const i = singleMatch.exec(match);
        return i && [i[1], i[2]];
      })
    : [];

  return links.flat();
};

const messageCodeBlocks = (message: string) => {
  const codeRegex = /```[a-z]*\n[\s\S]*?\n```|`[a-z]*[\s\S]*?`/gm;
  const matches = message.match(codeRegex);
  return matches || [];
};

type MarkDownRenderers = {
  children: React.ReactElement;
  href?: string;
};

const markDownRenderers: { [nodeType: string]: React.ElementType } = {
  // eslint-disable-next-line react/display-name
  link: (props: MarkDownRenderers) => {
    const { children, href } = props;

    const isEmail = href?.startsWith('mailto:');
    const isUrl = href?.startsWith('http');

    if (!href || (!isEmail && !isUrl)) {
      return children;
    }

    return (
      <a
        className={`${isUrl ? 'str-chat__message-url-link' : ''}`}
        href={href}
        rel='nofollow noreferrer noopener'
        target='_blank'
      >
        {children}
      </a>
    );
  },
  span: 'span',
};

const emojiMarkdownPlugin = () => {
  function replace(match: RegExpMatchArray | null) {
    return {
      children: [{ type: 'text', value: match }],
      className: 'inline-text-emoji',
      type: 'span',
    };
  }

  const transform = <T extends unknown>(markdownAST: T) => {
    findAndReplace(markdownAST, emojiRegex(), replace);
    return markdownAST;
  };

  return transform;
};

const mentionsMarkdownPlugin = <Us extends DefaultUserType<Us> = DefaultUserType>(
  mentioned_users: UserResponse<Us>[],
) => () => {
  const mentioned_usernames = mentioned_users
    .map((user) => user.name || user.id)
    .filter(Boolean)
    .map(escapeRegExp);

  function replace(match: string) {
    const usernameOrId = match.replace('@', '');
    const user = mentioned_users.find(
      ({ id, name }) => name === usernameOrId || id === usernameOrId,
    );
    return {
      children: [{ type: 'text', value: match }],
      mentioned_user: user,
      type: 'mention',
    };
  }

  const transform = <T extends unknown>(markdownAST: T) => {
    if (!mentioned_usernames.length) {
      return markdownAST;
    }
    const mentionedUsersRegex = new RegExp(
      mentioned_usernames.map((username) => `@${username}`).join('|'),
      'g',
    );
    findAndReplace(markdownAST, mentionedUsersRegex, replace);
    return markdownAST;
  };

  return transform;
};

export type MentionProps<Us extends DefaultUserType<Us> = DefaultUserType> = {
  mentioned_user: UserResponse<Us>;
};

const Mention = <Us extends DefaultUserType<Us> = DefaultUserType>(
  props: PropsWithChildren<Us>,
) => <span className='str-chat__message-mention'>{props.children}</span>;

export type RenderTextOptions = {
  customMarkDownRenderers?: {
    [nodeType: string]: React.ElementType;
  };
};

export const renderText = <Us extends DefaultUserType<Us> = DefaultUserType>(
  text?: string,
  mentioned_users?: UserResponse<Us>[],
  options: RenderTextOptions = {},
) => {
  // take the @ mentions and turn them into markdown?
  // translate links
  if (!text) return null;

  let newText = text;
  const markdownLinks = matchMarkdownLinks(newText);
  const codeBlocks = messageCodeBlocks(newText);
  const detectHttp = /(http(s?):\/\/)?(www\.)?/;

  // extract all valid links/emails within text and replace it with proper markup
  uniqBy(linkify.find(newText), 'value').forEach(({ href, type, value }) => {
    const linkIsInBlock = codeBlocks.some((block) => block?.includes(value));

    // check if message is already  markdown
    const noParsingNeeded =
      markdownLinks &&
      markdownLinks.filter((text) => {
        const strippedHref = href?.replace(detectHttp, '');
        const strippedText = text?.replace(detectHttp, '');

        if (!strippedHref || !strippedText) return false;

        return strippedHref.includes(strippedText) || strippedText.includes(strippedHref);
      });

    if (noParsingNeeded.length > 0 || linkIsInBlock) return;

    const displayLink = type === 'email' ? value : value.replace(detectHttp, '');

    newText = newText.replace(
      new RegExp(escapeRegExp(value), 'g'),
      `[${displayLink}](${encodeURI(href)})`,
    );
  });

  const plugins = [emojiMarkdownPlugin];

  if (mentioned_users?.length) {
    plugins.push(mentionsMarkdownPlugin(mentioned_users));
  }

  const renderers = {
    mention: Mention,
    ...markDownRenderers,
    ...options.customMarkDownRenderers,
  };

  return (
    <ReactMarkdown
      allowedTypes={allowedMarkups}
      escapeHtml={true}
      plugins={plugins}
      renderers={renderers}
      source={newText}
      transformLinkUri={(uri) =>
        uri.startsWith('app://') ? uri : RootReactMarkdown.uriTransformer(uri)
      }
      unwrapDisallowed={true}
    />
  );
};

export function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// https://stackoverflow.com/a/6860916/2570866
export function generateRandomId() {
  // prettier-ignore
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export const smartRender = (
  ElementOrComponentOrLiteral: React.ComponentType,
  props?: UnknownType,
  fallback?: React.ComponentType | null,
) => {
  if (ElementOrComponentOrLiteral === undefined && fallback) {
    ElementOrComponentOrLiteral = fallback;
  }

  if (React.isValidElement(ElementOrComponentOrLiteral)) {
    // Flow cast through any, to make flow believe it's a React.Element
    const element = ElementOrComponentOrLiteral;
    return element;
  }

  // Flow cast through any to remove React.Element after previous check
  const ComponentOrLiteral = ElementOrComponentOrLiteral;

  if (
    typeof ComponentOrLiteral === 'string' ||
    typeof ComponentOrLiteral === 'number' ||
    typeof ComponentOrLiteral === 'boolean' ||
    ComponentOrLiteral == null
  ) {
    return ComponentOrLiteral;
  }

  return <ComponentOrLiteral {...props} />;
};
