import { GatsbyNode, ParentSpanPluginArgs, PluginOptions } from 'gatsby';
import {
  init as rfgApiInit,
  GenerateFaviconResult,
  GenerateFaviconRequest,
  iOSFaviconDesign,
  WindowsFaviconDesign,
  AndroidChromeFaviconDesign,
  SafariPinnedTabFaviconDesign,
  OpenGraphFaviconDesign,
} from 'rfg-api';
import path from 'path';
import { pathExists, copy } from 'fs-extra';
import { pickBy } from 'lodash';
import { AxiosError } from 'axios';

export interface RealFaviconPluginOptions extends PluginOptions {
  apiKey: string;
  masterPicture: string;
  appName: string;
  startUrl: string;
  themeColor: string;
  display?: 'standalone' | 'browser';
  forceOrientation?: 'portrait' | 'landscape';
  defaultBackgroundColor?: string;
  defaultMargin?: string | number;
  compression?: number;
  scalingAlgorithm?:
    | 'Mitchell'
    | 'NearestNeighbor'
    | 'Cubic'
    | 'Bilinear'
    | 'Lanczos'
    | 'Spline';
  ios?: {
    enabled: boolean;
    masterPicture?: string;
    margin?: string | number;
    backgroundColor?: string;
    startupImage?: {
      masterPicture?: string;
      margin?: string | number;
      backgroundColor?: string;
    };
    onlyDefaultIcons?: boolean;
    legacyIcons?: boolean;
    precomposedIcons?: boolean;
  };
  windows?: {
    enabled: boolean;
    masterPicture?: string;
    backgroundColor?: string;
    silhouette?: boolean;
  };
  android?: {
    enabled: boolean;
    masterPicture?: string;
    margin?: string | number;
    backgroundColor?: string;
    dropShadow?: boolean;
    legacyIcons?: boolean;
    lowResIcons?: boolean;
  };
  safariPinnedTab?: {
    enabled: boolean;
    masterPicture?: string;
    backgroundColor?: string;
    margin?: number | string;
    threshold?: number;
    silhouette?: boolean;
  };
  openGraph?: {
    enabled: boolean;
    masterPicture?: string;
    backgroundColor?: string;
    margin?: number | string;
    ratio?: '1.91:1' | 'square';
  };

  faviconRequestOverride?: GenerateFaviconRequest;
}

const defaultOptions: Partial<RealFaviconPluginOptions> = {
  display: 'standalone',
  compression: 3,
  scalingAlgorithm: 'Lanczos',
  ios: {
    enabled: true,
    onlyDefaultIcons: false,
    legacyIcons: true,
    precomposedIcons: true,
  },
  windows: {
    enabled: true,
  },
  android: {
    enabled: true,
    legacyIcons: true,
    lowResIcons: true,
  },
  safariPinnedTab: {
    enabled: true,
    silhouette: true,
    threshold: 60,
  },
  openGraph: {
    enabled: false,
  },
};

type Nullable<T> = {
  [P in keyof T]?: T[P] | null;
};

const CACHE_PATH = '.cache/realfavicongenerator';
const PUBLIC_PATH = '/favicons';
const REQUEST_DIGEST_CACHE_KEY = 'realfavicon-request-diggest';

const api = rfgApiInit();

