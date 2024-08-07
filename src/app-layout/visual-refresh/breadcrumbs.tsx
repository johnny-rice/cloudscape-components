// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { highContrastHeaderClassName } from '../../internal/utils/content-header-utils';
import { useAppLayoutInternals } from './context';

import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';

export default function Breadcrumbs() {
  const { breadcrumbs, isMobile, headerVariant } = useAppLayoutInternals();

  if (isMobile || !breadcrumbs) {
    return null;
  }

  return (
    <div
      className={clsx(styles.breadcrumbs, testutilStyles.breadcrumbs, {
        [highContrastHeaderClassName]: headerVariant === 'high-contrast',
      })}
    >
      {breadcrumbs}
    </div>
  );
}
