import { useQuery } from '@tanstack/react-query'
import { userQueryOptions } from '@/lib/api'

export const useAuthUser = () => {
    const query = useQuery(userQueryOptions)

    return {
        usuario: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
    }
}
