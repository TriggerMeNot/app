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
            ],
          }
        ]
      },
      {
        text: 'Server',
        link: '/server',
        items: [
          { text: 'API', link: '/server/api' },
          { text: 'Database', link: '/server/database' },
          { text: 'Build', link: '/server/build' },
          { text: 'Architecture', link: '/server/architecture' },
          { text: 'Services', items: [
            { text: 'Github', link: '/server/services/github' },
            { text: 'Google', link: '/server/services/google' },
            { text: 'Microsoft', link: '/server/services/microsoft' },
            { text: 'Discord', link: '/server/services/discord' },
          ] },
          { text: 'Emails', link: '/server/emails' },
        ]
      },
      {
        text: 'Client',
        link: '/client',
        items: [
          { text: 'Technical Stack', link: '/client/stack' },
          { text: 'Build', link: '/client/build' },
        ]
      },
      {
        text: 'User Guide',
        link: '/user-guide',
        items: [
          { text: 'Register/Login', link: '/user-guide/register-login' },
          { text: 'Create a Playground', link: '/user-guide/create-playground' },
          { text: 'Create a Node', link: '/user-guide/create-node' },
          { text: 'Linking Nodes', link: '/user-guide/link-nodes' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TriggerMeNot/' }
    ]
  }
})
