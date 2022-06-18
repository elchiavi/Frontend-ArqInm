import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Clientes',
    icon: 'people',
    link: '/pages/clients',
  },
  {
    title: 'Multi Familiar',
    icon: 'film',
    link: '/pages/multiProjects',
  },
  {
    title: 'Uni Familar',
    icon: 'home',
    link: '/pages/projects',
    home: true,
  },
  {
    title: 'Usuarios',
    icon: 'person',
    link: '/pages/users',
  },
];
