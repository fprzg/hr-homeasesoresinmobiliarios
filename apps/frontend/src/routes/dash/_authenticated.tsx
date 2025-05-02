import { createFileRoute, Navigate } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import LoginForm from '@/components/login'

const Component = () => {
    const context = Route.useRouteContext();
    if (!context.usuario) {
        return <LoginForm to="/dash" />;
    }

    return <Outlet />;
}

export const Route = createFileRoute('/dash/_authenticated')({
    beforeLoad: async ({ context }) => {
        const queryClient = context.queryClient;

        try {
            const data = await queryClient.fetchQuery(userQueryOptions);
            return data;
        } catch (error) {
            return { user: null };
        }
    },
    component: Component,
})