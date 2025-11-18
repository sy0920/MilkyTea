import { reactive } from 'vue'
import * as authApi from '../api/auth'
import { getUser, setUser, clearAuth, getToken } from '../utils/auth'

const state = reactive({
    user: getUser(),
    token: getToken(),
    loading: false,
    error: null
})

const actions = {
    async fetchProfile() {
        state.loading = true
        state.error = null
        try {
            const profile = await authApi.getProfile()
            state.user = profile
            setUser(profile)
            return profile
        } catch (e) {
            state.error = e
            throw e
        } finally {
            state.loading = false
        }
    },
    async logout() {
        clearAuth()
        state.user = null
        state.token = null
    }
}

export default { state, actions }
