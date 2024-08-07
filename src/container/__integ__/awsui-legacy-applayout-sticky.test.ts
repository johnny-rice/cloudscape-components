// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from '../../app-layout/__integ__/constants';

import appLayoutSelectors from '../../../lib/components/app-layout/test-classes/styles.selectors.js';

const appLayoutWrapper = createWrapper().findAppLayout();
const containerWrapper = appLayoutWrapper.findContentRegion().findContainer();
const containerHeaderSelector = containerWrapper.findHeader().toSelector();
const flashBarSelector = createWrapper().findFlashbar().toSelector();
const demoHeaderSelector = '#h';

class AppLayoutLegacyStickyPage extends BasePageObject {
  scrollTo(params: { top?: number; left?: number }) {
    return this.elementScrollTo(`.${appLayoutSelectors['disable-body-scroll-root']}`, params);
  }
}

describe.each(['classic', 'visualRefresh'])('In %s', type => {
  function setupTest({ viewport = viewports.desktop }, testFn: (page: AppLayoutLegacyStickyPage) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new AppLayoutLegacyStickyPage(browser);
      await page.setWindowSize(viewport);
      await browser.url(
        `#/light/app-layout/legacy-table-sticky-notifications/?visualRefresh=${type === 'visualRefresh'}`
      );
      await page.waitForVisible(appLayoutWrapper.findContentRegion().toSelector());
      await testFn(page);
    });
  }

  test(
    'Sticky header is offset by the height of the sticky notifications',
    setupTest({}, async page => {
      const { top: containerTopBefore } = await page.getBoundingBox(containerHeaderSelector);
      const { bottom: flashBarBottomBefore } = await page.getBoundingBox(flashBarSelector);
      expect(containerTopBefore).toBeGreaterThan(flashBarBottomBefore);
      await page.scrollTo({ top: 400 });
      const { top: containerTopAfter } = await page.getBoundingBox(containerHeaderSelector);
      const { bottom: flashBarBottomAfter } = await page.getBoundingBox(flashBarSelector);
      expect(containerTopAfter).toEqual(flashBarBottomAfter);
    })
  );

  test(
    'Sticky header is scrolled out of view in mobile viewports',
    setupTest({ viewport: viewports.mobile }, async page => {
      const { height: demoPageHeaderHeight } = await page.getBoundingBox(demoHeaderSelector);
      const { top: topBefore } = await page.getBoundingBox(containerHeaderSelector);
      expect(topBefore).toBeGreaterThan(demoPageHeaderHeight);
      await page.scrollTo({ top: 400 });
      const { top: topAfter } = await page.getBoundingBox(containerHeaderSelector);
      expect(topAfter).toBeLessThan(demoPageHeaderHeight);
    })
  );
});
