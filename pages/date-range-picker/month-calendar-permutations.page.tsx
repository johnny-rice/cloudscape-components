// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import Calendar, { DateRangePickerCalendarProps } from '~components/date-range-picker/calendar';
import Dropdown from '~components/internal/components/dropdown';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common';

const intervals = [
  ['2021-08-01', '2021-08-31'],
  ['2021-08-02', '2021-09-01'],
  ['2021-08-09', '2021-08-16'],
  ['2021-08-30', '2021-08-31'],
  ['2021-08-31', '2021-09-22'],
  ['2021-08-10', '2021-08-14'],
  ['2021-08-03', '2021-08-09'],
  ['2021-05-10', '2021-05-31'],
  ['2021-05-10', '2021-05-30'],
  ['2024-12-15', '2025-01-15'],
  ['2025-01-15', '2025-01-15'],
];

const permutations = createPermutations<DateRangePickerCalendarProps>([
  // Selection range
  ...intervals.map(([startDate, endDate]) => ({
    value: [{ start: { date: startDate, time: '' }, end: { date: endDate, time: '' } }],
    setValue: [() => {}],
    locale: ['en-GB'],
    startOfWeek: [1],
    onChange: [() => {}],
    timeInputFormat: ['hh:mm:ss'] as const,
    i18nStrings: [i18nStrings],
    customAbsoluteRangeControl: [undefined],
  })),
  // Disabled dates
  {
    value: [{ start: { date: '2021-08-30', time: '' }, end: { date: '2021-09-03', time: '' } }],
    setValue: [() => {}],
    i18nStrings: [i18nStrings],
    isDateEnabled: [() => false, (date: Date) => date.getDate() % 2 !== 0],
    customAbsoluteRangeControl: [undefined],
  },
  // Date-only
  {
    value: [{ start: { date: '', time: '' }, end: { date: '', time: '' } }],
    setValue: [() => {}],
    i18nStrings: [i18nStrings],
    dateOnly: [true],
    customAbsoluteRangeControl: [undefined],
  },
  // Custom control
  {
    value: [{ start: { date: '', time: '' }, end: { date: '', time: '' } }],
    setValue: [() => {}],
    i18nStrings: [i18nStrings],
    customAbsoluteRangeControl: [() => 'Custom control'],
  },
]);

export default function DateRangePickerCalendarPage() {
  let i = -1;
  return (
    <Box padding="s">
      <h1>Date-range-picker month calendar page for screenshot tests</h1>
      <ScreenshotArea>
        <div style={{ blockSize: `${(1 + permutations.length) * 400}px` }}>
          <PermutationsView
            permutations={permutations}
            render={permutation => {
              i++;
              return (
                <div style={{ insetBlockStart: `${i * 400}px`, position: 'relative' }}>
                  <Dropdown
                    stretchWidth={true}
                    stretchHeight={true}
                    stretchToTriggerWidth={false}
                    open={true}
                    onDropdownClose={() => {}}
                    onMouseDown={() => {}}
                    trigger={null}
                  >
                    <Box padding="m">
                      <Calendar {...permutation} />
                    </Box>
                  </Dropdown>
                </div>
              );
            }}
          />
        </div>
      </ScreenshotArea>
    </Box>
  );
}
