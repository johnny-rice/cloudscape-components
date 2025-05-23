// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import ChartPopover from '../internal/components/chart-popover';
import ChartSeriesDetails, { ExpandedSeries } from '../internal/components/chart-series-details';
import { Transition } from '../internal/components/transition';
import { HighlightDetails } from './format-highlighted';
import { ChartDataTypes, MixedLineBarChartProps } from './interfaces';

import styles from './styles.css.js';

export interface MixedChartPopoverProps<T extends ChartDataTypes> {
  containerRef: React.RefObject<HTMLDivElement>;
  trackRef: React.RefObject<SVGElement>;
  isOpen: boolean;
  isPinned: boolean;
  highlightDetails: null | HighlightDetails;
  onDismiss(): void;
  size: MixedLineBarChartProps<T>['detailPopoverSize'];
  footer?: React.ReactNode;
  dismissAriaLabel?: string;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  setPopoverText: (s: string) => void;
}

export default React.forwardRef(MixedChartPopover);

function MixedChartPopover<T extends ChartDataTypes>(
  {
    containerRef,
    trackRef,
    isOpen,
    isPinned,
    highlightDetails,
    footer,
    onDismiss,
    size = 'medium',
    dismissAriaLabel,
    onMouseEnter,
    onMouseLeave,
    onBlur,
    setPopoverText,
  }: MixedChartPopoverProps<T>,
  popoverRef: React.Ref<HTMLElement>
) {
  const [expandedSeries, setExpandedSeries] = useState<Record<string, ExpandedSeries>>({});
  return (
    <Transition in={isOpen}>
      {(state, ref) => (
        <div ref={ref} className={clsx(state === 'exiting' && styles.exiting)}>
          {(isOpen || state !== 'exited') && highlightDetails && (
            <ChartPopover
              ref={popoverRef}
              title={highlightDetails.position}
              trackRef={trackRef}
              trackKey={highlightDetails.position}
              dismissButton={isPinned}
              dismissAriaLabel={dismissAriaLabel}
              onDismiss={onDismiss}
              container={containerRef.current}
              size={size}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onBlur={onBlur}
              footer={footer}
            >
              <ChartSeriesDetails
                key={highlightDetails.position}
                details={highlightDetails.details}
                setPopoverText={setPopoverText}
                expandedSeries={expandedSeries[highlightDetails.position]}
                setExpandedState={(id, isExpanded) =>
                  setExpandedSeries(oldState => {
                    const expandedSeriesInCurrentCoordinate = new Set(oldState[highlightDetails.position]);
                    if (isExpanded) {
                      expandedSeriesInCurrentCoordinate.add(id);
                    } else {
                      expandedSeriesInCurrentCoordinate.delete(id);
                    }
                    return {
                      ...oldState,
                      [highlightDetails.position]: expandedSeriesInCurrentCoordinate,
                    };
                  })
                }
              />
            </ChartPopover>
          )}
        </div>
      )}
    </Transition>
  );
}
