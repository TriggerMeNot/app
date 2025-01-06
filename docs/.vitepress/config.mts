import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "TriggerMeNot",
  description: "TriggerMeNot Documentation",
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
          { text: 'Database', link: '/server/database' },
          { text: 'Build', link: '/server/build' },
          { text: 'Architecture', link: '/server/architecture' },
        ]
      },
      {
        text: 'Client',
        items: [
          { text: 'Technical Stack', link: '/client/stack' },
          { text: 'Build', link: '/client/build' },
        ]
      },
      {
        text: 'User Guide',
        items: [
          { text: 'Register/Login', link: '/user-guide/register-login' },
          { text: 'Create a Playground', link: '/user-guide/create-playground' },
          { text: 'Create a Node', link: '/user-guide/create-node' },
          { text: 'Linking Nodes', link: '/user-guide/link-nodes' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'http://github.com/AREA-equipe' }
    ]
  }
})
