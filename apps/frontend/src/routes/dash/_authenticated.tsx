import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

function Login() {
    return <div>You have to login!</div>
}

const Component = () => {
    const { user } = Route.useRouteContext();
    if (!user) {
        return <Login />;
    }

    return <Outlet />;
}

export const Route = createFileRoute('/dash/_authenticated')({
    beforeLoad: async ({ context }) => {
        const queryClient = context.queryClient;

        try {
            const data = queryClient.fetchQuery(useQueryOptions);
            return data;
        } catch (e) {
            return { user: null };
        }
    },
    component: Component,
})