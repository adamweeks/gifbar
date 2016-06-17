declare module Giphy {

    export interface FixedHeight {
        url: string;
        width: string;
        height: string;
        size: string;
        mp4: string;
        mp4_size: string;
        webp: string;
        webp_size: string;
    }

    export interface FixedHeightStill {
        url: string;
        width: string;
        height: string;
    }

    export interface FixedHeightDownsampled {
        url: string;
        width: string;
        height: string;
        size: string;
        webp: string;
        webp_size: string;
    }

    export interface FixedWidth {
        url: string;
        width: string;
        height: string;
        size: string;
        mp4: string;
        mp4_size: string;
        webp: string;
        webp_size: string;
    }

    export interface FixedWidthStill {
        url: string;
        width: string;
        height: string;
    }

    export interface FixedWidthDownsampled {
        url: string;
        width: string;
        height: string;
        size: string;
        webp: string;
        webp_size: string;
    }

    export interface FixedHeightSmall {
        url: string;
        width: string;
        height: string;
        size: string;
        mp4: string;
        mp4_size: string;
        webp: string;
        webp_size: string;
    }

    export interface FixedHeightSmallStill {
        url: string;
        width: string;
        height: string;
    }

    export interface FixedWidthSmall {
        url: string;
        width: string;
        height: string;
        size: string;
        mp4: string;
        mp4_size: string;
        webp: string;
        webp_size: string;
    }

    export interface FixedWidthSmallStill {
        url: string;
        width: string;
        height: string;
    }

    export interface Downsized {
        url: string;
        width: string;
        height: string;
        size: string;
    }

    export interface DownsizedStill {
        url: string;
        width: string;
        height: string;
    }

    export interface DownsizedLarge {
        url: string;
        width: string;
        height: string;
        size: string;
    }

    export interface DownsizedMedium {
        url: string;
        width: string;
        height: string;
        size: string;
    }

    export interface Original {
        url: string;
        width: string;
        height: string;
        size: string;
        frames: string;
        mp4: string;
        mp4_size: string;
        webp: string;
        webp_size: string;
    }

    export interface OriginalStill {
        url: string;
        width: string;
        height: string;
    }

    export interface Looping {
        mp4: string;
    }

    export interface Images {
        fixed_height: FixedHeight;
        fixed_height_still: FixedHeightStill;
        fixed_height_downsampled: FixedHeightDownsampled;
        fixed_width: FixedWidth;
        fixed_width_still: FixedWidthStill;
        fixed_width_downsampled: FixedWidthDownsampled;
        fixed_height_small: FixedHeightSmall;
        fixed_height_small_still: FixedHeightSmallStill;
        fixed_width_small: FixedWidthSmall;
        fixed_width_small_still: FixedWidthSmallStill;
        downsized: Downsized;
        downsized_still: DownsizedStill;
        downsized_large: DownsizedLarge;
        downsized_medium: DownsizedMedium;
        original: Original;
        original_still: OriginalStill;
        looping: Looping;
    }

    export interface GiphyObject {
        type: string;
        id: string;
        slug: string;
        url: string;
        bitly_gif_url: string;
        bitly_url: string;
        embed_url: string;
        username: string;
        source: string;
        rating: string;
        content_url: string;
        source_tld: string;
        source_post_url: string;
        import_datetime: string;
        trending_datetime: string;
        images: Images;
    }

    export interface GiphyResponse {
        data: GiphyObject[];
        meta: GiphyResponseMeta;
        pagination: GiphyResponsePagination;
    }

    export interface GiphyResponseMeta {
        status: number;
        msg: string;
    }

    export interface GiphyResponsePagination {
        total_count: number;
        count: number;
        offset: number;
    }
}