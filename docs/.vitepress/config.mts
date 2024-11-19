import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AREA",
  description: "AREA Documentation",
  base: '/',
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Server', link: '/server' },
      { text: 'Client', link: '/client' },
    ],

    sidebar: [
      {
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          {
            text: 'Installation',
            items: [
              { text: 'Docker', link: '/installation/docker' },
              { text: 'From Source', link: '/installation/source' }
            ],
            link: '/installation'
          }
        ]
      },
      {
        text: 'Server',
        items: [
          { text: 'API', link: '/server/api' },
          { text: 'Database', link: '/server/database' }
        ]
      },
      {
        text: 'Client',
        items: [
          { text: 'Web app', link: '/client/app' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'http://github.com/AREA-equipe' }
    ]
  }
})
