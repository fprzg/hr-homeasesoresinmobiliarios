import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'

const Component = () => {
    const context = Route.useRouteContext();
    const navigate= useNavigate();

    if (!context.usuario) {
        navigate({ to: "/dash/login" });
    }

    return <Outlet />;
}

export const Route = createFileRoute('/dash/_authenticated')({
    beforeLoad: async ({ context }) => {
        const queryClient = context.queryClient;

        try {
            const data = await queryClient.fetchQuery(userQueryOptions);
            return { usuario: data };
        } catch (error) {
            return { usuario: null };
        }
    },
    component: Component,
})