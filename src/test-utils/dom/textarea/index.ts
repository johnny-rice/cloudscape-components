// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import { act, setNativeValue } from '@cloudscape-design/test-utils-core/utils-dom';

import selectors from '../../../textarea/styles.selectors.js';

export default class TextareaWrapper extends ComponentWrapper<HTMLTextAreaElement> {
  static rootSelector: string = selectors.root;

  findNativeTextarea(): ElementWrapper<HTMLTextAreaElement> {
    return this.find<HTMLTextAreaElement>(`.${selectors.textarea}`)!;
  }

  /**
   * Gets the value of the component.
   *
   * Returns the current value of the textarea.
   */
  @usesDom getTextareaValue(): string {
    return this.findNativeTextarea().getElement().value;
  }

  /**
   * Sets the value of the component and calls the onChange handler.
   *
   * @param value value to set the textarea to.
   */
  @usesDom setTextareaValue(value: string): void {
    const element = this.findNativeTextarea().getElement();
    act(() => {
      const event = new Event('change', { bubbles: true, cancelable: false });
      setNativeValue(element, value);
      element.dispatchEvent(event);
    });
  }
}
