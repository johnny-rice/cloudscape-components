// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import { getDrawerStyles } from '../compute-layout';
import { AppLayoutInternals, InternalDrawer } from '../interfaces';
import { useResize } from './use-resize';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AppLayoutGlobalDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  show: boolean;
  activeGlobalDrawer: InternalDrawer | undefined;
}

function AppLayoutGlobalDrawerImplementation({
  appLayoutInternals,
  show,
  activeGlobalDrawer,
}: AppLayoutGlobalDrawerImplementationProps) {
  const {
    ariaLabels,
    globalDrawersFocusControl,
    isMobile,
    placement,
    onActiveGlobalDrawersChange,
    onActiveDrawerResize,
    minGlobalDrawersSizes,
    maxGlobalDrawersSizes,
    activeGlobalDrawersSizes,
    verticalOffsets,
    drawersOpenQueue,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeDrawerId = activeGlobalDrawer?.id ?? '';

  const computedAriaLabels = {
    closeButton: activeGlobalDrawer ? activeGlobalDrawer.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeGlobalDrawer ? activeGlobalDrawer.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const { drawerTopOffset, drawerHeight } = getDrawerStyles(verticalOffsets, isMobile, placement);
  const activeDrawerSize = (activeDrawerId ? activeGlobalDrawersSizes[activeDrawerId] : 0) ?? 0;
  const minDrawerSize = (activeDrawerId ? minGlobalDrawersSizes[activeDrawerId] : 0) ?? 0;
  const maxDrawerSize = (activeDrawerId ? maxGlobalDrawersSizes[activeDrawerId] : 0) ?? 0;
  const refs = globalDrawersFocusControl.refs[activeDrawerId];
  const resizeProps = useResize({
    currentWidth: activeDrawerSize,
    minWidth: minDrawerSize,
    maxWidth: maxDrawerSize,
    panelRef: drawerRef,
    handleRef: refs?.slider,
    onResize: size => onActiveDrawerResize({ id: activeDrawerId!, size }),
  });
  const size = getLimitedValue(minDrawerSize, activeDrawerSize, maxDrawerSize);
  const lastOpenedDrawerId = drawersOpenQueue.length ? drawersOpenQueue[0] : null;
  const hasTriggerButton = !!activeGlobalDrawer?.trigger;
  const animationDisabled = activeGlobalDrawer?.defaultActive && !drawersOpenQueue.includes(activeGlobalDrawer.id);

  return (
    <Transition nodeRef={drawerRef} in={show} appear={show} timeout={0}>
      {state => {
        return (
          <aside
            id={activeDrawerId}
            aria-hidden={!show}
            aria-label={computedAriaLabels.content}
            className={clsx(
              styles.drawer,
              styles['drawer-global'],
              styles[state],
              !animationDisabled && sharedStyles['with-motion-horizontal'],
              {
                [styles['drawer-hidden']]: !show,
                [styles['last-opened']]: lastOpenedDrawerId === activeDrawerId,
                [testutilStyles['active-drawer']]: show,
              }
            )}
            ref={drawerRef}
            onBlur={e => {
              // Drawers with trigger buttons follow this restore focus logic:
              // If a previously focused element exists, restore focus on it; otherwise, focus on the associated trigger button.
              // This function resets the previously focused element.
              // If the drawer has no trigger button and loses focus on the previously focused element, it defaults to document.body,
              // which ideally should never happen.
              if (!hasTriggerButton) {
                return;
              }

              if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                globalDrawersFocusControl.loseFocus();
              }
            }}
            style={{
              blockSize: drawerHeight,
              insetBlockStart: drawerTopOffset,
              ...(!isMobile && {
                [customCssProps.drawerSize]: `${['entering', 'entered'].includes(state) ? size : 0}px`,
              }),
            }}
            data-testid={`awsui-app-layout-drawer-${activeDrawerId}`}
          >
            {!isMobile && activeGlobalDrawer?.resizable && (
              <div className={styles['drawer-slider']}>
                <PanelResizeHandle
                  ref={refs?.slider}
                  position="side"
                  className={testutilStyles['drawers-slider']}
                  ariaLabel={activeGlobalDrawer?.ariaLabels?.resizeHandle}
                  tooltipText={activeGlobalDrawer?.ariaLabels?.resizeHandleTooltipText}
                  ariaValuenow={resizeProps.relativeSize}
                  onKeyDown={resizeProps.onKeyDown}
                  onDirectionClick={resizeProps.onDirectionClick}
                  onPointerDown={resizeProps.onPointerDown}
                />
              </div>
            )}
            <div
              className={clsx(styles['drawer-content-container'], sharedStyles['with-motion-horizontal'])}
              data-testid={`awsui-app-layout-drawer-content-${activeDrawerId}`}
            >
              <div className={clsx(styles['drawer-close-button'])}>
                <InternalButton
                  ariaLabel={computedAriaLabels.closeButton}
                  className={clsx({
                    [testutilStyles['active-drawer-close-button']]: activeDrawerId,
                  })}
                  formAction="none"
                  iconName={isMobile ? 'close' : 'angle-right'}
                  onClick={() => onActiveGlobalDrawersChange(activeDrawerId, { initiatedByUserAction: true })}
                  ref={refs?.close}
                  variant="icon"
                  analyticsAction="close"
                />
              </div>
              <div className={styles['drawer-content']} style={{ blockSize: drawerHeight }}>
                {activeGlobalDrawer?.content}
              </div>
            </div>
          </aside>
        );
      }}
    </Transition>
  );
}

export default AppLayoutGlobalDrawerImplementation;
