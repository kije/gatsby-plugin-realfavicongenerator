declare module 'rfg-api' {
  import { AxiosError } from 'axios';
  export interface MasterPictureConfig {
    type: 'url' | 'inline';
    url?: string;
    content?: string;
  }
  export interface iOSFaviconDesign {
    master_picture?: MasterPictureConfig;
    picture_aspect?: 'background_and_margin' | 'no_change';
    margin?: number | string;
    background_color?: string;
    startup_image?: {
      master_picture?: MasterPictureConfig;
      picture_aspect?: 'background_and_margin' | 'no_change';
      margin?: number | string;
      background_color?: string;
    };
    assets?: {
      ios6_and_prior_icons?: boolean;
      ios7_and_later_icons?: boolean;
      precomposed_icons?: boolean;
      declare_only_default_icon?: boolean;
    };
  }

  export interface WindowsFaviconDesign {
    master_picture?: MasterPictureConfig;
    picture_aspect?: 'no_change' | 'white_silhouette';
    background_color?: string;
    assets?: {
      windows_80_ie_10_tile?: boolean;
      windows_10_ie_11_edge_tiles?: {
        small?: boolean;
        medium?: boolean;
        big?: boolean;
        rectangle?: boolean;
      };
    };
    app_name?: string;
  }

  export interface FirefoxAppFaviconDesign {
    master_picture?: MasterPictureConfig;
    picture_aspect?: 'circle' | 'no_change' | 'rounded_square' | 'square';
    keep_picture_in_circle?: boolean;
    circle_inner_margin?: number;
    background_color?: string;
    margin?: number | string;
    manifest?: {
      app_name?: string;
      app_description?: string;
      developer_name?: string;
      developer_url?: string;
    };
  }

  export interface AndroidChromeFaviconDesign {
    master_picture?: MasterPictureConfig;
    picture_aspect?: 'shadow' | 'no_change' | 'background_and_margin';
    background_color?: string;
    margin?: number | string;
    manifest: {
      name?: string;
      display?: 'standalone' | 'browser';
      orientation?: 'portrait' | 'landscape';
      start_url?: string;
      existing_manifest?: string;
      on_conflict?: 'raise_error' | 'override' | 'keep_existing';
    };
    assets?: {
      legacy_icon?: boolean;
      low_resolution_icons?: boolean;
    };
    theme_color?: string;
  }

  export interface SafariPinnedTabFaviconDesign {
    master_picture?: MasterPictureConfig;
    picture_aspect?: 'no_change' | 'silhouette' | 'background_and_margin';
    threshold?: number;
    theme_color?: string;
    background_color?: string;
    margin?: number | string;
  }

  export interface CoastFaviconDesign {
    master_picture?: MasterPictureConfig;
    picture_aspect?: 'no_change' | 'background_and_margin';
    background_color?: string;
    margin?: number | string;
  }

  export interface OpenGraphFaviconDesign {
    master_picture?: MasterPictureConfig;
    picture_aspect?: 'no_change' | 'background_and_margin';
    background_color?: string;
    margin?: number | string;
    ratio?: '1.91:1' | 'square';
    site_url?: string;
  }

  export interface YandexBrowserFaviconDesign {
    master_picture?: MasterPictureConfig;
    background_color?: string;
    manifest?: {
      show_title?: boolean;
      version?: string;
    };
  }

  export interface GenerateFaviconRequest {
    api_key: string;
    master_picture: MasterPictureConfig;
    files_location: {
      type: 'root' | 'path';
      path?: string;
    };
    favicon_design: {
      desktop_browser?: {};
      ios?: iOSFaviconDesign;
      windows?: WindowsFaviconDesign;
      firefox_app?: FirefoxAppFaviconDesign;
      android_chrome?: AndroidChromeFaviconDesign;
      safari_pinned_tab?: SafariPinnedTabFaviconDesign;
      coast?: CoastFaviconDesign;
      open_graph?: OpenGraphFaviconDesign;
      yandex_browser?: YandexBrowserFaviconDesign;
    };
    settings: {
      compression: number;
      scaling_algorithm:
        | 'Mitchell'
        | 'NearestNeighbor'
        | 'Cubic'
        | 'Bilinear'
        | 'Lanczos'
        | 'Spline';
      error_on_image_too_small: boolean;
      readme_file: boolean;
      html_code_file: boolean;
      use_path_as_is: boolean;
    };
    versioning?: {
      param_name: string;
      param_value: string;
    };
  }
  export interface GenerateFaviconResult {
    result: { status: string };
    favicon?: {
      package_url: string;
      files_urls: string[];
      html_code: string;
      compression: 'true' | 'false';
      overlapping_markups: string[];
    };
    files_location: { type: 'path' | 'root'; path?: string };
    preview_picture_url: string;
    version: string;
  }

  export interface RFGApi {
    fileToBase64(
      file: string,
      callback: (error: any, base64: string) => void,
    ): void;
    fileToBase64Sync(file: string): string;
    generateFavicon(
      request: GenerateFaviconRequest,
      dest: string,
      callback: (error: AxiosError, result: GenerateFaviconResult) => void,
    ): void;
  }

  export function init(): RFGApi;
}
