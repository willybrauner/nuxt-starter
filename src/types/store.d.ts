import { NuxtError } from '@nuxt/types'
import { RoadizAlternateLink } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { CommonContent, PageResponse } from '~/types/api'

interface RootState {
    firstPageData: PageResponse | null
    firstPageError: NuxtError | null
    previousPageData: PageResponse | null
    nextPageData: PageResponse | null
    commonContent: CommonContent | null
    windowWidth: number
    windowHeight: number
    alternateLinks: RoadizAlternateLink[]
    prefersReducedMotion: boolean
    scrollIsDisabled: boolean
}
