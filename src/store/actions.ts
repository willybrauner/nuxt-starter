import { ActionTree, ActionContext } from 'vuex'
import { Context, NuxtError } from '@nuxt/types'
import { AxiosError } from 'axios'
import { RoadizApiNSParams } from '@roadiz/abstract-api-client/dist/types/roadiz-api'
import { RootState } from '~/types/store'
import MutationType from '~/constants/mutation-type'
import { PageResponse } from '~/types/api'

const actions: ActionTree<RootState, RootState> = {
    async nuxtServerInit({ commit, dispatch }: ActionContext<RootState, RootState>, context: Context) {
        const { app, $roadiz, $sentry } = context

        await dispatch('fetchPage', context)
            .then((response: PageResponse) => {
                commit(MutationType.FIRST_PAGE_DATA, response)

                if (response.page && response.page.translation) {
                    app.i18n.locale = response.page.translation.locale
                }
            })
            .catch((requestError: AxiosError) => {
                $sentry.captureException(requestError)

                commit(MutationType.FIRST_PAGE_ERROR, {
                    statusCode: requestError.response?.status,
                    message: requestError.message,
                } as NuxtError)
            })

        return $roadiz
            .getCommonContent({
                _locale: app.i18n.locale,
                'node.visible': true,
            } as RoadizApiNSParams)
            .then((response) => {
                const { mainMenuWalker, head } = response.data

                if (head) commit(MutationType.HEAD_DATA, head)
                if (mainMenuWalker) commit(MutationType.MAIN_MENU_DATA, mainMenuWalker)
            })
    },
    fetchPage(_actionContext: ActionContext<RootState, RootState>, context: Context): Promise<PageResponse> {
        return context.$roadiz.getSingleNodesSourcesByPath(context.params.pathMatch).then((response) => {
            if (!response.data['@type']) {
                throw new Error('Fetched data is not typed.')
            }
            /*
             * TODO: Add custom data here according to response.data['@type']
             */
            switch (response.data['@type']) {
                default:
                    return {
                        page: response.data,
                        alternateLinks: context.$roadiz.getAlternateLinks(response),
                    }
            }
        })
    },
    updatePageData({ commit }: ActionContext<RootState, RootState>, data: PageResponse) {
        commit(MutationType.ALTERNATE_LINKS, data.alternateLinks || [])
    },
}

export default actions
