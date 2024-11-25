# AREA Client

## Tech Stack

Only Open Source and Free Software technologies are used in this project.

### Web Frontend

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)

We're using Vite + React (Typescript) for the frontend.

- Fast refresh
- TypeScript support
- Well documented
- Easy to use
- Know by the developers of the project

Comparaison with convurent technologies:

| React | Angular | Vue | Svelte |
| ----- | ------- | --- | ------ |
| Full framework & Most used library | Full framework | Full framework | Full framework |
| Easy to use | Hard to learn | Easy to learn | Easy to learn |
| Fast refresh | Slow refresh | Slow refresh | Fast refresh |
| TypeScript support | TypeScript support | TypeScript support | TypeScript support |
| Well documented | Well documented | Well documented | Well documented |
| Know by the developers of the project | Not know by the developers of the project | Not know by the developers of the project | Not know by the developers of the project |

In conclusion, React is the best choice for the project because it's easy to use, fast refresh, TypeScript support, well documented and know by the developers of the project.

### Mobile Frontend

[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)

For the mobile frontend, we're using Capacitor. It allows us to build cross-platform apps with web technologies.  
Our React frontend will be used for the mobile app and build as a APK for android users.

Capacitor works with everything, it can even build desktop apps !

| Capacitor | Cordova | Electron |
| --------- | ------- | -------- |
| Modern | Old | Modern |
| Easy to use | Hard to use | Easy to use |
| Fast | Slow | Slow |
| Works with everything | Works with everything | Works with everything |

In conclusion, Capacitor is the best choice for the project because it's modern, easy to use, fast and works with everything.


### Design

[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

We're using Tailwind CSS for the design of the frontend.

- Easy to use
- Fast
- Well documented

## Deployment

You can deploy using docker

```bash
docker-compose -f compose.prod.yml up -d
```

Now you can access the frontend at `http://localhost:80` !
(And get the client app at `http://localhost:80/client.apk`)
