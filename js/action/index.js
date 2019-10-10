import { onThemeChange, onShowCustomTheme, onThemeInit } from './theme';
import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } from './popular'
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } from './trending'
import { onLoadFavoriteData } from './favorite';
import { onLoadLanguage } from './language';
export default {
    onThemeChange,
    onShowCustomTheme,
    onThemeInit,
    onRefreshPopular,
    onLoadMorePopular,
    onRefreshTrending,
    onLoadMoreTrending,
    onLoadFavoriteData,
    onFlushPopularFavorite,
    onFlushTrendingFavorite,
    onLoadLanguage
}