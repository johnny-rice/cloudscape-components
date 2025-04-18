// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import BreadcrumbGroup, { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group';
import { BreadcrumbItem } from '../../../lib/components/breadcrumb-group/item/item';
import createWrapper, { BreadcrumbGroupWrapper } from '../../../lib/components/test-utils/dom';

import breadcrumbItemStyles from '../../../lib/components/breadcrumb-group/item/styles.selectors.js';
import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

const renderBreadcrumbGroup = (props: BreadcrumbGroupProps) => {
  const { container } = render(<BreadcrumbGroup {...props} />);
  return createWrapper(container).findBreadcrumbGroup()!;
};

const items = [
  {
    text: 'Breadcrumb text',
    href: 'http://amazon.com',
  },
  {
    text: '',
    href: '',
  },
  {
    text: 'Last item',
    href: '#',
  },
];
describe('BreadcrumbGroup Item', () => {
  describe('properties', () => {
    let wrapper: BreadcrumbGroupWrapper;
    let links: Array<ElementWrapper>;

    beforeEach(() => {
      wrapper = renderBreadcrumbGroup({ items });
      links = wrapper.findBreadcrumbLinks();
    });

    test('text property displays content within rendered breadcrumb item element when non-empty', () => {
      expect(links[0].getElement()).toHaveTextContent(items[0].text);
    });

    test('text property contains no text when empty', () => {
      expect(links[1].getElement()).toHaveTextContent('');
    });

    test('href property mirrors the href property as href attribute', () => {
      expect(links[0].getElement()).toHaveAttribute('href', items[0].href);
    });

    test('href property has default value for the href attribute if it is empty', () => {
      expect(links[1].getElement()).toHaveAttribute('href', '#');
    });

    test('ariaCurrent property does not render by default', () => {
      expect(links[0].getElement()).not.toHaveAttribute('aria-current');
    });
  });

  describe('events', () => {
    let wrapper: BreadcrumbGroupWrapper;
    let links: Array<ElementWrapper>;
    let onClickSpy: jest.Mock;
    let onFollowSpy: jest.Mock;

    beforeEach(() => {
      onClickSpy = jest.fn();
      onFollowSpy = jest.fn();
      wrapper = renderBreadcrumbGroup({
        items,
        onClick: event => {
          event.preventDefault();
          onClickSpy(event.detail);
        },
        onFollow: event => onFollowSpy(event.detail),
      });
      links = wrapper.findBreadcrumbLinks();
    });

    test('fire a follow event when the item is clicked by left button and without a modifier', () => {
      links[0].click({ ctrlKey: true });
      links[0].click({ altKey: true });
      links[0].click({ shiftKey: true });
      links[0].click({ metaKey: true });
      links[0].click({ button: 1 });

      expect(onClickSpy).toHaveBeenCalledTimes(5);
      expect(onFollowSpy).not.toHaveBeenCalled();
    });

    test('fires a click and follow events when the breadcrumb item is clicked', () => {
      links[0].click();
      expect(onClickSpy).toHaveBeenCalledWith({ item: items[0], text: items[0].text, href: items[0].href });
      expect(onFollowSpy).toHaveBeenCalledWith({ item: items[0], text: items[0].text, href: items[0].href });
    });
  });

  describe('last item', () => {
    let wrapper: BreadcrumbGroupWrapper;
    let lastLink: ElementWrapper;
    const onClickSpy = jest.fn();
    const onFollowSpy = jest.fn();

    beforeEach(() => {
      wrapper = renderBreadcrumbGroup({ items, onClick: onClickSpy, onFollow: onFollowSpy });
      const links = wrapper.findBreadcrumbLinks();
      lastLink = links[links.length - 1];
    });

    test('should have proper aria-labels and focusable', () => {
      expect(lastLink.getElement()).toHaveAttribute('aria-current', 'page');
      expect(lastLink.getElement()).toHaveAttribute('aria-disabled');
      expect(lastLink.getElement().getAttribute('role')).toBe('link');
      expect(lastLink.getElement().getAttribute('tabindex')).toBe('0');
    });

    test('should not trigger click event', () => {
      lastLink.click();
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    test('should not trigger follow event', () => {
      lastLink.click();
      expect(onFollowSpy).not.toHaveBeenCalled();
    });
  });

  test('displays tooltip', () => {
    const { container } = render(
      <BreadcrumbItem
        itemIndex={0}
        totalCount={1}
        item={{ text: 'Long Breadcrumb text', href: '#' }}
        isTruncated={true}
      />
    );
    const elementAnchor = createWrapper(container).find(`.${breadcrumbItemStyles.anchor}`)!.getElement();
    elementAnchor.focus();
    expect(document.querySelector(`.${tooltipStyles.root}`)).not.toBeNull();
    elementAnchor.blur();
    expect(document.querySelector(`.${tooltipStyles.root}`)).toBeNull();
    fireEvent.mouseEnter(elementAnchor);
    expect(document.querySelector(`.${tooltipStyles.root}`)).not.toBeNull();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector(`.${tooltipStyles.root}`)).toBeNull();
  });
});
