// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Modal, SpaceBetween, Tabs } from '~components';
import Box from '~components/box';
import Button from '~components/button';

const EVALUATE_COMPONENT_VISIBILITY_EVENT = 'awsui-evaluate-component-visibility';

export default function ButtonsPerformanceMarkPage() {
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const dispatchEvaluateVisibilityEvent = () => {
    const event = new CustomEvent(EVALUATE_COMPONENT_VISIBILITY_EVENT);
    setTimeout(() => {
      document.dispatchEvent(event);
    }, 0);
  };

  return (
    <Box padding="xxl">
      <h1>Performance marks in buttons</h1>
      <SpaceBetween size="l">
        <label>
          <input type="checkbox" checked={loading} onChange={e => setLoading(e.target.checked)} id="loading" />
          Loading
        </label>
        <label>
          <input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} id="disabled" />
          Disabled
        </label>
        <label>
          <Button onClick={() => dispatchEvaluateVisibilityEvent()} id="evaluateComponentVisibility">
            Dispatch EvaluateVisibility Event
          </Button>
        </label>
        <Button variant="primary" loading={loading} disabled={disabled}>
          Primary button with loading and disabled props
        </Button>
        <Button variant="primary">Primary button</Button>
        <Button>Non-primary button</Button>

        <Modal visible={false} footer={<Button variant="primary">Submit modal</Button>}></Modal>

        <Tabs
          tabs={[
            {
              label: 'An empty tab',
              id: 'first',
              content: "There is nothing in this tab, but there's a button in the other tab.",
            },
            {
              label: 'A tab with a button',
              id: 'second',
              content: <Button variant="primary">This is the button in the tab</Button>,
            },
          ]}
        />
      </SpaceBetween>
    </Box>
  );
}
