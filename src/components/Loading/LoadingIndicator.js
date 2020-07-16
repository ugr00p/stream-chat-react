/* eslint-disable */
// @ts-check
import React from 'react';

// @ts-ignore
import svg from '../../assets/str-chat__loading-indicator.svg';

/**
 * LoadingIndicator - Just a simple loading spinner..
 *
 * @example ../../docs/LoadingIndicator.md
 * @type { React.FC<import('types').LoadingIndicatorProps> }
 */

const LoadingIndicator = ({ size = 15, color = '#006CFF' }) => (
  <div
    className={'str-chat__loading-indicator ' + color}
    style={{ width: size, height: size }}
  >
    <svg
      width={size}
      height={size}
      viewBox={`0 0 30 30`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
          <stop stopColor="#FFF" stopOpacity="0" offset="0%" />
          <stop
            offset="100%"
            stopColor={color}
            stopOpacity="1"
            style={{ stopColor: color }}
          />
        </linearGradient>
      </defs>
      <path
        d="M2.518 23.321l1.664-1.11A12.988 12.988 0 0 0 15 28c7.18 0 13-5.82 13-13S22.18 2 15 2V0c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15-5.206 0-9.792-2.652-12.482-6.679z"
        fill="url(#a)"
        fillRule="evenodd"
      />
    </svg>
  </div>
);
export default React.memo(LoadingIndicator);
