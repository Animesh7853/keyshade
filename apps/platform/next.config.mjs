import path, { dirname } from 'path'
import { withSentryConfig } from '@sentry/nextjs'
import { fileURLToPath } from 'url'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    if (!isServer) {
      config.resolve.alias['@public'] = path.join(__dirname, 'public')
    }

    return config
  },
  transpilePackages: ['geist'],
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'keyshade',
  project: 'keyshade-platform',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: false,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
})
