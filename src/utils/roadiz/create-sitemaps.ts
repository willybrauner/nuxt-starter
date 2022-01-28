import RoadizApi from '@roadiz/abstract-api-client'
import toBoolean from '../to-boolean'

export default function createSitemaps(locales: Array<string>) {
    if (!process.env.API_URL || !process.env.API_KEY) {
        throw new Error('API credentials are not configured.')
    }

    if (!locales || locales.length < 1) {
        throw new Error('No available locale is configured.')
    }

    const $roadiz = new RoadizApi(
        process.env.API_URL,
        process.env.API_KEY,
        toBoolean(process.env.API_PREVIEW),
        toBoolean(process.env.API_DEBUG)
    )

    return locales.map((locale: string) => {
        return {
            path: `/sitemap/sitemap-${locale}.xml`,
            routes: async () => await $roadiz.fetchAllUrlsForLocale(locale),
        }
    })
}