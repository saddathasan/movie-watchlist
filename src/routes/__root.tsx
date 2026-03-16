import { Toaster } from '#/components/ui/sonner'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import Navbar from '#/components/Navbar'

import { AuthProvider } from '#/integrations/auth/provider'
import TanStackQueryProvider from '#/integrations/tanstack-query/root-provider'

import appCss from '#/styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'CineWatch — Movie Watchlist' },
      {
        name: 'description',
        content:
          'Search for movies, explore details, and build your personal watchlist.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <TanStackQueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster richColors position="top-right" />
            {/* <TanStackDevtools
              config={{ position: 'bottom-right' }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            /> */}
          </AuthProvider>
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
