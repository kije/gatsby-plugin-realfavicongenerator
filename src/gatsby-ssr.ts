import { GatsbySSR, RenderBodyArgs } from 'gatsby';
import { ReactNode } from 'react';
import { RESPONSE_PUBLIC_PATH } from './common';
import { readFileSync, pathExistsSync } from 'fs-extra';
import htmlParse from 'html-react-parser';
import { GenerateFaviconResult } from 'rfg-api';
import { RealFaviconPluginOptions } from './gatsby-node';

const onRenderBody: NonNullable<GatsbySSR['onRenderBody']> = (
  { setHeadComponents, reporter }: RenderBodyArgs,
  options: RealFaviconPluginOptions,
): any => {
  if (!pathExistsSync(RESPONSE_PUBLIC_PATH)) {
    reporter.warn(
      '[gatsby-plugin-realfavicongenerator] response from realfavicongenerator.net does not exist. Skipping adding meta-tags during SSR!',
    );
    return;
  }
  const { favicon }: GenerateFaviconResult = JSON.parse(
    readFileSync(RESPONSE_PUBLIC_PATH).toString(),
  );

  if (!favicon) {
    reporter.warn(
      '[gatsby-plugin-realfavicongenerator] could not read favicon html from realfavicongenerator.net response. Skipping adding meta-tags during SSR!',
    );
    return;
  }

  const components = htmlParse(favicon.html_code.replace('\n', '').trim());

  setHeadComponents(components as ReactNode[]);
};

export { onRenderBody };
