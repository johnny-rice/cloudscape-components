// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, DateRangePicker, DateRangePickerProps, SpaceBetween } from '~components';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { generatePlaceholder, i18nStrings, isValid } from './common';

const permutations = createPermutations<
  Pick<DateRangePickerProps, 'absoluteFormat' | 'dateOnly' | 'hideTimeOffset' | 'value' | 'granularity'>
>([
  {
    absoluteFormat: ['iso', 'long-localized'],
    dateOnly: [true, false],
    value: [
      {
        type: 'absolute',
        startDate: '2024-12-30',
        endDate: '2024-12-31',
      },
    ],
  },
  {
    absoluteFormat: ['iso', 'long-localized'],
    dateOnly: [true, false],
    hideTimeOffset: [true, false],
    value: [
      {
        type: 'absolute',
        startDate: '2024-12-30T00:00:00+01:00',
        endDate: '2024-12-31T23:59:59+01:00',
      },
    ],
  },
]);

export default function DateRangePickerPermutations() {
  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Absolute date range picker month calendar with custom absolute format</h1>
        <hr />
        <ScreenshotArea>
          <PermutationsView
            permutations={permutations}
            render={permutation => (
              <DateRangePicker
                value={permutation.value}
                absoluteFormat={permutation.absoluteFormat}
                dateOnly={permutation.dateOnly}
                granularity="day"
                hideTimeOffset={permutation.hideTimeOffset}
                locale="en-US"
                i18nStrings={i18nStrings}
                placeholder={generatePlaceholder(permutation.dateOnly, false)}
                relativeOptions={[]}
                isValidRange={value => isValid('day')(value)}
                rangeSelectorMode={'absolute-only'}
                getTimeOffset={() => 60}
              />
            )}
          />
        </ScreenshotArea>
      </SpaceBetween>
    </Box>
  );
}