function buildApiRequest({
  apiKey,
  masterPicture,
  appName,
  startUrl,
  themeColor,
  display,
  forceOrientation,
  defaultBackgroundColor,
  defaultMargin,
  compression,
  scalingAlgorithm,
  ios,
  windows,
  android,
  safariPinnedTab,
  openGraph,
  faviconRequestOverride,
}: RealFaviconPluginOptions): GenerateFaviconRequest {
  const filterConfig = <T extends object | null | undefined>(
    config: Nullable<T>,
  ): T =>
    pickBy(config, (val) => val !== null && typeof val !== 'undefined') as T;

  const getBase64Content = (masterPicture: string) => {
    const fullPath = path.resolve(masterPicture);
    return api.fileToBase64Sync(fullPath);
  };

  const faviconDesigns: GenerateFaviconRequest['favicon_design'] = {
    desktop_browser: {},
  };

  if (ios?.enabled) {
    const {
      masterPicture,
      margin,
      backgroundColor,
      startupImage,
      onlyDefaultIcons,
      legacyIcons,
      precomposedIcons,
    } = ios;

    faviconDesigns.ios = filterConfig<iOSFaviconDesign>({
      master_picture: masterPicture
        ? {
            type: 'inline',
            content: getBase64Content(masterPicture),
          }
        : null,
      picture_aspect:
        margin || defaultMargin ? 'background_and_margin' : 'no_change',
      margin: margin || defaultMargin,
      background_color: backgroundColor || defaultBackgroundColor,
      startup_image: startupImage
        ? filterConfig<iOSFaviconDesign['startup_image']>({
            master_picture: startupImage.masterPicture
              ? {
                  type: 'inline',
                  content: getBase64Content(startupImage.masterPicture),
                }
              : null,
            picture_aspect: startupImage.margin
              ? 'background_and_margin'
              : 'no_change',
            background_color: startupImage.backgroundColor,
            margin: startupImage.margin,
          })
        : null,
      assets: {
        ios6_and_prior_icons: legacyIcons,
        ios7_and_later_icons: true,
        precomposed_icons: precomposedIcons,
        declare_only_default_icon: onlyDefaultIcons,
      },
    });
  }

  if (windows?.enabled) {
    const { masterPicture, backgroundColor, silhouette } = windows;

    faviconDesigns.windows = filterConfig<WindowsFaviconDesign>({
      master_picture: masterPicture
        ? {
            type: 'inline',
            content: getBase64Content(masterPicture),
          }
        : null,
      picture_aspect: silhouette ? 'white_silhouette' : 'no_change',
      background_color: backgroundColor || defaultBackgroundColor,
      assets: {
        windows_80_ie_10_tile: true,
        windows_10_ie_11_edge_tiles: {
          small: true,
          medium: true,
          big: true,
          rectangle: true,
        },
      },
      app_name: appName,
    });
  }

  if (android?.enabled) {
    const {
      masterPicture,
      margin,
      backgroundColor,
      dropShadow,
      legacyIcons,
      lowResIcons,
    } = android;

    faviconDesigns.android_chrome = filterConfig<AndroidChromeFaviconDesign>({
      master_picture: masterPicture
        ? {
            type: 'inline',
            content: getBase64Content(masterPicture),
          }
        : null,
      picture_aspect: dropShadow
        ? 'shadow'
        : margin || defaultMargin
        ? 'background_and_margin'
        : 'no_change',
      margin: margin || defaultMargin,
      background_color: backgroundColor || defaultBackgroundColor,
      theme_color: themeColor,
      manifest: filterConfig<AndroidChromeFaviconDesign['manifest']>({
        name: appName,
        display: display,
        orientation: forceOrientation,
        start_url: startUrl,
      }),
      assets: {
        legacy_icon: legacyIcons,
        low_resolution_icons: lowResIcons,
      },
    });
  }

  if (safariPinnedTab?.enabled) {
    const {
      masterPicture,
      backgroundColor,
      margin,
      threshold,
      silhouette,
    } = safariPinnedTab;

    faviconDesigns.safari_pinned_tab = filterConfig<
      SafariPinnedTabFaviconDesign
    >({
      master_picture: masterPicture
        ? {
            type: 'inline',
            content: getBase64Content(masterPicture),
          }
        : null,
      picture_aspect: silhouette
        ? 'silhouette'
        : margin || defaultMargin
        ? 'background_and_margin'
        : 'no_change',
      margin: margin || defaultMargin,
      background_color: backgroundColor || defaultBackgroundColor,
      theme_color: themeColor,
      threshold,
    });
  }

  if (openGraph?.enabled) {
    const { masterPicture, backgroundColor, margin, ratio } = openGraph;

    faviconDesigns.open_graph = filterConfig<OpenGraphFaviconDesign>({
      master_picture: masterPicture
        ? {
            type: 'inline',
            content: getBase64Content(masterPicture),
          }
        : null,
      picture_aspect:
        margin || defaultMargin ? 'background_and_margin' : 'no_change',
      margin: margin || defaultMargin,
      background_color: backgroundColor || defaultBackgroundColor,
      ratio,
    });
  }

  return {
    api_key: apiKey,
    master_picture: {
      type: 'inline',
      content: getBase64Content(masterPicture),
    },
    files_location: {
      type: 'path',
      path: PUBLIC_PATH,
    },
    favicon_design: faviconDesigns,
    settings: {
      compression: compression || 3,
      scaling_algorithm: scalingAlgorithm || 'Lanczos',
      error_on_image_too_small: true,
      readme_file: false,
      html_code_file: false,
      use_path_as_is: false,
    },

    // user defined request
    ...faviconRequestOverride,
  };
}

function generateIcons(
  faviconRequest: GenerateFaviconRequest,
): Promise<GenerateFaviconResult> {
  return new Promise<GenerateFaviconResult>((resolve, reject) => {
    api.generateFavicon(
      faviconRequest,
      path.resolve(CACHE_PATH),
      (error: AxiosError, result: GenerateFaviconResult) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });
}

export const onPostBootstrap: NonNullable<GatsbyNode['onPostBootstrap']> = async (
  { reporter, parentSpan, cache, createContentDigest }: ParentSpanPluginArgs,
  pluginOptions: RealFaviconPluginOptions,
) => {
  const activity = reporter.activityTimer(
    `Generating manifest and related icons via realfavicongenerator.net`,
    {
      parentSpan,
    },
  );
  activity.start();

  const apiRequest = buildApiRequest(pluginOptions);
  const currentRequestDigest = createContentDigest(JSON.stringify(apiRequest));

  const requestDigest = await cache.get(REQUEST_DIGEST_CACHE_KEY);

  if (requestDigest !== currentRequestDigest) {
    reporter.info(
      '[gatsby-plugin-realfavicongenerator] Start favicon generation. This may take a while!',
    );
    try {
      await generateIcons({
        ...apiRequest,
        versioning: {
          param_name: 'version',
          param_value: currentRequestDigest,
        },
      });
      await cache.set(REQUEST_DIGEST_CACHE_KEY, currentRequestDigest);
    } catch (e) {
      reporter.error(
        `[gatsby-plugin-realfavicongenerator] ${e.message} (${e.response?.statusText})`,
      );
    }
  } else {
    reporter.info(
      '[gatsby-plugin-realfavicongenerator] Favicons already exist and config has not changed. Skipping favicon generation.',
    );
  }

  await copy(path.resolve(CACHE_PATH), path.join('public', PUBLIC_PATH));

  activity.end();
};
